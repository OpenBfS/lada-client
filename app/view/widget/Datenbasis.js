/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Datenbasis
 */
Ext.define('Lada.view.widget.Datenbasis', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.datenbasis',
    requires: ['Lada.store.Datenbasis'],
    store: null,
    displayField: 'datenbasis',
    valueField: 'id',
    // Enable filtering of comboboxes
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.datenbasis');
        var store = Ext.data.StoreManager.get('datenbasis');
        if (!store) {
            Ext.create('Lada.store.Datenbasis', {storeId: 'datenbasis'});
        }
        this.store = Ext.data.StoreManager.get('datenbasis');
        this.store.clearFilter();
        this.callParent(arguments);
    }
});
