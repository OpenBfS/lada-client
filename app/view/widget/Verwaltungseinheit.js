/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Verwaltungseinheit
 */
Ext.define('Lada.view.widget.Verwaltungseinheit', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.verwaltungseinheit',
    store: null,
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
        '<tpl for=".">{id} - {name}</tpl>'),
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{id} - {name}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id} - {name}</tpl>'),
    forceSelection: this.forceSelection || false,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.verwaltungseinheit');
        if (!this.store) {
            //If no store is provided, create one to prevent side effects
            this.store = Ext.create('Lada.store.Verwaltungseinheiten');
            this.store.clearFilter();
        }

        this.callParent(arguments);
    },
    // This listener is used to load currently "selected" verwaltungseinheit.
    // This is needed as without having this record the field would only
    // display the raw value (id) of the verwaltungseinheit.
    listeners: {
        render: function(combo) {
            combo.store.load({
                id: this.getValue()
            });
        }
    }
});
