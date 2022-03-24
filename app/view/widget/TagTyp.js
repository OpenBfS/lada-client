/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for tag types
 */
Ext.define('Lada.view.widget.TagTyp', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.tagtyp',
    store: null,
    displayField: 'label',
    valueField: 'value',

    // Enable filtering of comboboxes
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    forceSelection: true,
    minChars: 0,
    listConfig: {minWidth: 110},

    initComponent: function() {
        if (!this.store) {
            this.store = Ext.data.StoreManager.get('tagtypstore');
        }
        this.callParent(arguments);
    }
});
