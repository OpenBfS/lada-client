/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Datenbasis
 */
Ext.define('Lada.view.widget.Datenbasis', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.datenbasis',
    store: 'Datenbasis',
    displayField: 'datenbasis',
    valueField: 'id',
    emptyText: 'Wählen Sie eine Datenbasis',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('datenbasis');
        if (!this.store) {
            this.store = Ext.create('Lada.store.Datenbasis');
        }
        this.callParent(arguments);
    }
});
