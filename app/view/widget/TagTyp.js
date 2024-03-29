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
    requires: ['Lada.store.TagTyp'],
    store: null,
    displayField: 'label',
    valueField: 'value',

    // Enable filtering of comboboxes
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    forceSelection: true,
    minChars: 0,
    filteredStore: false,
    listConfig: {minWidth: 110},

    initComponent: function() {
        this.store = Ext.create('Lada.store.TagTyp');
        this.callParent(arguments);
        var me = this;
        this.down('combobox').on({
            focus: function(combo) {
                var store = combo.getStore();
                store.clearFilter();
                if (me.filteredStore) {
                    store.filterBy(function(record) {
                        return record.get('canSelect')();
                    });
                }
            }
        });
    }
});
