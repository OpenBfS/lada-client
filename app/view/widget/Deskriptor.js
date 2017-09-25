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
    lastQuery: null,
    queryMode: 'local',
    allowBlank: true,
    remoteFilter: false,
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
        '<tpl if="sn &gt; 9">{sn} - {beschreibung}</tpl>',
        '<tpl if="sn &lt; 10">0{sn} - {beschreibung}</tpl></div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
         '<tpl for="."><tpl if="sn &gt; 9">{sn} - {beschreibung}</tpl>',
         '<tpl if="sn &gt; 0 &amp;&amp;sn &lt; 10">0{sn} - {beschreibung}</tpl>',
         '</tpl>'),

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
        var combobox = this.down('combobox');
        combobox.isFormField = false;
        combobox.on('focus', this.focusfn);
        // normal clear action does not trigger the descriptorselect handler
        // to delete child deskriptoren.
        combobox.triggers.clear.handler = function(){
            this.select('0');
            this.fireEvent('select', this, this.store.getAt(0));
        }
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
    },

    focusfn: function(field) {
        var deskriptor = field.up('deskriptor');
        if (deskriptor.layer === 0) {
            deskriptor.store.proxy.extraParams = {'layer': deskriptor.layer};
        }
        else {
            var parents = deskriptor.getParents(field);
            if (parents !== '') {
                deskriptor.store.proxy.extraParams = {
                    'layer': deskriptor.layer,
                    'parents': parents
                };
                deskriptor.store.load();
            }
            else {
                deskriptor.store.proxy.extraParams = {
                    'layer': deskriptor.layer
                };
                deskriptor.store.load();
            }
        }
    }
});
