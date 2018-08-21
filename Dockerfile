#
# Build and run LADA-client
#
# Build with e.g. `docker build --force-rm=true -t bfs/lada_client .'
# Run from the repository root-dir with e.g.
# `docker run --name lada_client
#             --link lada_wildfly:lada-server
#             -p 8180-8184:80-84 -d bfs/lada_client'
#
# The linked container may be created from the Dockerfile in the lada-server
# repository.
#
# The LADA-application will be available under http://yourdockerhost:8182
#

FROM httpd:2.4
MAINTAINER mlechner@bfs.de

ENV DEBIAN_FRONTEND noninteractive

#
# Install required packages
#

RUN apt-get update -y && apt-get install -y \
    curl unzip openjdk-7-jre git && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

EXPOSE 80 81 82 83 84

CMD ["httpd-foreground"]
#
# httpd setup
#
ADD custom-vhosts.conf $HTTPD_PREFIX/conf/extra/httpd-vhosts.conf
RUN sed -i -e "/^#LoadModule proxy_module/s/#//;/^#LoadModule proxy_http_module/s/#//;/^#Include conf.*httpd-vhosts.conf/s/#//" $HTTPD_PREFIX/conf/httpd.conf

RUN mkdir /usr/local/lada
RUN rm -rf /usr/local/apache2/htdocs && ln -s /usr/local/lada/ /usr/local/apache2/htdocs
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
ADD .git /usr/local/lada/.git

RUN GITINFO=" $(git name-rev --name-only HEAD 2>/dev/null) $(git rev-parse --short HEAD 2>/dev/null)" &&\
    sed -i -e "/Lada.clientVersion/s/';/$GITINFO';/" app.js

#
# build application
#

RUN echo build $(grep Lada.clientVersion app.js | cut -d '=' -f 2 | cut -d "'" -f 2) && ./docker-build-app.sh
