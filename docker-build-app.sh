#!/bin/bash -e

BUILD_TYPE="$1"

EXTJS_VERSION="6.2.0"

ln -sf /opt/ext-${EXTJS_VERSION} ext
/opt/Sencha/sencha app build --clean ${BUILD_TYPE}
