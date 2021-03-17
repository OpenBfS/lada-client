/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

var sortStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'value'],
    storeId: 'sortstore',
    data: [{
        'id': 'asc',
        'value': 'Aufsteigend'
    }, {
        'id': 'desc',
        'value': 'absteigend'
    }, {
        'id': '',
        'value': '-'
    }]
});

/**
 * Combobox for sorting filter.
 */
Ext.define('Lada.view.widget.Sort', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.sort',
    store: sortStore,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    displayField: 'value',
    valueField: 'id',
    emptyText: '',
    forceSelection: true,

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('sortStore');
        this.store.clearFilter();
        this.callParent(arguments);
    }
});
