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
Ext.define('Lada.view.widget.ColumnSort' ,{
    extend: 'Ext.container.Container',
    alias: 'widget.columnsort',
    layout: {
        type: 'hbox',
        align: 'stretchmax'
    },
    require: ['Lada.view.widget.Sort'],
    margin: '20,0,0,10',
    title: null,
    store: Ext.data.Store({
        model: 'Lada.model.Column'
    }),

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var cboxmodel = Ext.create('Ext.data.Model', {
            fields: [{name: 'name'}, {name: 'value'}]
        });
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
            name: 'sortGrid',
            flex: 1,
            xtype: 'grid',
            scrollable: true,
            maxHeight: 125,
            multiSelect: true,
            stripeRows: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    containerScroll: true,
                    listeners: {
                        drop: function(node, data) {
                            var ctl = Lada.app.getController(
                                'Lada.controller.Query');
                            for (var i = 0 ; i < data.records.length; i++ ) {
                                var gcv = data.records[i].get(
                                    'gridColumnValues');
                                var newidx = node.indexOf(data.records[0]) + 1;
                                gcv['sortIndex'] = newidx;
                                data.records[i].set('gridColumnValues', gcv);
                                ctl.changeQueryParameter(me, 'gridColumnValue',
                                    data.records[i], gcv);
                            }
                        }
                    }
                },
                markDirty: false
            },
            columns: [{
                text: '',
                sortable: false,
                dataIndex: 'dataIndex',
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
                            var ctl = Lada.app.getController(
                                'Lada.controller.Query');
                            var newval = newValue || null;
                            var rec = box.$widgetRecord;
                            var gcv = rec.get('gridColumnValues');
                            gcv['sort'] = newval;
                            rec.set('gridColumnValues', gcv);
                            ctl.changeQueryParameter(me, 'gridColumnValue',
                                rec, gcv);

                        }
                    }
                },
                text: '',
                dataIndex: 'sort',
                sortable: false
            }],
            title: i18n.getMsg('query.sorting'),
            minHeight: 0
        }];
        this.callParent();
    },

    setVisible: function(data, visible) {
        var ctl = Lada.app.getController('Lada.controller.Query');
        for (var i=0; i < data.records.length; i++) {
            var gcv = data.records[i].get('gridColumnValues');
            gcv['visible'] = visible;
            ctl.changeQueryParameter(this, 'gridColumnValue', data[i], gcv);
            data.records[i].set('gridColumnValues', gcv);
        }
    },

    setStore: function(newStore) {
        if (newStore) {
            this.store.setData(newStore.getData());
            this.store.filter([{
                property: 'visible',
                value: true
            }]);
        }
    }
});
