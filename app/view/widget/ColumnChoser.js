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
Ext.define('Lada.view.widget.ColumnChoser', {
    extend: 'Ext.container.Container',
    alias: 'widget.columnchoser',
    layout: {
        type: 'hbox',
        align: 'stretchmax'
    },
    store: null,
    margin: '15 0 10 0',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var col_columns = [{
            text: '',
            sortable: true,
            dataIndex: 'gridColMpId',
            renderer: function(value, metadata, record) {
                if (!value || value === '') {
                    return '';
                }
                return Ext.htmlEncode(record.get('gridCol'));
            },
            flex: 1
        }];
        this.items = [{
            itemId: 'sourceGrid',
            flex: 1,
            xtype: 'grid',
            border: true,
            store: null,
            multiSelect: true,
            stripeRows: true,
            viewConfig: {
                enableTextSelection: false,
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'cChooserDdGroup',
                    dropGroup: 'cChooserDdGroup',
                    containerScroll: true
                },
                listeners: {
                    drop: function(node, data) {
                        me.setVisible(data.records, false);
                        me.fireEvent('change');
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
                        me.fireEvent('change');
                    }
                }
            }, {
                action: 'moveRR',
                iconCls: 'x-fa fa-angle-double-right',
                listeners: {
                    click: function() {
                        me.moveData('sourceGrid', 'targetGrid', false);
                        me.fireEvent('change');

                    }
                }
            }, {
                action: 'moveL',
                iconCls: 'x-fa fa-angle-left',
                listeners: {
                    click: function() {
                        me.moveData('targetGrid', 'sourceGrid', true);
                        me.fireEvent('change');
                    }
                }
            }, {
                action: 'moveLL',
                iconCls: 'x-fa fa-angle-double-left',
                listeners: {
                    click: function() {
                        me.moveData('targetGrid', 'sourceGrid', false);
                        me.fireEvent('change');
                    }
                }
            }]
        }, {
            itemId: 'targetGrid',
            name: 'targetGrid',
            store: null,
            flex: 1,
            xtype: 'grid',
            border: true,
            multiSelect: true,
            viewConfig: {
                enableTextSelection: false,
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'cChooserDdGroup',
                    dropGroup: 'cChooserDdGroup',
                    containerScroll: true
                },
                listeners: {
                    drop: function(node, data) {
                        me.setVisible(data.records, true);
                        me.fireEvent('change');
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
        if (data[0] === undefined) {
            return;
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
        if (data[0].get('isVisible') !== visible) {
            var gcv_store = this.up('querypanel').gridColumnValueStore;
            for (var i = 0; i < data.length; i++) {
                data[i].set('isVisible', visible);
                var origindata = gcv_store.getById(data[i].get('id'));
                if (!origindata) {
                    gcv_store.add(data[i]);
                    origindata = gcv_store.getById(data[i].get('id'));
                } else {
                    origindata.set('isVisible', visible);

                }
                if (visible === false) {
                    origindata.set('colIndex', null);
                    origindata.set('sort', null);
                    data[i].set('colIndex', null);
                }
            }
        }
        this.sortvisibles();
    },

    sortvisibles: function() {
        var querypanel = this.up('querypanel');
        var gcv_store = querypanel.gridColumnValueStore;
        var tarstore = this.getComponent('targetGrid').getStore();
        var taritems = tarstore.getData().items;
        for ( var j = 0; j < taritems.length; j++) {
            var item = taritems[j];
            if (item.get('isVisible') === true) {
                var targetgridrecord = tarstore.findRecord('gridColMpId',
                    item.get('gridColMpId'), false, false, false,
                    true);
                targetgridrecord.set('colIndex', j);
                gcv_store.findRecord('gridColMpId',
                    item.get('gridColMpId'), false, false, false, true)
                    .set('colIndex', j);

            }
        }
        var ctrl = querypanel.getController();
        ctrl.showFilter(this);
    },

    setStore: function(store, fixedcolumnstore) {
        this.store = store;
        this.fixedcolumnstore = fixedcolumnstore;
        var tstore = new Ext.data.Store({
            model: 'Lada.model.GridColConf',
            proxy: {
                type: 'memory',
                reader: 'array'
            }
        });
        var sstore = new Ext.data.Store({model: 'Lada.model.GridColConf'});
        if (store && fixedcolumnstore) {
            // var data = store.getData().items;
            var fixeddata = fixedcolumnstore.getData().items;
            for (var i = 0; i < fixeddata.length; i++) {
                var col = store.findRecord(
                    'gridColMpId', fixeddata[i].get('id'));
                if (col) {
                    if (col.get('isVisible') === true) {
                        tstore.add(col);
                    } else {
                        sstore.add(col);
                    }
                } else {
                    col = Ext.create('Lada.model.GridColConf', {
                        gridColMpId: fixeddata[i].get('id'),
                        isVisible: false,
                        isFIlterActive: false,
                        gridCol: fixeddata[i].get('gridCol'),
                        dataIndex: fixeddata[i].get('dataIndex')
                    });
                    store.add(col);
                    sstore.add(col);
                }
            }
        }
        tstore.sort('colIndex', 'ASC');
        tstore.getSorters().clear();
        this.getComponent('targetGrid').onAfter({
            reconfigure: {
                fn: function() {
                    this.fireEvent('loadend');
                },
                scope: this,
                single: true
            }
        });
        this.getComponent('targetGrid').setStore(tstore);
        this.getComponent('sourceGrid').setStore(sstore);
        this.sortvisibles();
    }
});
