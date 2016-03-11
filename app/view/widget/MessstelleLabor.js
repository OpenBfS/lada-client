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
Ext.define('Lada.view.widget.MessstelleLabor', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.messstellelabor',
    store: 'MessstelleLabor',
    displayField: 'displayCombi',
    valueField: 'id',
    editable: this.editable || false,
    forceSelection: true,
    emptyText: 'Wählen Sie eine Kombination',
    // Enable filtering of comboboxes
    autoSelect: true,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('messstellelabor');
        this.callParent(arguments);
        this.down('combobox').isFormField = false;
    }
});
