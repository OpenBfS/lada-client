
SENCHAPATH=~/bin/Sencha/Cmd/4.0.5.87/sencha
VNUMBER=$(grep Lada.clientVersion app.js | cut -d '=' -f 2 | cut -d "'" -f 2)
VERSION=lada-client-$VNUMBER

# Minify
echo "Minifying...."
$SENCHAPATH --sdk-path extjs compile \
    --classpath=app,resources/lib/ext/upload,resources/lib/ext/i18n,resources/lib/ext/grid,resources/lib/ext/util page \
    -yui -i index.html -o $VERSION/index.html

# Copy additional files
# Extjs Styles
echo "Copying additional files...."

mkdir --parents $VERSION/extjs/resources
cp -r extjs/resources/css $VERSION/extjs/resources
cp -r extjs/resources/ext-theme-gray $VERSION/extjs/resources

# Additional resources
mkdir --parents $VERSION/resources/css
mkdir --parents $VERSION/resources/i18n
mkdir --parents $VERSION/resources/img
mkdir --parents $VERSION/resources/lib

cp -r resources/css $VERSION/resources/
cp -r resources/img $VERSION/resources/
cp -r resources/i18n $VERSION/resources/
cp -r resources/lib/Blob $VERSION/resources/lib/
cp -r resources/lib/Blob.js-master $VERSION/resources/lib/
cp -r resources/lib/FileSaver $VERSION/resources/lib/
cp -r resources/lib/FileSaver.js-master $VERSION/resources/lib/
cp -r resources/lib/OpenLayers $VERSION/resources/lib/
cp -r resources/lib/ol2-release-2.13.1 $VERSION/resources/lib/

echo "Compressing...."
tar -czf $VERSION.tgz $VERSION

echo "Done here.\n\n"
