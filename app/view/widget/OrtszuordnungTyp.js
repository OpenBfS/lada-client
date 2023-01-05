/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for type of Ortszuordnung
 */
Ext.define('Lada.view.widget.OrtszuordnungTyp', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.ortszuordnungtyp',
    requires: ['Lada.store.OrtszuordnungTyp'],
    store: 'ortszuordnungtyp',
    displayField: 'name',
    valueField: 'id',
    editable: this.editable || false,
    forceSelection: true,
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    width: 350,
    allowBlank: this.allowBlank,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.ortszuordnungtyp');

        var store = Ext.data.StoreManager.get('ortszuordnungtyp');
        if (!store) {
            Ext.create('Lada.store.OrtszuordnungTyp', {
                storeId: 'ortszuordnungtyp'
            });
        }
        this.store = Ext.data.StoreManager.get('ortszuordnungtyp');
        this.store.sort();
        this.callParent(arguments);
    }
});
