#!/bin/bash -e

CUR_DIR=`pwd`
WORKSPACE=$CUR_DIR
EXTJS_VERSION="6.2.0"

SENCHA_CMD="/opt/Sencha/sencha"
SDK_PATH="/usr/local/lada"

ln -sf ${WORKSPACE}/ext-${EXTJS_VERSION} ext
#Set SDK path. Must be set to the path containing the SDK folder, not the SDK folder itself
$SENCHA_CMD config --prop sencha.sdk.path=$SDK_PATH --save
#Init workspace and app
$SENCHA_CMD workspace init
$SENCHA_CMD app install
#Build development and production variant
$SENCHA_CMD app build development
$SENCHA_CMD app build \
    --destination /usr/local/apache2/htdocs/build/production/Lada/ production

cd $WORKSPACE
