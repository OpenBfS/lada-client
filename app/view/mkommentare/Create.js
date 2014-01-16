/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/*
 * Window to create and edit a Kommentar for Messungen
 */
Ext.define('Lada.view.mkommentare.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.mkommentarecreate',

    title: 'Maske für Messungskommentare',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    autoShow: true,
    autoScroll: true,
    modal: true,

    requires: [
        'Lada.view.mkommentare.CreateForm'
    ],
    initComponent: function() {
        this.buttons = [
            {
                text: 'Speichern',
                scope: form,
                action: 'save'
            },
            {
                text: 'Abbrechen',
                scope: this,
                handler: this.close
            }
        ];
        var form = Ext.create('Lada.view.mkommentare.CreateForm', this.initialConfig);
        this.items = [form];
        this.callParent();
    }
});
