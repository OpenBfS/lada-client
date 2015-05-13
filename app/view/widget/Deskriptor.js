/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Deskriptor
 */
Ext.define('Lada.view.widget.Deskriptor', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.deskriptor',
    displayField: 'beschreibung',
    valueField: 'id',
    // Enable filtering of comboboxes
    triggerAction: 'all',
    typeAhead: false,
    layer: null,
    queryMode: 'local',
    listeners: {
        expand: {
            fn: function(field) {
                if (field.up('deskriptor').layer === 0) {
                    field.store.proxy.extraParams = {'layer': field.up('deskriptor').layer};
                    field.store.load();
                }
                else {
                    var parents = field.up('deskriptor').getParents(this);
                    if (parents !== '') {
                        field.store.proxy.extraParams = {
                            'layer': field.up('deskriptor').layer,
                            'parents': parents
                        };
                        field.store.load();
                    }
                }
            }
        }
    },

    initComponent: function() {
        this.store = Ext.create('Lada.store.Deskriptoren');

        this.callParent(arguments);
        this.down('combobox').isFormField = false;
    },

    getParents: function(field) {
        var set = field.up('fieldset');
        var allS = set.items.items;
        var p = '';

        for (var i = 0; i < field.up('deskriptor').layer; i++) {
            if (allS[i].getValue() > 0) {
                p += allS[i].getValue();
                if (i < field.up('deskriptor').layer - 1) {
                    p += ', ';
                }
            }
        }
        return p;
    }
});
