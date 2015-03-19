/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * More Translations for extJS.
 * Not everything is covered in the original translation.
 * This file can be used to extend it.
 */

Ext.onReady(function() {
    if (Ext.grid.RowEditor) {
        Ext.grid.RowEditor.prototype.saveBtnText = "Speichern";
        Ext.grid.RowEditor.prototype.cancelBtnText = "Abbrechen";
        Ext.grid.RowEditor.prototype.errorsText = "Fehler";
        Ext.grid.RowEditor.prototype.dirtyText = "Sie müssen Ihre Änderungen Speichern oder durch Abbrechen verwerfen";
    }

});

//Übersetzungsfehler
Ext.define("Ext.locale.de.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText: "Seite",
    afterPageText: "von {0}",
    firstText: "Erste Seite",
    prevText: "vorherige Seite",
    nextText: "nächste Seite",
    lastText: "letzte Seite",
    refreshText: "Aktualisieren",
    displayMsg: "Zeige Eintrag {0} - {1} von {2}", // Anzeige -> Zeige
    emptyMsg: "Keine Daten vorhanden"
});

Ext.define("Ext.locale.de.picker.Date", {
    override: "Ext.picker.Date",
    todayText: "Heute",
    minText: "Dieses Datum liegt vor dem erstmöglichen Datum", // von -> vor
    maxText: "Dieses Datum liegt nach dem letztmöglichen Datum",
    disabledDaysText: "",
    disabledDatesText: "",
    nextText: "Nächster Monat (Strg/Control + Rechts)",
    prevText: "Vorheriger Monat (Strg/Control + Links)",
    monthYearText: "Monat auswählen (Strg/Control + Hoch/Runter, um ein Jahr auszuwählen)",
    todayTip: "Heute ({0}) (Leertaste)",
    format: "d.m.Y",
    startDay: 1
});

