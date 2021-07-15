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
    store: 'OrtszuordnungTyp',
    displayField: 'ortstyp',
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

        this.store = Ext.data.StoreManager.get('ortszuordnungtyp');
        if (!this.store) {
            this.store = Ext.create('Lada.store.OrtszuordnungTyp');
        }
        this.store.sort();
        this.callParent(arguments);
    }
});
