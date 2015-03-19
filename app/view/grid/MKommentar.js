/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Grid to list Kommentare for Messunge
 */
Ext.define('Lada.view.grid.MKommentar', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.mkommentargrid',

    maxHeight: 350,
    emptyText: 'Keine Kommentare gefunden.',
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },

    recordId: null,

    initComponent: function() {
        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });
        this.plugins = [this.rowEditing];
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: 'Hinzufügen',
                icon: 'resources/img/list-add.png',
                action: 'add'
            }, {
                text: 'Löschen',
                icon: 'resources/img/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = [{
            header: 'Erzeuger',
            dataIndex: 'erzeuger',
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var mstore = Ext.data.StoreManager.get('messstellen');
                return mstore.getById(value).get('messStelle');
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('messstellen'),
                displayField: 'messStelle',
                valueField: 'id',
                allowBlank: false,
                editable: false,
            }
        }, {
            header: 'Datum',
            dataIndex: 'datum',
            xtype: 'datecolumn',
            format: 'd.m.Y',
            editor: {
                xtype: 'datefield',
                allowBlank: false,
                format: 'd.m.Y',
                maxValue: Ext.Date.format(new Date(), 'd.m.Y')
            }
        }, {
            header: 'Text',
            dataIndex: 'text',
            flex: 1,
            editor: {
                allowBlank: false,
                maxLength: 1000,
                enforceMaxLength: true
            }
        }];
        this.initData();
        this.callParent(arguments);
    },

    initData: function() {
        if (this.store) {
            this.store.removeAll();
        }
        else {
            this.store = Ext.create('Lada.store.MKommentare');
        }
        this.store.load({
            params: {
                messungsId: this.recordId
            }
        });
    }
});
