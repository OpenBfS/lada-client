/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Bundesland
 */
Ext.define('Lada.view.widget.Bundesland', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.bundesland',
    store: 'bundeslandwidget',
    displayField: 'name',
    valueField: 'id',
    hideTrigger: true,
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'type',
    typeAhead: false,
    minChars: 2,
    labelTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id:htmlEncode} - {name:htmlEncode}</tpl>'),
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{id:htmlEncode} - {name:htmlEncode}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id:htmlEncode} - {name:htmlEncode}</tpl>'),
    forceSelection: this.forceSelection || false,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.bundesland');
        this.store = Ext.data.StoreManager.get('bundeslandwidget');
        this.callParent(arguments);
    }
});
