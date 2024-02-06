/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Probenart
 */
Ext.define('Lada.view.widget.Probenart', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.probenart',
    store: 'Probenarten',
    displayField: 'extId',
    valueField: 'id',
    // Enable filtering of comboboxes
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    forceSelection: true,
    minChars: 0,
    maxChars: 1,
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{extId} - {name}</div></tpl>'),

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.probenart');

        this.store = Ext.data.StoreManager.get('probenarten');
        if (!this.store) {
            this.store = Ext.create('Lada.store.Probenarten');
        } else {
            this.store.clearFilter();
        }
        this.callParent(arguments);
    }
});
