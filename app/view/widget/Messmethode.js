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
Ext.define('Lada.view.widget.Messmethode', {
    requires: ['Lada.store.Messmethoden'],
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.messmethode',
    store: 'messmethoden',
    displayField: 'name',
    valueField: 'id',
    // Enable filtering of comboboxes
    queryMode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    typeAhead: true,
    lastQuery: '',
    minChars: 0,
    layout: 'hbox',
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{display:htmlEncode}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{display:htmlEncode}</tpl>'),
    labelTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{display:htmlEncode}</tpl>'),
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.messmethode');
        var store = Ext.data.StoreManager.get('messmethoden');
        if (!store) {
            Ext.create('Lada.store.Messmethoden', {
                storeId: 'messmethoden'});
        }
        this.store = Ext.data.StoreManager.get('messmethoden');
        this.store.clearFilter();
        this.callParent(arguments);
        //this.down('combobox').anyMatch = true;
    }
});
