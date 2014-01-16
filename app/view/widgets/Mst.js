/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

var mstStore = Ext.create('Ext.data.Store', {
    fields: ['mstId', 'messStelle'],
    sorters: [{
        property: 'messStelle'
    }],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/mst'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

/**
 * Combobox for Messstelle
 */
Ext.define('Lada.view.widgets.Mst' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.mst',
        store: mstStore,
        displayField:'messStelle',
        valueField: 'mstId',
        typeAhead: true,
        emptyText:'Wählen Sie eine Messstelle',
        // Enable filtering of comboboxes
        autoSelect: false,
        queryMode: 'local',
        triggerAction : 'all',
        typeAhead: true,
        minChars: 0,
    initComponent: function() {
        this.callParent(arguments);
    }
});
