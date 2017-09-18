Lada-Client
===========
Dies ist eine Kopie des ExtJS basierten Klienten für die
Verarbeitung von Labordaten (Lada) zur Überwachung der Umweltradioaktivität.

Die Software bietet Funktionalität zur Erfassung und Bearbeitung
von Messdaten. Sowie der Planung der Messungen.

Weitere Informationen finden sich auf der Projektwebseite unter
der Adresse: https://wald.intevation.org/projects/lada/

Die Software entstand im Rahmen einer Software Entwicklung durch die
Intevation GmbH im Auftrag des Bundesamt für Strahlenschutz in den Jahren 2013
bis 2017.

Kontakt
-------
Bundesamt für Strahlenschutz
SW2 Notfallschutz, Zentralstelle des Bundes (ZdB)
Willy-Brandt-Strasse 5
38226 Salzgitter
info@bfs.de

Lizenz
------
Die Software ist unter der GNU GPL v>=3 Lizenz verfügbar.
Details siehe die Datei `COPYING`.

Quelltext
---------
Die Quelldateien lassen sich wie folgt auschecken:
```
git clone https://github.com/OpenBfS/lada-client.git
```

Dokumentation
-------------
Die Dokumentation wird mit dem Tool JSDuck erzeugt.
Im Wurzelordner lässt sich nach der Installation von JSDuck dann mit dem
Befehl `jsduck` die Dokumentation für den Lada-Klienten erzeugen.
Die Dokumentation findet sich nach der Generierung in dem Order `doc`.
Einstiegsseite ist die Seite `template.html`.
Sollte die Dokumentation mit einem Webserver ausgeliefert werden auf dem
PHP installiert ist, kann auch die `index.php` verwendet werden.

JSDuck ist unter der Adresse https://github.com/senchalabs/jsduck
zu finden und muss installiert werden.

Einstellungen bezüglich der Generierung der Dokumentation sind in der Datei
`jsduck.json` hinterlegt.

Entwicklung
-----------
Für die Entwicklung ist es notwendig in dem Wurzelordner die ExtJS-Bibliothek
in der Version >=6.2.0 unter dem Namen "ext" zur Verfügung zu stellen.

Näheres dazu in der Datei `INSTALL.markdown`.

Zusätzlich werden für diese Anwendung weitere externe Bibliotheken, bspw. zur
Internationalisierung verwendet. Auch diese und deren Installation
sind in der o.g. Datei beschrieben.


Build
-----
Die Anwendung wird mit Hilfe des von Sencha bereitgestellten Tools 'Sencha Cmd'
kompiliert und minifiziert. Vorbedingung für den Compilevorgang ist die in der
Datei `INSTALL.markdown` beschriebene Verzeichnisstruktur.

Der Build erzeugt in dem Ordner 'build' die minifizierte Version der Anwendung,
welche alle benötigten Klassen der ExtJS Bibliothek beinhaltet, sowie eine
entsprechende index.html, die zur Auslieferung in einem Webserver verwendet
werden kann. Externe Bibliotheken, Grafiken und CSS Dateien sind jedoch nicht
inkludiert und müssen händisch hinzugefügt werden. Auch diese sind in der Datei
`INSTALL.markdown` beschrieben.

Installation
------------
Für Informationen zur Installation schauen Sie in die `INSTALL.markdown` Datei.
