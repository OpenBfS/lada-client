/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Probenehmer
 */
Ext.define('Lada.view.widget.Probenehmer', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.probenehmer',
    store: 'Probenehmer',
    displayField: 'extId',
    valueField: 'id',
    searchValueField: 'shortText',

    //additional actions to be taken after initComponent
    extraParams: this.extraParams || null,
    editable: this.editable || false,
    forceSelection: true,
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    labelTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{shortText:htmlEncode}</tpl>'),
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{extId:htmlEncode} - {shortText:htmlEncode}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{shortText:htmlEncode}</tpl>'),

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.probenehmer');
        this.store = Ext.create('Lada.store.Probenehmer');
        this.store.sort('shortText', 'ASC');
        this.callParent(arguments);
        if (this.extraParams) {
            this.extraParams();
        }
        this.store.load();
    }
});
