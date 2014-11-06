/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to create and edit a Kommentar
 */
Ext.define('Lada.view.kommentare.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    requires: [
        'Lada.view.widgets.Mst',
        'Lada.view.widgets.Datetime',
        'Ext.form.field.TextArea'
    ],

    model: 'Lada.model.Kommentar',

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
            name: 'text',
            fieldLabel: 'Text'
        }];
        this.callParent(arguments);
    }
});
