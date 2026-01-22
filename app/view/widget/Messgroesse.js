/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Messgroesse
 */
Ext.define('Lada.view.widget.Messgroesse', {
    extend: 'Lada.view.widget.base.ComboBox',
    requires: ['Lada.store.Messgroessen'],
    alias: 'widget.messgroesse',
    store: 'Messgroessen',
    displayField: 'name',
    valueField: 'id',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.messgroesse');
        var store = Ext.data.StoreManager.get('messgroessen');
        if (!store) {
            Ext.create('Lada.store.Messgroessen', {storeId: 'messgroessen'});
        }
        this.store = Ext.data.StoreManager.get('messgroessen');
        this.callParent(arguments);
    }
});
