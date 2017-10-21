#!/bin/bash -e

CUR_DIR=`pwd`
WORKSPACE=$CUR_DIR
SENCHA_CMD_VERSION="6.2.2.36"
EXTJS_VERSION="6.2.0"

curl -L http://cdn.sencha.com/cmd/$SENCHA_CMD_VERSION/no-jre/SenchaCmd-$SENCHA_CMD_VERSION-linux-amd64.sh.zip \
     -o SenchaCmd-$SENCHA_CMD_VERSION-linux-amd64.sh.zip
unzip -n SenchaCmd-$SENCHA_CMD_VERSION-linux-amd64.sh.zip

./SenchaCmd-$SENCHA_CMD_VERSION-linux-amd64.sh -q -dir "/opt/$SENCHA_CMD_VERSION"
curl -L  http://cdn.sencha.com/ext/gpl/ext-$EXTJS_VERSION-gpl.zip \
     -o ext-$EXTJS_VERSION-gpl.zip
unzip -n ext-$EXTJS_VERSION-gpl.zip

SENCHA_CMD="/opt/$SENCHA_CMD_VERSION/sencha"

$SENCHA_CMD workspace init
$SENCHA_CMD app upgrade $WORKSPACE/ext-$EXTJS_VERSION
