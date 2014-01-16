/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

var netzbetreiberStore = Ext.create('Ext.data.Store', {
    fields: ['netzbetreiberId', 'netzbetreiber'],
    sorters: [{
        property: 'netzbetreiber'
    }],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/netzbetreiber'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

/**
 * Combobox for Netzbetreiber
 */
Ext.define('Lada.view.widgets.Netzbetreiber' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.netzbetreiber',
        store: netzbetreiberStore,
        displayField:'netzbetreiber',
        valueField: 'netzbetreiberId',
        emptyText:'Wählen Sie einen Netzbetreiber',
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

