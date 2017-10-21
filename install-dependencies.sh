#!/bin/bash -e

CUR_DIR=`pwd`
SCRIPT_DIR=`dirname $0`
OL_VERSION='4.4.2'
ELMASSE_VERSION='1.2.0'
FILESAVER_VERSION='1.3.3'
BLOB_VERSION='master'

cd $SCRIPT_DIR

mkdir -p packages/local
cd packages/local
curl -L https://github.com/elmasse/elmasse-bundle/archive/v${ELMASSE_VERSION}.zip \
    -o elmasse-${ELMASSE_VERSION}.zip
unzip -n elmasse-${ELMASSE_VERSION}.zip
cd ../..

mkdir -p resources/lib
cd resources/lib

curl -L https://github.com/eligrey/FileSaver.js/archive/v${FILESAVER_VERSION}.zip \
     -o FileSaver-js-${FILESAVER_VERSION}.zip
unzip -n FileSaver-js-${FILESAVER_VERSION}.zip
ln -sf FileSaver.js-${FILESAVER_VERSION} FileSaver

curl -L https://github.com/eligrey/Blob.js/archive/${BLOB_VERSION}.zip \
     -o Blob-js-${BLOB_VERSION}.zip
unzip -n Blob-js-${BLOB_VERSION}.zip
ln -sf Blob.js-${BLOB_VERSION} Blob

curl -L https://github.com/openlayers/openlayers/releases/download/v${OL_VERSION}/v${OL_VERSION}-dist.zip \
     -o OpenLayers-${OL_VERSION}.zip
unzip -n OpenLayers-${OL_VERSION}.zip
mv v${OL_VERSION}-dist ol/

cd $CUR_DIR
