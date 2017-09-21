#Fallback: SENCHAPATH
if [ -z $SENCHAPATH ]; then SENCHAPATH="~/bin/Sencha/Cmd/6.2.0.103/"; fi
VNUMBER=$(grep Lada.clientVersion app.js | cut -d '=' -f 2 | cut -d "'" -f 2)
VERSION=lada-client-$VNUMBER

# Minify
echo "Compiling and minifying...."
$SENCHAPATH/sencha app build production

# Copy additional files
# Extjs Styles
echo "Copying additional files...."

mkdir --parents $VERSION
mv build/production/Lada build/production/$VERSION
tar -czf $VERSION.tgz build/production/$VERSION

echo "Done here.\n\n"
