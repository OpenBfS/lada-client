/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Combobox for Messstelle
 */
Ext.define('Lada.view.widgets.Mst' ,{
    extend: 'Ext.form.ComboBox',
    require: ['Lada.store.StaMessstellen'],
    alias: 'widget.mst',
    store: 'StaMessstellen',
    displayField:'messStelle',
    valueField: 'id',
    typeAhead: false,
    emptyText:'Wählen Sie eine Messstelle',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction : 'all',
    typeAhead: false,
    minChars: 0,
    initComponent: function() {
        this.store = Ext.data.StoreManager.get('StaMessstellen');
        if (!this.store) {
            this.store = Ext.create('Lada.store.StaMessstellen');
        }
        this.callParent(arguments);
    }
});
