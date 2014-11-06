/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to create and edit a Kommentar for Messungen
 */
Ext.define('Lada.view.mkommentare.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',

    model: 'Lada.model.KommentarM',

    initComponent: function() {
        this.items = [{
            xtype: 'mst',
            name: 'erzeuger',
            fieldLabel: 'Erzeuger'
        }, {
            xtype: 'datetime',
            name: 'datum',
            fieldLabel: 'Datum'
        }, {
            xtype: 'textareafield',
            maxLength: 1024,
            name: 'text',
            fieldLabel: 'Text'
        }];
        this.callParent(arguments);
    }
});
