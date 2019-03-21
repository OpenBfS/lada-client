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

FROM centos:centos6
MAINTAINER mlechner@bfs.de

ENV HTTPD_PREFIX=/etc/httpd \
    JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk \
    INSTALL4J_JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk

#
# Install required packages
#
RUN yum clean expire-cache && \
    yum install -y yum-plugin-ovl && \
    yum install -y which curl gzip unzip tar java-1.8.0-openjdk-devel git \
                   httpd ca-certificates

#Workaround for cap_set_file bug: Use centos 6 and add repo manually
ADD shibboleth/shibboleth.repo /etc/yum.repos.d/

RUN yum install -y shibboleth.x86_64


EXPOSE 80 81 82 83 84 85



# httpd setup

RUN sed -i -e "/^#LoadModule proxy_module/s/#//;/^#LoadModule proxy_http_module/s/#//;/^#Include conf.*httpd-vhosts.conf/s/#//" $HTTPD_PREFIX/conf/httpd.conf

RUN mkdir /usr/local/lada
RUN ln -s /usr/local/lada/ /var/www/html/
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
ADD .git /usr/local/lada/.git

# Add shibboleth config
ADD shibboleth /usr/local/lada/shibboleth
RUN rm /etc/shibboleth/shibboleth2.xml && ln -s /usr/local/lada/shibboleth/shibboleth2.xml /etc/shibboleth/shibboleth2.xml \
    && ln -s /usr/local/lada/shibboleth/partner-metadata.xml /etc/shibboleth/partner-metadata.xml \
    && rm /etc/shibboleth/attribute-map.xml \
    && ln -s /usr/local/lada/shibboleth/attribute-map.xml /etc/shibboleth/attribute-map.xml
RUN cp /usr/local/lada/shibboleth/etc/*.pem /etc/shibboleth


RUN GITINFO=" $(git name-rev --name-only HEAD 2>/dev/null) $(git rev-parse --short HEAD 2>/dev/null)" &&\
    echo ${GITINFO} &&\
    sed -i -e "/Lada.clientVersion/s/';/${GITINFO}';/" app.js


# build application
#
RUN echo build $(grep Lada.clientVersion app.js | cut -d '=' -f 2 | cut -d "'" -f 2) && ./docker-build-app.sh

#Start shibboleth sp
#RUN /usr/sbin/shibd
CMD /usr/sbin/shibd && /usr/sbin/httpd -DFOREGROUND