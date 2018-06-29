/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Widget for chosing and sorting columns
 */
Ext.define('Lada.view.widget.ColumnChoser' ,{
    extend: 'Ext.container.Container',
    alias: 'widget.columnchoser',
    layout: {
        type: 'hbox',
        align: 'stretchmax'
    },
    store: null,
    margin: '20,0,0,10',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var col_columns = [{
            text: '',
            sortable: true,
            dataIndex: 'gridColumnId',
            renderer: function(value, metadata, record) {
                if (!value || value === '') {
                    return '';
                }
                return record.get('name');
            },
            flex: 1
        }];
        this.items = [{
            itemId: 'sourceGrid',
            flex: 1,
            xtype: 'grid',
            store: null,
            multiSelect: true,
            stripeRows: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    containerScroll: true
                },
                listeners: {
                    drop: function(node, data) {
                        me.setVisible(data.records, false);
                    }
                }
            },
            columns: col_columns,
            title: i18n.getMsg('query.availablecolumns')
        }, {
            xtype: 'container',
            layout: {
                type: 'vbox',
                align: 'middle'
            },
            margin: 10,
            defaults: {
                xtype: 'button',
                width: 25,
                padding: 0,
                margin: '5 0'
            },
            items: [{
                action: 'moveR',
                iconCls: 'x-fa fa-angle-right',
                listeners: {
                    click: function() {
                        me.moveData('sourceGrid', 'targetGrid', true);
                    }
                }
            }, {
                action: 'moveRR',
                iconCls: 'x-fa fa-angle-double-right',
                listeners: {
                    click: function() {
                        me.moveData('sourceGrid', 'targetGrid', false);
                    }
                }
            }, {
                action: 'moveL',
                iconCls: 'x-fa fa-angle-left',
                listeners: {
                    click: function() {
                        me.moveData('targetGrid', 'sourceGrid', true);
                    }
                }
            }, {
                action: 'moveLL',
                iconCls: 'x-fa fa-angle-double-left',
                listeners: {
                    click: function() {
                        me.moveData('targetGrid', 'sourceGrid', false);
                    }
                }
            }]
        }, {
            itemId: 'targetGrid',
            name: 'targetGrid',
            store: null,
            flex: 1,
            xtype: 'grid',
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    containerScroll: true
                },
                listeners: {
                    drop: function(node, data) {
                        me.setVisible(data.records, true);
                    }
                }
            },
            columns: col_columns,
            stripeRows: true,
            title: i18n.getMsg('query.usecols')
        }];
        this.callParent();
    },

    /**
     * Helper function for the "move selection/all" buttons.
     */
    moveData: function(source, target, selectiononly) {
        var data = [];
        if (selectiononly === true) {
            data = this.getComponent(source).getSelectionModel().getSelection();
        } else {
            data = this.getComponent(source).getStore().getRange();
        }
        this.getComponent(source).getStore().remove(data);
        this.getComponent(target).getStore().add(data);
        if (target === 'sourceGrid') {
            this.setVisible(data, false);
        } else if (target === 'targetGrid') {
            this.setVisible(data, true);
        }
    },

    setVisible: function(data, visible) {
        //If visibility changes, apply new value
        if (data[0].get('visible') != visible) {
            var gcv_store = this.up('querypanel').gridColumnValueStore;
            for (var i=0; i < data.length; i++) {
                data[i].set('visible', visible);
                var origindata = gcv_store.getById(data[i].get('id'));
                if (!origindata) {
                    gcv_store.add(data[i]);
                    origindata = gcv_store.getById(data[i].get('id'));
                } else {
                    origindata.set('visible', visible);

                }
                if (visible === false) {
                    origindata.set('columnIndex', null);
                    data[i].set('columnIndex', null);
                }
            }
        }
        this.sortvisibles();
    },

    sortvisibles: function() {
        var gcv_store = this.up('querypanel').gridColumnValueStore;
        var gcv_items = gcv_store.getData().items;
        var tarstore = this.getComponent('targetGrid').getStore();
        var taritems = tarstore.getData().items;
        for (var i=0; i< gcv_items.length; i++) {
            var targetgridrecord = tarstore.findRecord('gridColumnId',
                gcv_items[i].get('gridColumnId'), false, false, false,
                true);
            if ( gcv_items[i].get('visible') === true) {
                var pos = -1;
                for (var j=0; j < taritems.length; j++) {
                    if (taritems[j].get('gridColumnId') === gcv_items[i].get(
                        'gridColumnId')
                    ) {
                        pos = j;
                        break;
                    }
                }
                targetgridrecord.set('columnIndex', pos);
                gcv_items[i].set('columnIndex', pos);
            } else {
                gcv_items[i].set('columnIndex', -1);
            }
        }
    },

    setStore: function(store, fixedcolumnstore) {
        this.store = store;
        this.fixedcolumnstore = fixedcolumnstore;
        var tstore = new Ext.data.Store({
            model: 'Lada.model.GridColumnValue',
            proxy: {
                type: 'memory',
                reader: 'array'
            }
        });
        var sstore = new Ext.data.Store({model: 'Lada.model.GridColumnValue'});
        if (store && fixedcolumnstore) {
            // var data = store.getData().items;
            var fixeddata = fixedcolumnstore.getData().items;
            for (var i=0; i < fixeddata.length; i++) {
                var col = store.findRecord('gridColumnId', fixeddata[i].get('id'));
                if (col) {
                    if (col.get('visible') === true) {
                        tstore.add(col);
                    } else {
                        sstore.add(col);
                    }
                } else {
                    col = Ext.create('Lada.model.GridColumnValue', {
                        gridColumnId: fixeddata[i].get('id'),
                        visible: false,
                        filterActive: false,
                        name: fixeddata[i].get('name'),
                        dataIndex: fixeddata[i].get('dataIndex')
                    });
                    store.add(col);
                    sstore.add(col);
                }
            }
        }
        tstore.sort('columnIndex', 'ASC');
        tstore.getSorters().clear();
        this.getComponent('targetGrid').onAfter({
            reconfigure: {
                fn: function() {
                    this.fireEvent('loadend');
                },
                scope: this,
                single: true
            }
        })
        this.getComponent('targetGrid').setStore(tstore);
        this.getComponent('sourceGrid').setStore(sstore);
        this.sortvisibles();
    }
});
