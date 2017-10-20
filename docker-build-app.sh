#!/bin/bash -e

CUR_DIR=`pwd`
WORKSPACE=$CUR_DIR
SENCHA_CMD_VERSION="6.2.1.29"
EXTJS_VERSION="6.2.0"

SENCHA_CMD="/opt/$SENCHA_CMD_VERSION/sencha"

$SENCHA_CMD app install --framework=ext
$SENCHA_CMD workspace upgrade
$SENCHA_CMD app clean
$SENCHA_CMD app build development
#$SENCHA_CMD app build production

ln -sf $WORKSPACE/build/production/Lada $WORKSPACE/lada

cd $WORKSPACE
