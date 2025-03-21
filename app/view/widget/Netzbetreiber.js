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
Ext.define('Lada.view.widget.Netzbetreiber', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.netzbetreiber',
    store: 'netzbetreiber',
    requires: ['Lada.store.Netzbetreiber'],
    displayField: 'name',
    valueField: 'id',
    filteredStore: false,
    readOnly: this.readOnly,

    // Enable filtering of comboboxes
    queryMode: 'local',
    lastQuery: '',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    forceSelection: this.forceSelection || false,
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
        '{id:htmlEncode} - {name:htmlEncode}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id:htmlEncode} - {name:htmlEncode}</tpl>'),
    labelTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id:htmlEncode} - {name:htmlEncode}</tpl>'),

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.netzbetreiber');
        var store = Ext.data.StoreManager.get('netzbetreiber');
        if (!store) {
            Ext.create('Lada.store.Netzbetreiber', {
                storeId: 'netzbetreiber'
            });
        }
        this.store = Ext.data.StoreManager.get('netzbetreiber');
        this.store.clearFilter();

        this.callParent(arguments);

        var me = this;
        this.down('combobox').on('focus', function(combobox) {
            var netzstore = combobox.getStore();
            netzstore.clearFilter();
            if (me.filteredStore) {
                netzstore.filter(function(item) {
                    return Lada.netzbetreiber.indexOf(item.get('id')) >= 0;
                });
            }
        });
    },

    getValue: function() {
        var value = this.down('combobox').getValue();
        if (value === undefined || value === null || value === '') {
            return [];
        }
        if (value instanceof Array) {
            return value;
        }
        value = value.trim().split(' ');
        var retValues = [];
        for (var i = 0; i < value.length; i++) {
            var item = value[i];
            // eslint-disable-next-line no-loop-func
            var found = this.store.queryBy(function(rec) {
                if (rec.get('id') === item ||
                    rec.get('name') === item) {
                    return true;
                }
            });
            if (found.getCount() >= 0) {
                retValues.push(found.getAt(0).get('id'));
                continue;
            }
        }
        return retValues;
    }
});
