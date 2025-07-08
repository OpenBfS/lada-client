#
# Build and run LADA-client
#
# Build with e.g. `docker build --force-rm=true -t bfs/lada_client .'
# Run from the repository root-dir with e.g.
# `docker run --name lada_client
#             --link lada_wildfly:server
#             -p 8180-8184:80-84 -d bfs/lada_client'
#
# The linked container may be created from the Dockerfile in the lada-server
# repository.
#
# The LADA-application will be available under http://yourdockerhost:8182
#

FROM httpd:bullseye AS base
LABEL maintainer="aschumacher@bfs.de"

ENV DEBIAN_FRONTEND=noninteractive
ENV OPENSSL_CONF=/etc/ssl/

#
# Install required packages
#

RUN mkdir -p /usr/share/man/man1/ && apt-get -qq update && apt-get -qq install \
    curl unzip default-jre-headless git libapache2-mod-shib && \
    apt-get -qq clean && rm -rf /var/lib/apt/lists/*


RUN mkdir /usr/local/lada
WORKDIR /usr/local/lada

ADD *.sh /usr/local/lada/

#
# Install dependencies
#
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

FROM base AS development
LABEL maintainer="aschumacher@bfs.de"
EXPOSE 80 81 82 83 84
COPY --from=base /usr/local/lada/. /usr/local/lada
RUN ln -s /usr/local/lada/ /usr/local/apache2/htdocs/lada
ADD custom-vhosts.conf ./
ADD custom-httpd.conf ./
RUN ln -sf $PWD/custom-httpd.conf $HTTPD_PREFIX/conf/httpd.conf;\
    ln -sf $PWD/custom-vhosts.conf $HTTPD_PREFIX/conf/extra/httpd-vhosts.conf;

WORKDIR /usr/local/lada
RUN sed -i -e "/Lada.clientVersion/s/';/ $(git rev-parse --short HEAD)';/" app.js;
RUN echo build $(grep Lada.clientVersion app.js | cut -d '=' -f 2 | cut -d "'" -f 2) && ./docker-build-app.sh
RUN mkdir -p /usr/local/apache2/htdocs/build/production/
RUN ln -s /usr/local/lada/build/production/Lada /usr/local/apache2/htdocs/build/production

FROM base AS build
COPY --from=base /usr/local/lada/. /usr/local/lada
WORKDIR /usr/local/lada
#
# build application
#

RUN echo build $(grep Lada.clientVersion app.js | cut -d '=' -f 2 | cut -d "'" -f 2) && ./docker-build-app.sh production

FROM httpd:2.4 AS deploy
LABEL maintainer="aschumacher@bfs.de"

RUN set -x && apt-get -y update && apt-get -y install curl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/apache2/htdocs/

COPY --from=build /usr/local/lada/build/production/Lada/. /usr/local/apache2/htdocs/
# chown to www-data and its login group(:)
RUN chown -R www-data: .

CMD ["httpd-foreground"]
HEALTHCHECK --start-period=30s CMD curl http://localhost/