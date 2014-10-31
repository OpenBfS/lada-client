/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Combobox for Probenart
 */
Ext.define('Lada.view.widgets.Probenart' ,{
    extend: 'Ext.form.ComboBox',
    require: ['Lada.store.StaProbenarten'],
    alias: 'widget.probenart',
    store: 'StaProbenarten',
    displayField:'probenart',
    valueField: 'id',
    emptyText:'Wählen Sie eine Probenart',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction : 'all',
    typeAhead: false,
    minChars: 0,
    initComponent: function() {
        this.store = Ext.data.StoreManager.get('StaProbenarten');
        if (!this.store) {
            this.store = Ext.create('Lada.store.StaProbenarten');
        }
        this.callParent(arguments);
    }
});
