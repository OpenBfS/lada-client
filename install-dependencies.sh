#!/bin/bash -e

CUR_DIR=`pwd`
SCRIPT_DIR=`dirname $0`

cd $SCRIPT_DIR
curl -O https://cdn.sencha.com/ext/gpl/ext-4.2.1-gpl.zip
unzip -n ext-4.2.1-gpl.zip
ln -s ext-4.2.1.883 extjs

mkdir -p resources/lib/ext
cd resources/lib

curl -L https://github.com/eligrey/FileSaver.js/archive/master.zip \
     -o FileSaver-js.zip
unzip -n FileSaver-js.zip
ln -s FileSaver.js-master FileSaver

curl -L https://github.com/eligrey/Blob.js/archive/master.zip \
     -o Blob-js.zip
unzip -n Blob-js.zip
ln -s Blob.js-master Blob

curl -L https://github.com/openlayers/openlayers/archive/release-2.13.1.zip \
     -o OpenLayers-2-13-1.zip
unzip -n OpenLayers-2-13-1.zip
ln -s openlayers-release-2.13.1/build OpenLayers
cd OpenLayers
python build.py

cd ../ext
curl -L https://github.com/elmasse/Ext.i18n.Bundle/archive/v0.3.3.zip \
     -o Ext-i18n-Bundle-v0-3-3.zip
unzip -n Ext-i18n-Bundle-v0-3-3.zip
ln -s Ext.i18n.Bundle-0.3.3/i18n i18n

curl -L https://github.com/ivan-novakov/extjs-upload-widget/archive/1.1.1.zip \
     -o Ext-ux-Upload-1-1-1.zip
unzip -n Ext-ux-Upload-1-1-1.zip
ln -s extjs-upload-widget-1.1.1/lib/upload upload

cd $CUR_DIR
