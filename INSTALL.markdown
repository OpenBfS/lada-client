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
[https://github.com/OpenBfS/lada-client](https://github.com/OpenBfS/lada-client)

Die folgenden Hinweise beziehen sich auf die Installation und Einrichtung auf
Basis eines Oracle-RedHat Linux Systems.

Der Lada-Client ist eine Anwendung die auf dem Framework ExtJs 6.2.0
(GPL-Version) basiert. Es ist derzeit (gegen Anmeldung) erhältlich unter
`https://www.sencha.com/legal/gpl/`. Ein automatisierter Download ist seitens
Sencha nicht mehr vorgesehen.

###Sencha Cmd

Bei der Einrichtung der Entwicklungsumgebung und beim Kompilieren der Anwendung
kommt das Tool Sencha Cmd 7.2.0.84 zum Einsatz. Sencha bietet Sencha Cmd zum
[Download](https://www.sencha.com/products/extjs/cmd-download/) an.

Die Fa. Sencha beschreibt die Installation von Sencha Cmd in der
[Dokumentation von ExtJs](https://docs.sencha.com/cmd/7.2.0/guides/getting_started_cmd.html)

Zur Installation von Sencha Cmd wird Java benötigt. Dabei werden die Varianten Oracle JRE (SE) 8-11 und OpenJDK 8-11 unterstützt.

### Installation einer Entwicklungsumgebung der Anwendung

* cd (Umgebung)
* Extjs6 nach ext/ kopieren/entpacken
* sencha config --prop sencha.sdk.path=/pfad/zum/client/repository --save
* sencha workspace init
* Externe Libraries installieren: install-dependencies.sh
* sencha app install
* sencha app build development
* Einstiegspunkt für Webbrowser: index.html

### Kompilieren und Minifizieren der Anwendung

Mit Hilfe von Sencha Cmd kann der Quellcode in eine wenige Dateien
zusammengefasst und minifiziert werden. Dies beschleunigt das Laden der
Anwendung im Browser erheblich. Die Minifizierung erfolgt über:

```
    sencha app build production
```
Die fertig minifizierte Anwendung wird unter build/production abgelegt,
und kann danach gepackt werden. Die Datei build.sh im Wurzelverzeichnis der
Anwendung automatisiert diesen Prozess.

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

    * headers_module: Setzen der Header nach der Authentifizierung
    * proxy_module: Reverse Proxy des Apache zum Lada-Server

### Einrichtung der Anwendung

Zunächst hinterlegen wir die Anwendung in dem Server. Hierzu verwenden wir die
gebaute Version, welche sich im `build/production` - Ordner befindet.

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

### Konfiguration Proxy Server

Damit der Client eine Verbindung zu dem Server aufbauen kann, um von dort
Daten laden zu können, ist es notwendig den Server weiter zu konfigurieren.

```
    togglesebool httpd_can_network_connect
    service httpd restart
```

Dies erlaubt dem Apache grundsätzlich sich mit einem anderen Dienst zu verbinden.

Nun muss noch ein Reverse-Proxy eingerichtet werden. Hierzu kann die Datei
`custom-vhosts.conf` unter `/etc/httpd/conf.d/lada.conf` abgelegt werden.
Die URL für den Lada-Server muss darin ggf. angepasst werden.
Sollte aus dem Lada-Client heraus mittels PrintApp in mapfish-print gedruckt werden,
so ist auch der zweite (in `custom-vhosts.conf` auskommentierte) Proxy
notwendig.
Die RequestHeader-Zeilen sind nur für ein Test-Setup ohne
Shibboleth-Authentifizierung gedacht und müssen ansonsten entfernt werden.

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

 * Filesaver.js 1.3.3
   https://github.com/eligrey/FileSaver.js
   MIT - License
 * Blob.js
   https://github.com/eligrey/Blob.js
   MIT - License
 * Openlayers 4.4.2
   http://www.openlayers.org
   https://github.com/openlayers/openlayers
   2-Clause BSD-License
 * ClipboardJS 2.0.6
   https://clipboardjs.com
   https://github.com/zenorocha/clipboard.js
   MIT - License


Diese werden in der `Index.html` referenziert.

In `packages/local/` werden Bibliotheken installiert, die ExtJs
ergänzen und in der Datei `app.js` aufgeführt werden:

 * Ext.i18n.Bundle 1.2.0 (referenced as Ext.i18n in app.js)
   https://github.com/elmasse/elmasse-bundle/tree/v1.2.0
   MIT - License
