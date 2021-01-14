# See README.markdown in the LADA server repository for usage hints

FROM centos:centos7
MAINTAINER mlechner@bfs.de

ENV HTTPD_PREFIX=/etc/httpd \
    JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk \
    INSTALL4J_JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk
ENV OPENSSL_CONF /etc/ssl/

#
# Install required packages
#
RUN yum clean expire-cache && \
    yum install -y yum-plugin-ovl && \
    yum install -y which curl gzip unzip tar java-1.8.0-openjdk-devel git \
                   libsemanage httpd ca-certificates

#Workaround for cap_set_file bug: Use centos 6 and add repo manually
ADD shibboleth/shibboleth.repo /etc/yum.repos.d/

RUN yum install -y shibboleth.x86_64


EXPOSE 80 81 82 83 84 85

# httpd setup

RUN sed -i -e "/^#LoadModule proxy_module/s/#//;/^#LoadModule proxy_http_module/s/#//;/^#Include conf.*httpd-vhosts.conf/s/#//" $HTTPD_PREFIX/conf/httpd.conf

RUN mkdir /usr/local/lada
RUN rm -rf /var/www/html && ln -s /usr/local/lada/ /var/www/html
WORKDIR /usr/local/lada

ADD custom-vhosts.conf ./
RUN ln -sf $PWD/custom-vhosts.conf $HTTPD_PREFIX/conf.d/httpd-vhosts.conf

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

# Add shibboleth config
ADD shibboleth /usr/local/lada/shibboleth
RUN ln -sf /usr/local/lada/shibboleth/shibboleth2.xml \
       /etc/shibboleth/shibboleth2.xml && \
    ln -s /usr/local/lada/shibboleth/partner-metadata.xml \
          /etc/shibboleth/partner-metadata.xml && \
    ln -sf /usr/local/lada/shibboleth/attribute-map.xml \
          /etc/shibboleth/attribute-map.xml && \
    ln -sf /usr/local/lada/shibboleth/shibd.logger \
          /etc/shibboleth/shibd.logger
RUN cp /usr/local/lada/shibboleth/etc/*.pem /etc/shibboleth

# set version info
RUN sed -i -e "/Lada.clientVersion/s/';/ $(git rev-parse --short HEAD)';/" app.js

# build application
#
RUN echo build $(grep Lada.clientVersion app.js | cut -d '=' -f 2 | cut -d "'" -f 2) && ./docker-build-app.sh

CMD export LANG=en_US.UTF-8 && /usr/sbin/httpd && /usr/sbin/shibd -f -F
