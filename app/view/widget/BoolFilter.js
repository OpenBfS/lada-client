/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

var boolStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'value'],
    storeId: 'booleanStore',
    data: [{
        'id': true,
        'value': 'Ja'
    }, {
        'id': false,
        'value': 'Nein'
    },{
        'id': null,
        'value': 'ungefiltert'
    }]
});
Ext.define('boolFilter', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',  type: 'boolean'},
        {name: 'value',   type: 'string'}
    ],
/**
 * Combobox for boolean filter.
 */
Ext.define('Lada.view.widget.BoolFilter', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.boolfilter',
    store: 'boolStore',
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    displayField: 'value',
    valueField: 'id',
    emptyText: '',
    forceSelection: true,

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('booleanStore');
        this.store.clearFilter();
        this.callParent(arguments);
    }
});
