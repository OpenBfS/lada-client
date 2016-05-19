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
Ext.define('Lada.view.widget.DatensatzErzeuger' ,{
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.datensatzerzeuger',
    store: 'datensatzerzeuger',
    displayField: 'id',
    valueField: 'id',
    emptyText: 'Wählen Sie einen Datensatzerzeuger',
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
            '{daErzeugerId} - {bezeichnung}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
         '<tpl for=".">{daErzeugerId} - {bezeichnung}</tpl>'),

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.datensatzerzeuger');

        this.store = Ext.data.StoreManager.get('datensatzerzeuger');
        if (!this.store) {
            this.store = Ext.create('Lada.store.DatensatzErzeuger');
        }
        this.store.sort();
        this.callParent(arguments);
    }
});
