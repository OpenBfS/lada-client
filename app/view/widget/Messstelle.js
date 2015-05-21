/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Messstelle
 */
Ext.define('Lada.view.widget.Messstelle', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.messstelle',
    store: 'Messstellen',
    displayField: 'messStelle',
    valueField: 'id',
    editable: this.editable || false,
    forceSelection: true,
    emptyText: 'Wählen Sie eine Messstelle',
    // Enable filtering of comboboxes
    autoSelect: true,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('messstellen');
        if (!this.store) {
            this.store = Ext.create('Lada.store.Messstellen');
        }
        this.store.clearFilter(true);
        this.callParent(arguments);
    }
});
