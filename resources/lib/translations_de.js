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
    }

    //this will not work... :-(
    /*
    Ext.override(Ext.ux.DateTimePicker ,{
        todayText: "Heute",
        timeLabel: "Uhrzeit"
    });
    */
});
