/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Ortdetails
 */
Ext.define('Lada.view.widget.Location', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.location',
    displayField: 'ortId',
    valueField: 'id',
    emptyText: 'Wählen Sie einen Ort',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('orte');
        if (!this.store) {
            this.store = Ext.create('Lada.store.Orte');
        }
        this.callParent(arguments);
    }
});
