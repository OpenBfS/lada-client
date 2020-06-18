#!/bin/bash -e

CUR_DIR=`pwd`
WORKSPACE=$CUR_DIR
EXTJS_VERSION="6.2.0"

SENCHA_CMD="/opt/Sencha/sencha"
SDK_PATH="/usr/local/lada"

ln -s ${WORKSPACE}/ext-${EXTJS_VERSION} ext
$SENCHA_CMD config --prop sencha.sdk.path=$SDK_PATH --save
$SENCHA_CMD workspace init
$SENCHA_CMD app install
$SENCHA_CMD app clean
$SENCHA_CMD app build production

ln -sf $WORKSPACE/build/production/Lada $WORKSPACE/lada

cd $WORKSPACE
