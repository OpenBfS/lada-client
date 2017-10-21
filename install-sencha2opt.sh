#!/bin/bash -e

CUR_DIR=`pwd`
WORKSPACE=$CUR_DIR
SENCHA_CMD_VERSION="6.2.2.36"
EXTJS_VERSION="6.2.0"

if [ ! -e SenchaCmd-$SENCHA_CMD_VERSION-linux-amd64.sh.zip ]
then
  curl -L http://cdn.sencha.com/cmd/$SENCHA_CMD_VERSION/no-jre/SenchaCmd-$SENCHA_CMD_VERSION-linux-amd64.sh.zip \
     -o SenchaCmd-$SENCHA_CMD_VERSION-linux-amd64.sh.zip
fi
unzip -n SenchaCmd-$SENCHA_CMD_VERSION-linux-amd64.sh.zip
./SenchaCmd-$SENCHA_CMD_VERSION-linux-amd64.sh -q -dir "/opt/$SENCHA_CMD_VERSION"

if [ ! -e ext-$EXTJS_VERSION-gpl.zip ]
then 
  curl -L  http://cdn.sencha.com/ext/gpl/ext-$EXTJS_VERSION-gpl.zip \
     -o ext-$EXTJS_VERSION-gpl.zip
fi
unzip -n ext-$EXTJS_VERSION-gpl.zip

ln -s /opt/$SENCHA_CMD_VERSION /opt/Sencha

SENCHA_CMD="/opt/$SENCHA_CMD_VERSION/sencha"

