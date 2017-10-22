/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for OrtTyp
 */
Ext.define('Lada.view.widget.OrtTyp', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.orttyp',
    store: 'OrtTyp',
    displayField: 'id',
    valueField: 'id',
    editable: this.editable || false,
    disableKeyFilter: true,
    forceSelection: true,
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{code} - {ortTyp}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{code} - {ortTyp}</tpl>'),

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.orttyp');

        this.store = Ext.data.StoreManager.get('orttyp');
        if (!this.store) {
            this.store = Ext.create('Lada.store.OrtTyp');
        }
        this.callParent(arguments);
    }
});
