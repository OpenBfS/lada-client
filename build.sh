#Fallback: SENCHAPATH
if [ -z $SENCHAPATH ]; then SENCHAPATH="~/bin/Sencha/Cmd/6.2.0.103/"; fi
VNUMBER=$(grep Lada.clientVersion app.js | cut -d '=' -f 2 | cut -d "'" -f 2)
VERSION=lada-client-$VNUMBER

# extend clientVersion
GITINFO=" $(git name-rev --name-only HEAD 2>/dev/null) $(git rev-parse --short HEAD 2>/dev/null)" &&\
sed -i_bak -e "/Lada.clientVersion/s/';/$GITINFO';/" app.js

echo build $VERSION $GITINFO

# Minify
echo "Compiling and minifying...."
$SENCHAPATH/sencha app build -c production

if [ -d build/production/$VERSION ]; then rm -rf build/production/$VERSION; fi
cp -r build/production/Lada build/production/$VERSION
tar -czf $VERSION.tgz -C build/production/ $VERSION

if [ -f app.js_bak ] ; then mv app.js_bak app.js ; fi

echo "Done here.\n\n"
