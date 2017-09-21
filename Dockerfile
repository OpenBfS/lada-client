#
# Build and run LADA-client
#
# Build with e.g. `docker build --force-rm=true -t koala/lada_client .'
# Run from the repository root-dir with e.g.
# `docker run --name lada_client
#             --link lada_wildfly:lada-server
#             -p 8180-8184:80-84 -d koala/lada_client'
#
# The linked container may be created from the Dockerfile in the lada-server
# repository.
#
# The LADA-application will be available under http://yourdockerhost:8182
#
# Add `-v $PWD:/var/www/html/' to the run-command if you want to
# test your local changes (you'll have to run ./install-dependencies.sh again).
#

FROM debian:jessie
MAINTAINER tom.gottfried@intevation.de

RUN apt-get update -y && apt-get install -y curl unzip python apache2 openjdk-8-jre

ADD . /var/www/html
WORKDIR /var/www/html

#
# Install dependencies
#
RUN ./install-dependencies.sh

#
# httpd setup
#
RUN a2enmod proxy
RUN a2enmod proxy_http
RUN a2enmod headers
RUN ln -sf $PWD/custom-vhosts.conf /etc/apache2/conf-available/lada.conf
RUN a2enconf lada

EXPOSE 80 81 82 83 84

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
