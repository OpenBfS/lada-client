/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */


var testdatensatzStore = Ext.create('Ext.data.Store', {
    fields: ['testdatensatzId', 'testdatensatz'],
    storeId: 'testdatensatzStore',
    data: [{
        'testdatensatzId': true,
        'testdatensatz': 'Ja'
    }, {
        'testdatensatzId': false,
        'testdatensatz': 'Nein'
    }]
});

/**
 * Combobox for Testdatensatz.
 * This widget is also used a generic "Ja/Nein" combobox.
 */
Ext.define('Lada.view.widget.Testdatensatz', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.testdatensatz',
    store: 'testdatensatzStore',
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    displayField: 'testdatensatz',
    valueField: 'testdatensatzId',
    emptyText: 'Testdatensatz?',

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('testdatensatzStore')
        this.store.clearFilter();
        this.callParent(arguments);
    }
});
