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
    store: Ext.create('Ext.data.Store', {
        model: Ext.create('Ext.data.Model', {
            fields: [{name: 'dataIndex'},{name: 'sort'}]
        }),
        data: [{
            dataIndex: 'Nulleintrag 1',
            sort: 'asc'
        },{
            dataIndex: 'Nulleintrag 3',
            sort: 'desc'
        },{
            dataIndex: 'Nulleintrag 2',
            sort: 'none'
        }]
    }),

    initComponent: function(){
        var i18n = Lada.getApplication().bundle;
        var group = this.id;
        var comboboxstore = Ext.create('Ext.data.Store', {
            model: Ext.create('Ext.data.Model', {
                fields: [{name: 'name'}, {name: 'value'}]
            }),
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
            multiSelect: true,
            stripeRows: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    containerScroll: false
                }
            },
            store: this.store,
            columns: [{
                text: '',
                sortable: false,
                dataIndex: 'dataIndex',
                flex: 2
            },{
                xtype: 'widgetcolumn',
                widget: {
                    xtype: 'combobox',
                    store: comboboxstore
                },
                text: '',
                sortable: false
                // dataIndex: 'sort'
            }],
            title: i18n.getMsg('query.sorting'),
            // header: false,
            minHeight: 0
            }];
            this.callParent();
    },
    setStore: function (store){
        if (store){
            this.down('grid').store = store;
        }
    }
    //TODO on datachange: change this.up('querypanel').currentColumns
});
