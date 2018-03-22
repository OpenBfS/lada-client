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
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var group = this.id;
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
                value: 'none'
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
                    containerScroll: true
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
                    model: cboxmodel,
                    store: comboboxstore,
                    defaultValue: 'none',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value',
                    triggers: {
                        clear: {
                            hidden: true
                        //     extraCls: 'x-form-clear-trigger',
                        //     handler: function() {
                        //         this.setValue('none');
                        //     }
                        }
                    },
                    listeners: {
                        change: function(box, newValue, oldValue, eOpts) {
                            var newval = newValue || 'none';
                            var cols = box.up('querypanel').down(
                                'columnchoser').getComponent('targetGrid').getStore();
                            var rec = cols.findRecord('dataIndex',
                                box.$widgetRecord.get('dataIndex'));
                            if (rec) {
                                rec.set('sort', newval);
                            }
                        }
                    }
                },
                text: '',
                dataIndex: 'sort',
                sortable: false
            }],
            title: i18n.getMsg('query.sorting'),
            // header: false,
            minHeight: 0
        }];
        this.callParent();
    },
    setStore: function(newStore) {
        var grid = this.down('grid');
        if (newStore) {
            var gridStore = grid.getStore();
            if (!gridStore) {
                grid.setStore(newStore);
            } else {
                var resulting_newstore = Ext.create('Ext.data.Store', {
                    model: 'Lada.model.Column'
                });
                var oldcolumns = gridStore.getRange();
                for (var i=0; i < oldcolumns.length; i++) {
                    var rec = newStore.findRecord('dataIndex',
                        oldcolumns[i].get('dataIndex'));
                    if (rec) {
                        resulting_newstore.add(rec);
                    }
                }
                var newcolumns = newStore.getRange();
                for (var j=0; j < newcolumns.length; j++) {
                    var rec = resulting_newstore.findRecord('dataIndex',
                        newcolumns[j].get('dataIndex'));
                    if (!rec) {
                        resulting_newstore.add(newcolumns[j]);
                    }
                }
                grid.setStore(resulting_newstore);
            }
        }
    }
});
