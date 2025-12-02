#!/bin/bash -e

CUR_DIR=`pwd`
WORKSPACE=$CUR_DIR
SENCHA_CMD_VERSION="7.2.0.84"
EXTJS_VERSION="6.2.0"

# Install SenchaCmd
cd /opt
SENCHA_INSTALLER=SenchaCmd-$SENCHA_CMD_VERSION-linux-amd64.sh
if [ ! -e $SENCHA_INSTALLER ]
then
  curl -sSLO https://cdn.sencha.com/cmd/$SENCHA_CMD_VERSION/no-jre/$SENCHA_INSTALLER.zip
  unzip -q -n $SENCHA_INSTALLER.zip
  rm $SENCHA_INSTALLER.zip
fi
./$SENCHA_INSTALLER -q -dir "/opt/$SENCHA_CMD_VERSION"
ln -s /opt/$SENCHA_CMD_VERSION /opt/Sencha

# Install ExtJS
if [ ! -e ext-$EXTJS_VERSION ]
then
  ZIP_FILE=ext-$EXTJS_VERSION-gpl.zip
  curl -sSLO https://cdn.sencha.com/ext/gpl/$ZIP_FILE
  unzip -q -n $ZIP_FILE
  rm $ZIP_FILE
  # Examples not needed but use a lot of disk space
  find ext-$EXTJS_VERSION -name examples -type d -print0 | xargs -0 rm -r
fi
