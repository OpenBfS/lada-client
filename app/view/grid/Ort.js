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
Ext.define('Lada.view.grid.Ort', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ortgrid',

    maxHeight: 350,
    emptyText: 'Keine Orte gefunden.',
        // minHeight and deferEmptyText are needed to be able to show the
        // emptyText message.
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 5, 5',

    recordId: null,

    warnings: null,
    errors: null,

    initComponent: function() {
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,
            itemId: 'rowedit'
        });
        this.plugins = [rowEditing];

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: 'Details',
                icon: 'resources/img/document-open.png',
                action: 'open',
                disabled: true
            }, {
                text: 'Hinzufügen',
                icon: 'resources/img/list-add.png',
                action: 'add',
                probeId: this.probeId
            }, {
                text: 'Löschen',
                icon: 'resources/img/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = [{
            header: 'Typ',
            dataIndex: 'ortsTyp',
            width: 50,
            editor: {
                allowBlank: false
            }
        }, {
            header: 'Staat',
            dataIndex: 'ort',
            width: 70,
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('locations');
                var staaten = Ext.data.StoreManager.get('staaten');
                var record =
                    staaten.getById(store.getById(value).get('staatId'));
                return record.get('staatIso');
            }
        }, {
            header: 'Gemeineschlüssel',
            dataIndex: 'ort',
            width: 120,
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('locations');
                var record = store.getById(value);
                return record.get('verwaltungseinheitId');
            }
        }, {
            header: 'Gemeindename',
            dataIndex: 'ort',
            flex: 1,
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('locations');
                var gemeinden =
                    Ext.data.StoreManager.get('verwaltungseinheiten');
                var record = store.getById(value);
                var gemid = record.get('verwaltungseinheitId');
                var record2 = gemeinden.getById(gemid);
                return record2.get('bezeichnung');
            }
        }, {
            header: 'Messpunkt',
            dataIndex: 'ort',
            renderer: function(value) {
                var store = Ext.getStore('locations');
                var record = store.getById(value);
                return record.get('bezeichnung');
            }
        }];
        this.initData();
        this.callParent(arguments);
    },

    initData: function() {
        this.store = Ext.create('Lada.store.Orte');
        this.store.load({
            params: {
                probeId: this.recordId
            }
        });
        Ext.ClassManager.get('Lada.model.Probe').load(this.recordId, {
            failure: function(record, action) {
                // TODO
            },
            success: function(record, response) {
                var json = Ext.decode(response.response.responseText);
                if (json) {
                    this.warnings = json.warnings;
                    this.errors = json.errors;
                }
            },
            scope: this
        });
    },


    setReadOnly: function() {
        this.getPlugin('rowedit').disable();
        this.down('button[action=add]').disable();
        this.down('button[action=delete]').disable();
    }
});
