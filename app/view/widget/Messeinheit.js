/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Messeinheit
 */
Ext.define('Lada.view.widget.Messeinheit', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.messeinheit',
    store: 'Messeinheiten',
    displayField: 'einheit',
    valueField: 'id',
    emptyText: 'Wählen Sie eine Messeinheit',
    // Enable filtering of comboboxes
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('messeinheiten');
        if (!this.store) {
            this.store = Ext.create('Lada.store.Messeinheiten');
        } else {
            this.store.clearFilter();
        }
        this.callParent(arguments);
    }
});
