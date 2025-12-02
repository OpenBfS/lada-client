################################
# Common base for build stages #
################################
FROM httpd:bullseye AS base
LABEL maintainer="aschumacher@bfs.de"

ENV DEBIAN_FRONTEND=noninteractive
ENV OPENSSL_CONF=/etc/ssl/

# Install required packages
RUN mkdir -p /usr/share/man/man1/ && apt-get -qq update && apt-get -qq install \
    curl unzip default-jre-headless git && \
    apt-get -qq clean && rm -rf /var/lib/apt/lists/*


RUN mkdir /usr/local/lada
WORKDIR /usr/local/lada

ADD *.sh /usr/local/lada/

# Install dependencies
RUN ./install-sencha2opt.sh
RUN ./install-dependencies.sh

ADD overrides /usr/local/lada/overrides
ADD resources /usr/local/lada/resources
ADD sass /usr/local/lada/sass

ADD index.html /usr/local/lada/

ADD *.js *.json /usr/local/lada/
ADD app /usr/local/lada/app
ADD Koala /usr/local/lada/Koala
ADD .git /usr/local/lada/.git
ADD .sencha /usr/local/lada/.sencha
ADD build.xml /usr/local/lada/

###############
# Build stage #
###############
FROM base AS build
COPY --from=base /usr/local/lada/. /usr/local/lada
WORKDIR /usr/local/lada

# build application
RUN echo build $(grep Lada.clientVersion app.js | cut -d '=' -f 2 | cut -d "'" -f 2) && ./docker-build-app.sh production

###################
# Dev build stage #
###################
FROM base AS development-build
COPY --from=base /usr/local/lada/. /usr/local/lada
WORKDIR /usr/local/lada
RUN sed -i -e "/Lada.clientVersion/s/';/ $(git rev-parse --short HEAD)';/" app.js;
RUN ./docker-build-app.sh development

########################
# Dev deployment stage #
########################
FROM httpd:2.4 AS development
EXPOSE 80 81 82 83 84

RUN mkdir -p /usr/share/man/man1/ && apt-get -qq update && apt-get -qq install \
    libapache2-mod-shib && apt-get -qq clean && rm -rf /var/lib/apt/lists/*

COPY --from=development-build /usr/local/lada/. /usr/local/lada
RUN ln -s /usr/local/lada/ $HTTPD_PREFIX/htdocs/lada

RUN mkdir -p $HTTPD_PREFIX/htdocs/build/production/
COPY --from=build /usr/local/lada/build/production/. $HTTPD_PREFIX/htdocs/build/production

RUN sed -i -e '/^#LoadModule proxy_module/s/#//;/^#LoadModule proxy_http_module/s/#//;/^#LoadModule deflate_module/s/#//' $HTTPD_PREFIX/conf/httpd.conf
WORKDIR /usr/local/lada
ADD custom-vhosts.conf ./
RUN sed -i "$ a \Include $PWD/custom-vhosts.conf" $HTTPD_PREFIX/conf/httpd.conf

###############################
# Productive deployment stage #
###############################
FROM httpd:2.4 AS deploy
LABEL maintainer="aschumacher@bfs.de"

RUN set -x && apt-get -y update && apt-get -y install curl && rm -rf /var/lib/apt/lists/*

WORKDIR $HTTPD_PREFIX/htdocs/

COPY --from=build /usr/local/lada/build/production/Lada/. $HTTPD_PREFIX/htdocs/
# chown to www-data and its login group(:)
RUN chown -R www-data: .

CMD ["httpd-foreground"]
HEALTHCHECK --start-period=30s CMD curl http://localhost/
