/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Staat
 */
Ext.define('Lada.view.widget.Staat', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.staat',
    requires: ['Lada.store.Staaten'],
    store: null,
    displayField: 'ctry',
    valueField: 'id',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    forceSelection: this.forceSelection || false,

    initComponent: function() {
        // This widget requires a separate store to not change the grid
        // during typing
        var store = Ext.data.StoreManager.get('staatenwidget');
        if (!store) {
            Ext.create('Lada.store.Staaten', {
                storeId: 'staatenwidget'
            });
        }
        this.store = Ext.data.StoreManager.get('staatenwidget');
        this.store.clearFilter();
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.staat');
        this.callParent(arguments);
    }
});
