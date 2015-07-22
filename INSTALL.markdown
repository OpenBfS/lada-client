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

### Compilieren und Minifizieren der Anwendung

Zum Compilieren der Anwendung kommt das Tool Sencha Cmd 4.0.x zum Einsatz.
Mit Hilfe dieses Tools kann der Quellcode in eine einzelne Datei zusammengefasst
und minifiziert werden. Dies beschleunigt das Laden der Anwendung im Browser erheblich

Sencha bietet Sencha Cmd zum [Download](https://www.sencha.com/products/extjs/cmd-download/) 
an. Beachten Sie: Sencha Cmd ist keine freie Software.

Die Fa. Sencha beschreibt die Installation von Sencha Cmd in der
[Dokumentation von ExtJs](http://docs.sencha.com/extjs/4.2.1/#!/guide/command)

Zur Installation werden Ruby und Java benötigt.





Der Befehl hierzu lautet:

```
    sencha --sdk $PATHTOEXT compile \
      --classpath=app,resources/datetime,resources/i18n page -str -cla lada.js \
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
| resources/Lada.properties                              | build/resources/Lada.properties                             |
| resources/Lada_de-DE.properties                        | build/resources/Lada_de-DE.properties                       |
| gfx/*                                                  | build/gfx/                                                  |


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
