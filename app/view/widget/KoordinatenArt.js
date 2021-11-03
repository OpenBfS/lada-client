/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for KoordinatenArt
 */
Ext.define('Lada.view.widget.KoordinatenArt', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.koordinatenart',
    store: 'KoordinatenArt',
    requires: ['Lada.store.KoordinatenArt'],
    displayField: 'id',
    valueField: 'id',
    // Enable filtering of comboboxes
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    editable: this.editable || false,
    disableKeyFilter: true,
    forceSelection: true,
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{id} - {koordinatenart}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id} - {koordinatenart}</tpl>'),

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.koordinatenart');

        var store = Ext.data.StoreManager.get('koordinatenart');
        if (!store) {
            Ext.create('Lada.store.KoordinatenArt', {
                storeId: 'koordinatenart'
            });
        }
        this.store = Ext.data.StoreManager.get('koordinatenart');
        this.callParent(arguments);
    }
});
