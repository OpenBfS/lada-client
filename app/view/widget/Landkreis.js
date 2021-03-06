/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Landkreis
 */
Ext.define('Lada.view.widget.Landkreis', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.landkreis',
    store: 'landkreiswidget',
    displayField: 'bezeichnung',
    valueField: 'id',
    hideTrigger: true,
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'type',
    typeAhead: false,
    minChars: 2,
    labelTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id} - {bezeichnung}</tpl>'),
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{id} - {bezeichnung}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id} - {bezeichnung}</tpl>'),
    forceSelection: this.forceSelection || false,

    initComponent: function() {
        var i18n= Lada.getApplication().bundle;
        this.emptyText= i18n.getMsg('emptytext.landkreis');
        this.store = Ext.data.StoreManager.get('landkreiswidget');
        this.callParent(arguments);
    }
});
