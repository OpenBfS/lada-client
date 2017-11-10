#!/bin/bash -e

CUR_DIR=`pwd`
WORKSPACE=$CUR_DIR
#SENCHA_CMD_VERSION="6.2.2.36"
EXTJS_VERSION="6.2.0"

SENCHA_CMD="/opt/Sencha/sencha"

ln -s ${WORKSPACE}/ext-${EXTJS_VERSION} ext

$SENCHA_CMD app install --framework=ext
$SENCHA_CMD app clean
$SENCHA_CMD app build production

ln -sf $WORKSPACE/build/production/Lada $WORKSPACE/lada

cd $WORKSPACE
