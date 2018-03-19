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
    margin: '5,0,0,5',
    initComponent: function(){
        var i18n = Lada.getApplication().bundle;
        var group1 = this.id + 'group1';
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
            columns: [{
                text: '',
                sortable: false,
                dataIndex: 'dataIndex'
            },{
                xtype: 'widgetcolumn',
                widget: {
                    xtype: 'combobox'
                },
                text: '',
                sortable: false,
                dataIndex: 'sort'
            }],
            title: i18n.getMsg('query.sorting'),
            header: false,
            margin: '5 0 5 0',
            minHeight:20
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
