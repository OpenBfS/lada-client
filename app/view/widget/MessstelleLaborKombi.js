/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Messstelle/Labor
 */
Ext.define('Lada.view.widget.MessstelleLaborKombi', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.messstellelaborkombi',
    store: 'MessstelleLaborKombi',
    displayField: 'displayCombi',
    searchValueField: 'messStelle',
    valueField: 'id',
    editable: this.editable || false,
    forceSelection: true,

    // Enable filtering of comboboxes
    autoSelect: true,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.messstellelabor');
        this.store = Ext.data.StoreManager.get('messstellelaborkombi');
        this.callParent(arguments);
        this.down('combobox').isFormField = false;

    },
    setStore: function(store) {
        if (store) {
            this.store = store;
            this.down('combobox').setStore(store);
        }
    },

    setValue: function(value) {
        this.down('combobox').setValue(value);
    }
});
