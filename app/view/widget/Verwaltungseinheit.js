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
    store: 'Verwaltungseinheiten',
    displayField: 'bezeichnung',
    valueField: 'id',
    emptyText: 'Wählen Sie eine Verwaltungseinheit',
    hideTrigger: true,
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'remote',
    triggerAction: 'type',
    typeAhead: false,
    minChars: 2,

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('verwaltungseinheiten');
        if (!this.store) {
            this.store = Ext.create('Lada.store.Verwaltungseinheiten');
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
