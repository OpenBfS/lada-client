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
    selectedStore: Ext.create('Ext.data.Store',{
        model: 'Lada.model.Column'
    }),
    margin: '20,0,0,10',

    initComponent: function(){
        var i18n = Lada.getApplication().bundle;
        var me = this;
        col_columns = [{
            text: '',
            sortable: true,
            dataIndex: 'dataIndex',
            flex: 1
        }];
        this.items = [{
            itemId: 'sourceGrid',
            flex: 1,
            xtype: 'grid',
            multiSelect: true,
            stripeRows: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    containerScroll: true
                },
                listeners: {
                    drop: function(node, data, dropRec, dropPosition) {
                        me.filterUpdate();
                    }
                }
            },
            store: new Ext.data.Store({
                model: 'Lada.model.Column',
            }),
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
                        click: function(button){
                            me.moveData('sourceGrid', 'targetGrid', true);
                        }
                    }
                }, {
                    action: 'moveRR',
                    text: '>>',
                    listeners: {
                        click: function(button){
                            me.moveData('sourceGrid', 'targetGrid', false);
                        }
                    }
                }, {
                    action: 'moveL',
                    text: '<',
                    listeners: {
                        click: function(button){
                            me.moveData('targetGrid', 'sourceGrid', true);
                        }
                    }
                }, {
                    action: 'moveLL',
                    text: '<<',
                    listeners: {
                        click: function(button){
                            me.moveData('targetGrid', 'sourceGrid', false);
                        }
                    }
                }]
            }, {
                itemId: 'targetGrid',
                name: 'targetGrid',
                flex: 1,
                xtype: 'grid',
                multiSelect: true,
                viewConfig: {
                    plugins: {
                        ptype: 'gridviewdragdrop',
                        containerScroll: true
                    },
                    listeners: {
                        drop: function(node, data, dropRec, dropPosition) {
                            me.filterUpdate();
                        }
                    }
                },
                store: new Ext.data.Store({
                    model: 'Lada.model.Column',
                }),
                columns: col_columns,
                stripeRows: true,
                title: i18n.getMsg('query.usecols')
            }];
            this.callParent();
    },

    /**
     * Helper function for the "move selection/all" buttons.
     */
    moveData: function(source, target, selectiononly){
        var data = [];
        if (selectiononly === true){
            data = this.getComponent(source).getSelectionModel().getSelection();
        } else {
            data = this.getComponent(source).getStore().getRange();
        }
        for (var i=0; i < data.length; i++ ){
            this.getComponent(target).getStore().add(data[i]);
            this.getComponent(source).getStore().remove(data[i]);
        }
        this.filterUpdate();
    },

    /**
     * Resets the columns according to the submitted query
     */
    setQuery: function(newquery){
        var baseCols = newquery.get('basequery').data.fields;
        var baseQstore = Ext.create(
            'Ext.data.Store',{
                model: 'Lada.model.Column'
        });
        for (var i=0; i < baseCols.length; i++){
            var entry = Ext.create('Lada.model.Column',{
                dataIndex: baseCols[i].dataIndex,
                dataType:  baseCols[i].dataType
            });
            baseQstore.add(entry);
        }
        this.getComponent('sourceGrid').setStore(baseQstore);
        var selCols = newquery.get('columns');
        this.selectedStore.removeAll();
        for (var i=0; i < selCols.length; i++){
            var baseentry = baseQstore.findRecord('dataIndex',
                    selCols[i].dataIndex);
            var entry = Ext.create('Lada.model.Column',{
                dataIndex: selCols[i].dataIndex,
                sort: selCols[i].sort,
                filter: selCols[i].filter,
                filteractive: selCols[i].filteractive,
                dataType:  baseentry.get('dataType')
            });
            baseQstore.remove(baseentry);
            this.selectedStore.add(entry);
        }
        this.getComponent('targetGrid').setStore(this.selectedStore);
    },

    filterUpdate: function(){
        var currentcolstore  = this.getComponent('targetGrid').getStore();
        this.up('querypanel').currentColumns = currentcolstore;
        this.up('querypanel').down('cbox[name=activefilters]').setStore(currentcolstore);
        var ctl = Lada.app.getController('Lada.controller.Query');
        ctl.setSortandFilterActive(this);
        ctl.showFilter(this);
    },
});
