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
    margin: '5,0,0,5',
    initComponent: function(){
        var i18n = Lada.getApplication().bundle;
        var group1 = this.id + 'group1',
        group2 = this.id + 'group2',
        col_columns = [{
            text: '',
            sortable: true,
            dataIndex: 'dataIndex'
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
                    containerScroll: true,
                    dragGroup: group1,
                    dropGroup: group2
                },
                listeners: {
                    drop: function(node, data, dropRec, dropPosition) {
                    var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
                    Ext.example.msg('Drag from right to left', 'Dropped ' + data.records[0].get('name') + dropOn);
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
                    listener: {
                        click: {
                        //get sourceGrid.selection
                        //me.moveData(sourceGrid, targetGrid)
                        }
                    }
                }, {
                    action: 'moveRR',
                    text: '>>',
                    listener: {
                        click: {
                        //get sourceGrid.all
                        //me.moveData(sourceGrid, targetGrid)
                        }
                    }
                },{
                    action: 'moveL',
                    text: '<',
                    listener: {
                        click: {
                        //get targetGrid.selected
                        //me.moveData(targetGrid, sourceGrid)
                        }
                    }
                }, {
                    action: 'moveLL',
                    text: '<<',
                    listener: {
                        click: {
                        //get targetGrid.all
                        //me.moveData(targetGrid, sourceGrid)
                        }
                    }
                }]
            }, {
                itemId: 'targetGrid',
                flex: 1,
                xtype: 'grid',
                viewConfig: {
                    plugins: {
                        ptype: 'gridviewdragdrop',
                        containerScroll: true,
                        dragGroup: group2,
                        dropGroup: group1
                    },
                    listeners: {
                        drop: function(node, data, dropRec, dropPosition) {
                            var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
                            Ext.example.msg('Drag from left to right', 'Dropped ' + data.records[0].get('name') + dropOn);
                        },
                        datachange: {
                            // sortgrid.update
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

            //this.on: button R
            //this.on: button L
            //this.on: button LL
            //this.on: storeLoad: targetgrid, sourcegrid aktualisieren
            // this.on: targetGrid change: sortGrid aktualisieren

    },

    moveData: function(data, source, target){
        source.getStore().remove(data);
        //  this.down('#grid2').
        target.getStore().add(data);
    },

    setStore: function(store){
    // if available columns change: reset everything?
    // or only reset (with animation) the new/missing ones?
    },
    search: function (button){
        // send: baseQuery;
        // send: verwendeteSpalten
        // send verwendeteSpalten.Filter
        // send verwendeteSpalten.sort
    }
});
