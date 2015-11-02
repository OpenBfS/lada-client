# Installation Lada-Client

Für allgemeine Informationen schauen Sie in die README Datei.

## Installation

Für den Betrieb des Lada-Clients muss dieser innerhalb einer Webserver-Umgebung
installiert werden. Die folgenden Hinweise geben eine Kurze Anleitung zur
Installation eines Apache-Webserver.

Hinweis: Für den Betrieb einer vollständigen Installation ist neben dem
Klienten auch die Installation eines Servers und entsprechender Datenbank
notwendig. Für die Installation des Servers folgen Sie bitte den Hinweisen in
der README Datei des Server-Pakets.
Weitere Information finden Sie auf der Projektwebseite:
http://wald.intevation.org/projects/lada

Die folgenden Hinweise beziehen sich auf die Installation und Einrichtung auf
Basis eines Oracle-RedHat Linux Systems.

Der Lada-Client ist eine Anwendung die auf dem Framework ExtJs 4.2.1
(GPL-Version) basiert, welches mit `install-dependencies.sh` heruntergeladen
und installiert wird.


### Kompilieren und Minifizieren der Anwendung

Zum Kompilieren der Anwendung kommt das Tool Sencha Cmd 4.0.x zum Einsatz.
Mit Hilfe dieses Tools kann der Quellcode in eine einzelne Datei zusammengefasst
und minifiziert werden. Dies beschleunigt das Laden der Anwendung im Browser
erheblich

Sencha bietet Sencha Cmd zum [Download](https://www.sencha.com/products/extjs/cmd-download/) 
an. Beachten Sie: Sencha Cmd ist keine freie Software.

Die Fa. Sencha beschreibt die Installation von Sencha Cmd in der
[Dokumentation von ExtJs](http://docs.sencha.com/extjs/4.2.1/#!/guide/command)

Zur Installation von Sencha Cmd werden Ruby und Java benötigt.

Bevor Sie die Anwendung kompilieren können, müssen Sie die im Abschnitt
*Lizenzen und Bibliotheken* genannten Bibliotheken mit
`install-dependencies.sh` zum Projekt hinzufügen.

Um die Anwendung zu erzeugen und alle notwendigen Bibliotheken an den richtigen
Platz zu legen, passen Sie den Pfad zu SenchaCMD in der Datei `build.sh` an und
führen Sie das Shell-Skript aus.
Das Verzeichnis `lada-client-VERSIONSNUMMER` enthält dann eine Datei `index.html`
und eine Datei `lada.js`. Die Datei `lada.js` ist eine komprimierte Version der
Anwendung und enthält alle benötigten Klassen.


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

    * headers_module: Setzten der Header nach der Authentifizierung
    * proxy_module: Reverse Proxy des Apache zum Lada-Server

### Einrichtung der Anwendung

Zunächst hinterlegen wir die Anwendung in dem Server. Hierzu verwenden wir die
gebaute Version, welche sich im `build` Ordner befindet.

```
cd /var/www/html
mkdir lada
cp -r lada-client-VERSIONSNUMMER/* lada
```

*Wichtig um SELinux dazu zu überreden das neue Verzeichnis auch zu servieren:*

```
restorecon -Rv /var/www/html/
```

Die Anwendung sollte nun bereits unter der Adresse `http://localhost/lada`
erreichbar sein.

Damit die Anwendung vollständig funktioniert, müssen ggfs. noch weitere
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

Sollte aus dem Lada-Client heraus mittels PrintApp in mapfish-print gedruckt werden,
so ist auch der zweite Proxy notwendig.

Folgende Datei sollte unter `/etc/httpd/conf.d/lada.conf` angelegt werden:
```
    <VirtualHost *:80>
        ServerAdmin webmaster@localhost
        #ServerName dummy-host.example.com
        ErrorLog logs/lada-error_log
        CustomLog logs/lada-access_log common

        # Set multiple Proxys
        ProxyPass /lada/server http://LADASERVER/lada
        ProxyPassReverse /lada/server http://LADASERVER/lada
        # Add Printing
        ProxyPass /lada-client/lada-printer http://MAPFISH-PRINT-URL/lada_print
        ProxyPassReverse /lada-client/lada-printer http://MAPFISH-PRINT-URL/lada_print
    </VirtualHost>
```
Alle Anfragen an die Adresse `/lada/service`, werden nun an den Server
weitergeleitet.

### Authentifizierung

Derzeit wird Authentifizierung durch Shibboleth gewährleistet. Dies wird
komplett durch den Webserver erledigt. Dieses muss daher entsprechen
konfiguriert werden. Die Anwendung selbst führt keine Authentifizierung mehr
durch.
Frühere Ansätze zur Authentifizierung nutzten OpenId oder LDAP

# Lizenzen und Bibliotheken

Die Anwendung verwendet mehrere Unterkomponenten, die mit
`install-dependencies.sh` in `resources/lib` installiert werden.

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

Diese werden in der `Index.html` referenziert.

In `resources/lib/ext` werden Bibliotheken installiert, die ExtJs
ergänzen und in der Datei `app.js` aufgeführt werden:

 * Ext.i18n.Bundle 0.3.3 (referenced as Ext.i18n in app.js)
   https://github.com/elmasse/Ext.i18n.Bundle/tree/v0.3.3
   MIT - License
 * Ext.ux.upload 1.1.1
   https://github.com/ivan-novakov/extjs-upload-widget/tree/1.1.1
   3-Clause BSD-License
