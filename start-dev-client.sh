#!/bin/bash

LADA_HOME=${LADA_HOME:?"LADA_HOME not set"}

# Build client if we seem to be in a fresh checkout
if [ ! -e $LADA_HOME/bootstrap.js ]; then
    cd $LADA_HOME
    ./docker-build-app.sh development || exit 1
fi

exec httpd-foreground
