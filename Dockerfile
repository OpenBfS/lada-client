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

ENV LADA_HOME=/usr/local/lada
RUN mkdir $LADA_HOME

# Install dependencies
ADD install-sencha2opt.sh $LADA_HOME/
RUN $LADA_HOME/install-sencha2opt.sh
WORKDIR /opt
ADD install-dependencies.sh $LADA_HOME/
RUN $LADA_HOME/install-dependencies.sh

ADD overrides $LADA_HOME/overrides
ADD resources $LADA_HOME/resources
ADD sass $LADA_HOME/sass

ADD index.html $LADA_HOME/

ADD *.js *.json $LADA_HOME/
ADD app $LADA_HOME/app
ADD Koala $LADA_HOME/Koala
ADD .git $LADA_HOME/.git
ADD .sencha $LADA_HOME/.sencha
ADD build.xml $LADA_HOME/
ADD docker-build-app.sh $LADA_HOME/

###############
# Build stage #
###############
FROM base AS build
COPY --from=base $LADA_HOME/. $LADA_HOME
WORKDIR $LADA_HOME

# build application
RUN echo build $(grep Lada.clientVersion app.js | cut -d '=' -f 2 | cut -d "'" -f 2) && ./docker-build-app.sh production

#####################
# Development stage #
#####################
FROM base AS development
COPY --from=base $LADA_HOME/. $LADA_HOME
WORKDIR $LADA_HOME
RUN sed -i -e "/Lada.clientVersion/s/';/ $(git rev-parse --short HEAD)';/" app.js;
RUN ./docker-build-app.sh development

EXPOSE 80 81 82 83 84

RUN mkdir -p /usr/share/man/man1/ && apt-get -qq update && apt-get -qq install \
    libapache2-mod-shib && apt-get -qq clean && rm -rf /var/lib/apt/lists/*

RUN ln -s $LADA_HOME/ $HTTPD_PREFIX/htdocs/lada

RUN mkdir -p $HTTPD_PREFIX/htdocs/build/production/
COPY --from=build $LADA_HOME/build/production/. $HTTPD_PREFIX/htdocs/build/production

RUN sed -i -e '/^#LoadModule proxy_module/s/#//;/^#LoadModule proxy_http_module/s/#//;/^#LoadModule deflate_module/s/#//' $HTTPD_PREFIX/conf/httpd.conf
WORKDIR $LADA_HOME
ADD custom-vhosts.conf ./
RUN sed -i "$ a \Include $PWD/custom-vhosts.conf" $HTTPD_PREFIX/conf/httpd.conf

ADD start-dev-client.sh $LADA_HOME/

CMD ["bash", "/usr/local/lada/start-dev-client.sh"]

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
