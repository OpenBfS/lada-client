/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for OrtsZusatz
 */
Ext.define('Lada.view.widget.OrtsZusatz', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.ortszusatz',
    requires: ['Lada.store.OrtsZusatz'],
    store: 'ortszusatz',
    displayField: 'name',
    valueField: 'id',
    disableKeyFilter: true,
    forceSelection: true,
    autoSelect: false,
    queryMode: 'local',
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{id} - {name}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id} - {name}</tpl>'),

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.ortszusatz');

        // Initialize store
        if (!Ext.data.StoreManager.get('ortszusatz')) {
            Ext.create('Lada.store.OrtsZusatz', {
                storeId: 'ortszusatz'});
        }

        this.callParent(arguments);
    }
});
