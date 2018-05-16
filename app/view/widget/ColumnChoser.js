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
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var store = Ext.data.StoreManager.get('columnstore');
                var record = store.findRecord('id', value);
                if (record) {
                    return record.get('name');
                }
                return '';
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
                text: '>',
                listeners: {
                    click: function() {
                        me.moveData('sourceGrid', 'targetGrid', true);
                    }
                }
            }, {
                action: 'moveRR',
                text: '>>',
                listeners: {
                    click: function() {
                        me.moveData('sourceGrid', 'targetGrid', false);
                    }
                }
            }, {
                action: 'moveL',
                text: '<',
                listeners: {
                    click: function() {
                        me.moveData('targetGrid', 'sourceGrid', true);
                    }
                }
            }, {
                action: 'moveLL',
                text: '<<',
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
        if (target === 'sourceGrid') {
            this.setVisible(data, false);
        } else if (target === 'targetGrid') {
            this.setVisible(data, true);
        }
        this.getComponent(source).getStore().remove(data);
        this.getComponent(target).getStore().add(data);
    },

    setVisible: function(data, visible) {
        var qps = this.up('querypanel').gridColumnStore;
        for (var i=0; i < data.length; i++) {
            data[i].set('visible', visible);
            var origindata = qps.getById(data[i].get('id'));
            if (!origindata) {
                qps.add(data[i]);
            } else {
                origindata.set('visible', visible);
            }
            if (visible === false) {
                origindata.set('sortIndex', null);
                data[i].set('sortIndex', null);
            }
        }
        this.up('querypanel').down('columnsort').setStore(qps);
    },

    setStore: function(store, fixedcolumnstore) {
        if (store) {
            var tstore = new Ext.data.Store({
                model: 'Lada.model.GridColumn'
            });
            var sstore = new Ext.data.Store({
                model: 'Lada.model.GridColumn'
            });
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
                    col = Ext.create('Lada.model.GridColumn', {
                        gridColumnId: fixeddata[i].get('id'),
                        visible: false,
                        filterActive: false,
                        name: fixeddata[i].get('name'),
                        dataIndex: fixeddata[i].get('dataIndex')
                    });
                    sstore.add(col);
                }
            }
            this.getComponent('targetGrid').setStore(tstore);
            this.getComponent('sourceGrid').setStore(sstore);
        }
    }
});
