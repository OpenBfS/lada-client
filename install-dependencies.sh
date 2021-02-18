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
curl -sSL https://github.com/elmasse/elmasse-bundle/archive/v${ELMASSE_VERSION}.zip \
     -o elmasse-${ELMASSE_VERSION}.zip
unzip -q -n elmasse-${ELMASSE_VERSION}.zip
cd ../..

mkdir -p resources/lib
cd resources/lib

curl -sSL https://github.com/eligrey/FileSaver.js/archive/${FILESAVER_VERSION}.zip \
     -o FileSaver-js-${FILESAVER_VERSION}.zip
unzip -q -n FileSaver-js-${FILESAVER_VERSION}.zip
rm -rf FileSaver
ln -sf FileSaver.js-${FILESAVER_VERSION} FileSaver

curl -sSL https://github.com/eligrey/Blob.js/archive/${BLOB_VERSION}.zip \
     -o Blob-js-${BLOB_VERSION}.zip
unzip -q -n Blob-js-${BLOB_VERSION}.zip
rm -rf Blob
ln -sf Blob.js-${BLOB_VERSION} Blob

curl -sSL https://github.com/openlayers/openlayers/releases/download/v${OL_VERSION}/v${OL_VERSION}-dist.zip \
     -o OpenLayers-${OL_VERSION}.zip
unzip -q -n OpenLayers-${OL_VERSION}.zip
rm -rf ol
mv v${OL_VERSION}-dist ol/

curl -sSL https://momentjs.com/downloads/moment.js -o moment.js
curl -sSL https://momentjs.com/downloads/moment-timezone-with-data.js -o moment-timezone.js

curl -sSL https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.6/clipboard.min.js -o clipboard.min.js

cd $CUR_DIR
