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
    displayField: 'umweltBereich',
    valueField: 'id',
    editable: this.editable || false,
    forceSelection: true,
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    lastQuery: '',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{id} - {umweltBereich}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id} - {umweltBereich}</tpl>'),
    enableKeyEvents: true,
    reiWarning: null,
    allowBlank: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.umweltbereich');

        this.store = Ext.create('Lada.store.Umwelt');
        this.store.extraParams = {};
        this.store.load();
        this.store.sort();
        this.callParent(arguments);
    },

    setReiWarningVisible: function(state) {
        var i18n = Lada.getApplication().bundle;
        if (state) {
            this.showWarnings(i18n.getMsg('warn.msg.umwelt.reiprogpunktgruppe'));
        } else {
            this.clearWarningOrError();
        }
    }
});
