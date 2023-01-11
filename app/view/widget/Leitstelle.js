/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Leitstelle
 */
Ext.define('Lada.view.widget.Leitstelle', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.leitstelle',
    store: 'leitstellenwidget',
    displayField: 'name',
    valueField: 'id',
    editable: this.editable || false,
    forceSelection: true,
    autoSelect: true,
    queryMode: 'local',
    lastQuery: '',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{id} - {name}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id} - {name}</tpl>'),
    labelTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id} - {name}</tpl>'),

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.leitstelle');
        this.store = Ext.data.StoreManager.get('leitstellenwidget');
        this.callParent(arguments);
    }
});
