#
# Build and run LADA-client
#
# Build with e.g. `docker build --force-rm=true -t koala/lada_client .'
# Run from the repository root-dir with e.g.
# `docker run --name lada_client -v $PWD:/usr/local/apache2/htdocs/
#             --link lada_wildfly:lada-server -p 8182:80 -d koala/lada_client'
#
# The linked container may be created from the Dockerfile in the lada-server
# repository.
#
# The LADA-application will be available under http://yourdockerhost:8182
#

FROM httpd:2.4
MAINTAINER tom.gottfried@intevation.de

RUN apt-get update -y && apt-get install -y curl unzip python

ADD . /usr/local/apache2/htdocs/
WORKDIR /usr/local/apache2/htdocs/

#
# Install dependencies
#
RUN ./install-dependencies.sh

#
# httpd setup
#
RUN ln -sf $PWD/custom-httpd.conf $HTTPD_PREFIX/conf/httpd.conf
RUN ln -sf $PWD/custom-vhosts.conf $HTTPD_PREFIX/conf/extra/httpd-vhosts.conf

CMD ["httpd-foreground"]
