/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Umweltbereich
 */
Ext.define('Lada.view.widget.Umwelt' ,{
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.umwelt',
    store: 'Umwelt',
    displayField: 'id',
    valueField: 'id',
    editable: this.editable || false,
    forceSelection: true,
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    tpl: Ext.create("Ext.XTemplate",
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{id} - {umweltBereich}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
         '<tpl for=".">{id} - {umweltBereich}</tpl>'),

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.umweltbereich');

        this.store = Ext.data.StoreManager.get('umwelt');
        if (!this.store) {
            this.store = Ext.create('Lada.store.Umwelt');
        }
        this.store.sort();
        this.callParent(arguments);
    }
});
