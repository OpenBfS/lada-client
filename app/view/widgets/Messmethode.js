/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Messmethode
 */
Ext.define('Lada.view.widgets.Messmethode', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.messmethode',
    store: 'StaMessmethoden',
    displayField: 'display',
    valueField: 'id',
    emptyText: 'Wählen Sie eine Messmethode',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: true,
    minChars: 0,

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('staMessmethoden');
        if (!this.store) {
            this.store = Ext.create('Lada.store.StaMessmethoden');
        }
        this.callParent(arguments);
    }
});
