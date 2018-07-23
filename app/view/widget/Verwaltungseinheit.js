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
    store: 'verwaltungseinheitenwidget',
    displayField: 'bezeichnung',
    valueField: 'id',
    hideTrigger: true,
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'type',
    typeAhead: false,
    minChars: 2,
    forceSelection: this.forceSelection || false,

    initComponent: function() {
        var i18n= Lada.getApplication().bundle;
        this.emptyText= i18n.getMsg('emptytext.verwaltungseinheit');
        // This widget requires a separate store to not change the grid during typing
        this.store = Ext.data.StoreManager.get('verwaltungseinheitenwidget');
        if (!this.store) {
            this.store = Ext.create('Lada.store.Verwaltungseinheiten');
        }
        this.store.clearFilter();
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
