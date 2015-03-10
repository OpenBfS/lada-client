/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Grid to list Kommentare
 */
Ext.define('Lada.view.grid.PKommentar', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.pkommentargrid',

    requires: [
        'Ext.toolbar.Toolbar',
        'Lada.store.PKommentare'
    ],

    maxHeight: 350,
    emptyText: 'Keine Kommentaregefunden.',
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
                action: 'add',
                probeId: this.probeId
            }, {
                text: 'Löschen',
                icon: 'resources/img/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = [{
            header: 'Erzeuger',
            dataIndex: 'erzeuger',
            width: 140,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var store = Ext.data.StoreManager.get('messstellen');
                var record = store.getById(value);
                return record.get('messStelle');
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('messstellen'),
                displayField: 'messStelle',
                valueField: 'id',
                allowBlank: false
            }
        }, {
            header: 'Datum',
            dataIndex: 'datum',
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
            renderer: function(value) {
                return '<div style="white-space: normal !important;">' +
                    value + '</div>';
            },
            editor: {
                xtype: 'textarea',
                allowBlank: false
            }
        }];
        this.initData();
        this.callParent(arguments);
    },

    initData: function() {
        this.store = Ext.create('Lada.store.PKommentare');
        this.store.load({
            params: {
                probeId: this.recordId
            }
        });
    }
});
