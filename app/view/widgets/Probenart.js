/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

var probenartStore = Ext.create('Ext.data.Store', {
    fields: ['probenartId', 'probenart'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/probenart'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

/**
 * Combobox for Probenart
 */
Ext.define('Lada.view.widgets.Probenart' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.probenart',
        store: probenartStore,
        displayField:'probenart',
        valueField: 'probenartId',
        emptyText:'Wählen Sie eine Probenart',
        // Enable filtering of comboboxes
        autoSelect: false,
        queryMode: 'local',
        triggerAction : 'all',
        typeAhead: false,
        minChars: 0,
    initComponent: function() {
        this.callParent(arguments);
    }
});
