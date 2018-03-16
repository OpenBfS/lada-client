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
            itemId: 'sortGrid',
            flex: 1,
            xtype: 'grid',
            multiSelect: true,
            stripeRows: true,
            viewConfig: {
                // plugins: {
                //     ptype: 'gridviewdragdrop',
                //     containerScroll: true,
                //     dragGroup: group1,
                //     dropGroup: group1
                // },
                // listeners: {
                //     drop: function(node, data, dropRec, dropPosition) {
                //     var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
                //     Ext.example.msg('Drag from right to left', 'Dropped ' + data.records[0].get('name') + dropOn);
                //     },
                //     //storeload: targetGrid.update
                // }
            },
            store: new Ext.data.Store({
                model: Ext.create('Ext.data.Model', {
                    fields: [{name: 'dataIndex'},
                    {name: 'sort'}]
                })
            }),
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
    }
});
