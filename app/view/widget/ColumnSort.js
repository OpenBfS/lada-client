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
    initComponent: function(){
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
                            extraCls: 'x-form-clear-trigger',
                            handler: function() {
                                this.setValue('none');
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
    setStore: function (store){
        if (store){
            store.clearFilter();
            this.down('grid').reconfigure(store);
        }
    }
    //TODO on datachange: change this.up('querypanel').currentColumns
});
