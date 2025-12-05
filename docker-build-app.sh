#!/bin/bash -e

BUILD_TYPE="$1"

EXTJS_VERSION="6.2.0"

# SenchaCmd requires directory "ext" with ExtJS framework in it
ln -sf /opt/ext-${EXTJS_VERSION} ext

# Symlinks to dependencies
ln -sf /opt/packages packages
pushd ./resources
ln -sf /opt/resources/lib lib
popd

# Build and force sensible exit code on error
/opt/Sencha/sencha app build --clean ${BUILD_TYPE} \
    | grep '^\[ERR\]' && exit 1 || true
