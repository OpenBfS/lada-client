/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Statuswert
 */
Ext.define('Lada.view.widget.Status', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.statuswert',
    store: Ext.data.StoreManager.get('statuswerte'),
    displayField: 'wert',
    valueField: 'id',
    emptyText: 'Wählen Sie einen Status',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    initComponent: function() {
        this.callParent(arguments);
    }
});
