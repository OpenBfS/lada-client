/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Combobox for Messmethode
 */
Ext.define('Lada.view.widgets.Messmethode' ,{
    extend: 'Ext.form.ComboBox',
    require: ['Lada.store.StaMessmethoden'],
    alias: 'widget.messmethode',
    store: 'StaMessmethoden',
    displayField:'messmethode',
    valueField: 'id',
    emptyText:'Wählen Sie eine Messmethode',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction : 'all',
    typeAhead: false,
    minChars: 0,
    tpl: '<tpl for="."><div class="x-combo-list-item x-boundlist-item" >{id} - {messmethode}</div></tpl>',

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('staMessmethoden');
        if (!this.store) {
            this.store = Ext.create('Lada.store.StaMessmethoden');
        }
        this.callParent(arguments);
    }
});
