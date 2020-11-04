/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Widget for sorting columns
 */
Ext.define('Lada.view.widget.ColumnSort' ,{
    extend: 'Ext.container.Container',
    alias: 'widget.columnsort',
    layout: {
        type: 'hbox',
        align: 'stretchmax'
    },
    requires: ['Lada.view.widget.Sort',
        'Lada.store.GridColumnValue'
    ],
    margin: '20 0 20 0',
    title: null,
    store: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var cboxmodel = Ext.create('Ext.data.Model', {
            fields: [{name: 'name'}, {name: 'value'}]
        });
        this.store = Ext.create('Lada.store.GridColumnValue');
        var comboboxstore = Ext.create('Ext.data.Store', {
            model: cboxmodel,
            data: [{
                name: 'Aufsteigend',
                value: 'asc'
            }, {
                name: 'Absteigend',
                value: 'desc'
            }, {
                name: 'Keine Sortierung',
                value: null
            }]
        });

        this.items = [{
            xtype: 'container',
            layout: 'hbox',
            width: '100%',
            items: [{
                name: 'sortGrid',
                flex: 1,
                xtype: 'grid',
                border: true,
                store: this.store,
                scrollable: true,
                maxHeight: 200,
                height: 200,
                minHeight: 200,
                autoSort: false,
                multiSelect: true,
                stripeRows: true,
                viewConfig: {
                    enableTextSelection: false,
                    plugins: {
                        ptype: 'gridviewdragdrop',
                        containerScroll: true
                    },
                    listeners: {
                        drop: function() {
                            me.saveColumnOrder();
                            me.fireEvent('change');
                        }
                    },
                    markDirty: false
                },
                columns: [{
                    text: '',
                    sortable: false,
                    dataIndex: 'name',
                    flex: 2
                },{
                    xtype: 'widgetcolumn',
                    minWidth: 150,
                    widget: {
                        xtype: 'combobox',
                        dataIndex: 'sort',
                        model: cboxmodel,
                        store: comboboxstore,
                        defaultValue: null,
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'value',
                        triggers: {
                            clear: {
                                hidden: true
                            }
                        },
                        listeners: {
                            change: function(box, newValue) {
                                var newval = newValue || null;
                                var rec = box.$widgetRecord;
                                rec.set('sort', newval);
                                var origindata = this.up('querypanel')
                                    .gridColumnValueStore.getById(rec.get('id'));
                                if (origindata) {
                                    origindata.set('sort', newval);
                                }
                                me.fireEvent('change');
                            }
                        }
                    },
                    text: '',
                    dataIndex: 'sort',
                    sortable: false
                }],
                title: i18n.getMsg('query.sorting')
            }, {
                xtype: 'container',
                layout: 'vbox',
                width: '25',
                margin: '25 0 5 10',
                items: [{
                    xtype: 'button',
                    iconCls: 'x-fa fa-angle-double-up',
                    margin: '5 0 0 0',
                    handler: function() {
                        me.moveSelectedRows('first');
                        me.fireEvent('change');
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-angle-up',
                    margin: '5 0 0 0',
                    handler: function() {
                        me.moveSelectedRows('up');
                        me.fireEvent('change');
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-angle-down',
                    margin: '5 0 0 0',
                    handler: function() {
                        me.moveSelectedRows('down');
                        me.fireEvent('change');
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-angle-double-down',
                    margin: '5 0 0 0',
                    handler: function() {
                        me.moveSelectedRows('last');
                        me.fireEvent('change');
                    }
                }]
            }]
        }];
        this.callParent();
    },

    /**
     * Move the selected rows.
     * @param direction up, down, first and last
     */
    moveSelectedRows: function(direction) {
        var grid = this.down('grid[name=sortGrid]');
        var selectedRows = grid.getSelection();

        for (var i = selectedRows.length - 1; i >= 0 ; i--) {
            var row = selectedRows[i];
            var index = this.store.indexOf(row);
            var maxIdx = this.store.count() - 1;

            switch (direction) {
                case 'first':
                    index = 0;
                    break;
                case 'up':
                    index = index > 0 ? index-- : 0;
                    break;
                case 'down':
                    index = index < maxIdx ? index++ : maxIdx;
                    break;
                case 'last':
                    index = maxIdx;
                    break;
            }

            this.store.remove(row);
            this.store.insert(index, row);
            grid.getSelectionModel().select(row, true);
        }
        this.saveColumnOrder();
    },

    saveColumnOrder: function() {
        // write the new order to the store(s)
        // TODO this is still not good. It relies on uniqueness
        // of column names, and that the table's cell template
        // does not change.
        var me = this;
        var nodes = me.down('grid[name=sortGrid]').getView()
            .getNodes();
        var columnstore = Ext.data.StoreManager.get('columnstore');
        for (var i = 0 ; i < nodes.length; i++) {
            var nodename = nodes[i].innerText.substr(0,
                nodes[i].innerText.length -3);
            //Remove linebreaks
            nodename = nodename.replace(/(\r\n|\n|\r)/gm, '');
            //TODO this relies on column names to be unique
            var qf = columnstore.findRecord('name', nodename);
            var entry = this.store.findRecord(
                'gridColumnId', qf.get('id'));
            var orig_entry = me.up(
                'querypanel').gridColumnValueStore.findRecord(
                'gridColumnId', qf.get('id'));
            entry.set('sortIndex', i);
            orig_entry.set('sortIndex', i);
        }
    },

    setStore: function(newStore) {
        this.store.clearFilter();
        this.store.removeAll();
        if (newStore) {
            this.store.setData(newStore.getData().items);
        }
        this.store.filter('visible', true);
        this.store.sort('sortIndex', 'ASC');
        this.down('grid').setStore(this.store);
        var sorter = this.store.getSorters();
        sorter.remove('sortIndex');
    }
});
