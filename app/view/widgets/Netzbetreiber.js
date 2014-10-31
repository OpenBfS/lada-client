/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Combobox for Netzbetreiber
 */
Ext.define('Lada.view.widgets.Netzbetreiber' ,{
    extend: 'Ext.form.ComboBox',
    require: ['Lada.store.StaNetzbetreiber'],
    alias: 'widget.netzbetreiber',
    store: 'StaNetzbetreiber',
    displayField:'netzbetreiber',
    valueField: 'id',
    emptyText:'Wählen Sie einen Netzbetreiber',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction : 'all',
    typeAhead: false,
    minChars: 0,

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('StaNetzbetreiber');
        if (!this.store) {
            this.store = Ext.create('Lada.store.StaNetzbetreiber');
        }
        this.callParent(arguments);
    }
});

