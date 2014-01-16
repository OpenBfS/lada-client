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
Ext.define('Lada.view.widgets.Verwaltungseinheit' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.verwaltungseinheiten',
        store: 'Verwaltungseinheiten',
        displayField: 'bezeichnung',
        valueField: 'gemId',
        emptyText:'Wählen Sie eine Verwaltungseinheit',
        hideTrigger: true,
        // Enable filtering of comboboxes
        autoSelect: false,
        queryMode: 'remote',
        triggerAction : 'type',
        typeAhead: true,
        minChars: 2,
    initComponent: function() {
        this.callParent(arguments);
    },
    // This listener is used to load currently "selected" verwaltungseinheit.
    // This is needed as without having this record the field would only
    // display the raw value (id) of the verwaltungseinheit.
    listeners: {
        render: function(combo, eOpts) {
            combo.store.load({
                id: this.getValue()
            });
        }
    }
});
