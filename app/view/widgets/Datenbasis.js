/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

var datenbasisStore = Ext.create('Ext.data.Store', {
    fields: ['datenbasisId', 'beschreibung', 'datenbasis'],
    sorters: [{
        property: 'datenbasis'
    }],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/datenbasis'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

/**
 * Combobox for Datenbasis
 */
Ext.define('Lada.view.widgets.Datenbasis' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.datenbasis',
        store: datenbasisStore,
        displayField:'datenbasis',
        valueField: 'datenbasisId',
        emptyText:'Wählen Sie eine Datenbasis',
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
