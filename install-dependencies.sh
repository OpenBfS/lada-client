#!/bin/bash -e

CUR_DIR=`pwd`
SCRIPT_DIR=`dirname $0`


# TODO Migration: check

cd $SCRIPT_DIR

mkdir -p packages/local
cd packages/local
curl -L https://github.com/elmasse/elmasse-bundle/archive/v1.2.0.zip \
    -o elmasse-1.2.0.zip
unzip -n elmasse-1.2.0.zip
cd ../..

mkdir -p resources/lib
cd resources/lib

curl -L https://github.com/eligrey/FileSaver.js/archive/master.zip \
     -o FileSaver-js.zip
unzip -n FileSaver-js.zip
ln -sf FileSaver.js-master FileSaver

curl -L https://github.com/eligrey/Blob.js/archive/master.zip \
     -o Blob-js.zip
unzip -n Blob-js.zip
ln -sf Blob.js-master Blob

curl -L https://github.com/openlayers/openlayers/releases/download/v4.3.2/v4.3.2-dist.zip \
     -o OpenLayers-4.3.2.zip
unzip -n OpenLayers-4.3.2.zip
mv v4.3.2-dist ol3/

cd $CUR_DIR
