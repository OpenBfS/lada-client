/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Grid to list Orte
 */
Ext.define('Lada.view.orte.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ortelist',

    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Orte gefunden.',
        // minHeight and deferEmptyText are needed to be able to show the
        // emptyText message.
        minHeight: 65,
        deferEmptyText: false
    },

    probeId: null,

    initComponent: function() {
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });
        this.plugins = [rowEditing];
        this.store = Ext.data.StoreManager.get('Orte');
        if (!this.store) {
            this.store = Ext.create('Lada.store.Orte');
        }
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: 'Details',
                icon: 'gfx/document-open.png',
                action: 'open'
            }, {
                text: 'Hinzufügen',
                icon: 'gfx/list-add.png',
                action: 'add',
                probeId: this.probeId
            }, {
                text: 'Löschen',
                icon: 'gfx/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = [{
            header: 'Typ',
            dataIndex: 'ortsTyp',
            editor: {
                allowBlank: false
            }
        }, {
            header: 'Staat',
            dataIndex: 'ortId',
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('staOrte');
                var staaten = Ext.data.StoreManager.get('staStaaten');
                var record =
                    staaten.getById(store.getById(value).get('staatId'));
                return record.get('staatIso');
            }
        }, {
            header: 'Gemeineschlüssel',
            dataIndex: 'ortId',
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('staOrte');
                var record = store.getById(value);
                return record.get('gemId');
            }
        }, {
            header: 'Gemeindename',
            dataIndex: 'ortId',
            flex: 1,
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('staOrte');
                var gemeinden =
                    Ext.data.StoreManager.get('staVerwaltungseinheiten');
                var record = store.getById(value);
                var gemid = record.get('gemId');
                var record2 = gemeinden.getById(gemid);
                return record2.get('bezeichnung');
            }
            //editor: {
            //    allowBlank: false
            //}
        }, {
            header: 'Messpunkt',
            dataIndex: 'ortId',
            renderer: function(value) {
                var store = Ext.getStore('staOrte');
                var record = store.getById(value);
                return record.get('bezeichnung');
            }
            //editor: {
            //    allowBlank: false
            //}
        }];
        this.callParent(arguments);
    }
});
