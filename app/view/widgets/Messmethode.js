/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

var mmtStore = Ext.create('Ext.data.Store', {
    fields: ['mmtId', 'messmethode'],
    sorters: [{
        property: 'mmtId'
    }],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/messmethode'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

/**
 * Combobox for Messmethode
 */
Ext.define('Lada.view.widgets.Messmethode' ,{
        tpl: '<tpl for="."><div class="x-combo-list-item x-boundlist-item" >{mmtId} - {messmethode}</div></tpl>',
        extend: 'Ext.form.ComboBox',
        alias: 'widget.messmethode',
        store: mmtStore,
        displayField:'messmethode',
        valueField: 'mmtId',
        emptyText:'Wählen Sie eine Messmethode',
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
