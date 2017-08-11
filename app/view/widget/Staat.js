/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Staat
 */
Ext.define('Lada.view.widget.Staat', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.staat',
    store: 'Staaten',
    displayField: 'staat',
    valueField: 'id',
    emptyText: 'Wählen Sie einen Staat',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    forceSelection: this.forceSelection || false,

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('staaten');
        if (!this.store) {
            this.store = Ext.create('Lada.store.Staaten');
        }
        this.store.clearFilter();
        this.callParent(arguments);
    }
});
