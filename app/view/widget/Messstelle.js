/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Messstelle
 */
Ext.define('Lada.view.widget.Messstelle', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.messstelle',
    store: 'Messstellen',
    displayField: 'messStelle',
    valueField: 'id',
    editable: this.editable || false,
    forceSelection: true,
    // Enable filtering of comboboxes
    autoSelect: true,
    queryMode: 'local',
    lastQuery: '',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{id} - {messStelle}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id} - {messStelle}</tpl>'),
    labelTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id} - {messStelle}</tpl>'),

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.messstelle');
        this.store = Ext.data.StoreManager.get('messstellen');
        if (!this.store) {
            this.store = Ext.create('Lada.store.Messstellen');
        }
        this.store.clearFilter(true);
        this.callParent(arguments);
        var child =
            this.multiSelect ? this.down('tagfield') : this.down('combobox');
        if (this.value && child) {
            child.setValue(this.value);
        }
    }
});
