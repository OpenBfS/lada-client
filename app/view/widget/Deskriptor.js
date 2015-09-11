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
    displayField: 'id',
    valueField: 'id',
    // Enable filtering of comboboxes
    triggerAction: 'all',
    typeAhead: false,
    layer: null,
    queryMode: 'remote',
    remoteFilter: true,
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{sn} - {beschreibung}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
         '<tpl for="."><tpl if="sn &gt; 0">{sn} - {beschreibung}</tpl></tpl>'),

    listeners: {
        focus: {
            fn: function(field) {
                if (field.up('deskriptor').layer === 0) {
                    field.store.proxy.extraParams = {'layer': field.up('deskriptor').layer};
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
                    else {
                        field.store.proxy.extraParams = {
                            'layer': field.up('deskriptor').layer
                        };
                        field.store.load();
                    }
                }
            }
        }
    },

    initComponent: function() {
        this.store = Ext.create('Lada.store.Deskriptoren');
        this.store.on('load', function() {
            this.insert(0, {sn: 0, beschreibung: 'leer'});
            if (this.proxy.extraParams.layer > 0 &&
                !this.proxy.extraParams.parents) {
                this.removeAll();
            }
        }, this.store);

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
