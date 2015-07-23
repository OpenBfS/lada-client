# Installation Lada-Client

Für allgemeine Informationen schauen Sie in die README Datei.

## Installation

Für den Betrieb des Lada-Clients muss dieser innerhalb einer Webserver-Umgebung
installiert werden. Die folgenden Hinweise geben eine Kurze Anleitung zur
Installation eines Apache-Webserver.

Hinweis: Für den Betrieb einer vollständigen Installation ist neben dem
Klienten auch die Installation eines Servers und entsprechender Datenbank
notwendig. Für die Installation des Servers folgen Sie bitte den Hinweisen in
der README Datei des Server-Pakets. Siehe Projektwebseite. Optional: Die
Authentifizierung kann gegen einen LDAP-Server durchgeführt werden. Beispiele
finde sich in dem Installationbeispiel.

Die folgenden Hinweise beziehen sich auf die Installation und Einrichtung auf
Basis eines Oracle-RedHat Linux Systems.

### Kompilieren und Minifizieren der Anwendung

Zum Compilieren der Anwendung kommt das Tool Sencha Cmd 4.0.x zum Einsatz.
Mit Hilfe dieses Tools kann der Quellcode in eine einzelne Datei zusammengefasst
und minifiziert werden. Dies beschleunigt das Laden der Anwendung im Browser erheblich

