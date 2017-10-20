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
    curl unzip openjdk-7-jre && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ADD . /usr/local/apache2/htdocs
WORKDIR /usr/local/apache2/htdocs

#
# Install dependencies and build application
#
RUN ./install-dependencies.sh
RUN ./docker-build-app.sh

#
# httpd setup
#
RUN ln -sf $PWD/custom-httpd.conf $HTTPD_PREFIX/conf/httpd.conf
RUN ln -sf $PWD/custom-vhosts.conf $HTTPD_PREFIX/conf/httpd-vhosts.conf

EXPOSE 80 81 82 83 84

CMD ["httpd-foreground"]