Sencha bietet Sencha Cmd zum [Download](https://www.sencha.com/products/extjs/cmd-download/) 
an. Beachten Sie: Sencha Cmd ist keine freie Software.

Die Fa. Sencha beschreibt die Installation von Sencha Cmd in der
[Dokumentation von ExtJs](http://docs.sencha.com/extjs/4.2.1/#!/guide/command)

Zur Installation von Sencha Cmd werden Ruby und Java benötigt.

Bevor Sie die Anwendung kompilieren können, müssen Sie die im Abschnitt
*Lizenzen und Bibliotheken* genannten Bibliotheken zum Projekt hinzufügen.


Zum Kompilieren nutzen Sie die folgende Anweisung:

```
   $PATHTOSENCHACMD --sdk-path $PATHTOEXTJS compile \
   --classpath=app,resources/lib/ext/upload,resources/lib/ext/i18n page \
   -yui -i index.html -o build/index.html
```

Das Verzeichnis `build` enthält dann eine Datei `index.html` und eine Datei
`lada.js`. Die Datei `lada.js` ist eine komprimierte Version der Anwendung und
enthält alle benötigten Klassen.
Für die Produktivversion müssen die folgenden Dateien zusätzlich in das
Verzeichnis `build` kopiert werden:

|  Quelldatei                                            |   Zieldatei                                                 |
|--------------------------------------------------------|-------------------------------------------------------------|
| extjs/resources/css/ext-all-gray.css                   | build/extjs/resources/css/ext-all-gray.css                  |
| extjs/resources/ext-theme-gray/ext-theme-gray-all.css  | build/extjs/resources/ext-theme-gray/ext-theme-gray-all.css |
| resources/i18n/Lada.properties                         | build/resources/i18n/Lada.properties                             |
| resources/i18n/Lada_de-DE.properties                   | build/resources/i18n/Lada_de-DE.properties                       |
| resources/img/*                                        | build/ressources/img*                                                  |
| resources/lib/* (alles ausser ext Ordner)              | build/resources/lib |


Um OpenLayers als "Single File" Version bereit zu haben, gehen Sie in das Verzeichnis
`build/resources/lib/OpenLayers` und führen Sie den folgenden Befehl aus:

```
python build.py
```

Dies erstellt eine Datei `OpenLayers.js` innerhalb des Verzeichnisses.
Diese wird in der Webanwendung referenziert.

### Installation Apache
Zunächst wird der Apache Webserver aus dem Repository installiert:

```
    yum install httpd mod_ssl
    service httpd start
```

### Aktivierung der Apache Module

Die Konfiguration, welche Module beim Start des Apache geladen werden, erfolgt
in der Datei `/etc/httpd/conf`. Die zu ladende Module sind in dieser Datei mit
der Option `LoadModule` angegeben. Folgende Module werden benötigt:

    * ldap_module: Authentifizierung gegen den LDAP
    * headers_module: Setzten der Header nach der Authentifizierung
    * proxy_module: Reverse Proxy des Apache zum Jboss-Server

### Einrichtung der Anwendung

Zunächst hinterlegen wir die Anwendung in dem Server. Hierzu verwenden wir die
gebaute Version, welche sich im `build` Ordner befindet.

```
cd /var/www/html
mkdir lada
cp -r build/* lada
```

*Wichtig um SELinux dazu zu überreden das neue Verzeichnis auch zu servieren:*

```
restorecon -Rv /var/www/html/
```

Die Anwendung sollte nun bereits unter der Adresse `http://localhost/lada`
erreichbar sein.

Damit die Anwendung vollständig funktiniert, müssen ggfs noch weitere
Bibliotheken hinzugefügt werden.
Dies wird im Abschnitt *Lizenzen und Bibliotheken* näher beschrieben

### Konfiguration Proxy Server

Damit der Client eine Verbindung zu dem Server aufbauen kann, um von dort
Daten laden zu können, ist es notwendig den Server weiter zu konfigurieren.

```
    togglesebool httpd_can_network_connect
    service httpd restart
```

Dies erlaubt dem Apache grundsätzlich sich mit einem anderen Dienst zu verbinden.
Nun muss noch ein Reverse-Proxy eingerichtet werden. Dieser ist nur für
bestimmte Adressen aktiv.

Folgende Datei sollte unter `/etc/httpd/conf.d/lada.conf` angelegt werden:
```
    <VirtualHost *:80>
        ServerAdmin webmaster@localhost
        #ServerName dummy-host.example.com
        ErrorLog logs/lada-error_log
        CustomLog logs/lada-access_log common

        # Set multiple Proxys
        ProxyPass /lada/server http://localhost:8080/lada
        ProxyPassReverse /lada/server http://localhost:8080/lada
    </VirtualHost>
```
Alle Anfragen an die Adresse `/lada/service`, werden nun an den Server weitergeleitet.

### Authentifizierung

Die Authentifizierung geschieht gegen einen OpenID-Server.

Der Lada-Client leitet in Zusammenarbeit mit dem Server automatisch an diesen weiter.

# Lizenzen und Bibliotheken

Die Anwendung verwendet mehrere Unterkomponenten, diese sind typischerweise im
Ordner `resources/lib` zu finden.

Folgende Bibliotheken werden neben ExtJs verwendet:

 * Filesaver.js
   https://github.com/eligrey/FileSaver.js
   MIT - License
 * Blob.js
   https://github.com/eligrey/Blob.js
   MIT - License
 * Openlayers 2.13.1
   http://www.openlayers.org
   https://github.com/openlayers/openlayers
   2-Clause BSD-License

Diese sind im Ordner `resources/lib` zu finden, und werden in der `Index.html`
referenziert.

Im Ordner resources/lib/ext befinden sich Bibliotheken die ExtJs ergänzen und in
der Datei `app.js` aufgeführt werden.

 * Ext.i18n.Bundle 0.3.3 (referenced as Ext.i18n in app.js)
   https://github.com/elmasse/Ext.i18n.Bundle/tree/v0.3.3
   MIT - License
 * Ext.ux.upload 1.1.1
   https://github.com/ivan-novakov/extjs-upload-widget/tree/1.1.1
   3-Clause BSD-License


## Installation der Bibliotheken

Die aufgeführten Bibliotheken können über den Link zu Github als zip-Datei
heruntergeladen werden.

Dabei ist auf die korrekte Versionnummer zu achten, falls dies in der Liste
oben angegeben wurde.

```
cd /var/www/html/lada/resources/
mkdir lib/
cd lib
wget https://github.com/eligrey/FileSaver.js/archive/master.zip -O FileSaver-js.zip
wget https://github.com/eligrey/Blob.js/archive/master.zip -O Blob-js.zip
wget https://github.com/openlayers/openlayers/archive/release-2.13.1.zip -O OpenLayers-2-13-1.zip

mkdir ext
cd ext
wget https://github.com/elmasse/Ext.i18n.Bundle/archive/v0.3.3.zip -O Ext-i18n-Bundle-v0-3-3.zip
wget https://github.com/ivan-novakov/extjs-upload-widget/archive/1.1.1.zip -O Ext-ux-Upload-1-1-1.zip
```

Die Dateien sind im Ordner `resources/lib/` zu entpacken

```
cd ..
unzip FileSaver-js.zip
unzip Blob-js.zip
unzip OpenLayers-2-13-1.zip

cd ext
unzip Ext-i18n-Bundle-v0-3-3.zip
unzip Ext-ux-Upload-1-1-1.zip
```

Zum einfacheren Zugriff auf die Bibliothek, symbolische Links erstellen.
Dies is praktisch wenn die Bibliothek ausgetauscht wird,
dann müssen die Quelltexte nicht angepasst werden

```
cd ..
ln -s Blob.js-master Blob
ln -s FileSaver.js-master FileSaver
ln -s openlayers-release-2.13.1/build OpenLayers

cd ext
ln -s Ext.i18n.Bundle-0.3.3/i18n i18n
ln -s extjs-upload-widget-1.1.1/lib/upload upload
```

Somit ist die Installation der Bibliotheken abgeschlossen.
