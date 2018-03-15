/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Panel to show and manipulate queries and their filters
 */
Ext.define('Lada.view.QueryPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.querypanel',
    require: ['Lada.view.widget.ColumnChoser'],
    currentquery: null,
    record: null,
    layout: {
        type: 'vbox',
    },
    initComponent: function() {
//dummy data
        var baseQuery = Ext.create('Lada.model.DummyBaseQuery', {
            id: 1,
            name: 'basequery in database',
            fields: [{
                id: 1,
                dataIndex: 'MessstelleLabor',
                dataType: {name: 'string'}
            },{
                dataIndex: 'Netzbetreiber',
                dataType: {name: 'string'}
            },{
                dataIndex: 'Datenbasis',
                dataType: {name: 'string'}
            },{
                dataIndex: 'Probenart',
                dataType: {name: 'string'}
            },{
                dataIndex: 'Probenehmer',
                dataType: {name: 'string'}
            },{
                dataIndex: 'Messregime',
                dataType: {name: 'string'}
            },{
                dataIndex: 'MST-ID',
                dataType: {name: 'mstId'}
            },{
                dataIndex: 'Datum',
                dataType: {name: 'date'}
            }]
        });

        var query0 = Ext.create('Lada.model.DummyQuery',{
            basequery: baseQuery,
            name : 'Beispiel 1',
            owner: 'Testlabor_4',
            groups: ['imis_world', 'Testlabor_4'],
            columns: [{
                dataIndex: 'MessstelleLabor',
                sort: 'asc',
                filter:'06010'
            }, {
                dataIndex: 'Probenart',
                sort: 'desc'
            }, {
                dataIndex:'Datum',
                sort: 'desc'
            }, {
                dataIndex:'Probenehmer',
                sort: 'none'
            }]
        });
        var query1 = Ext.create('Lada.model.DummyQuery',{
            basequery: baseQuery,
            name: 'Beispiel 2, fremder Eintrag',
            owner: 'imis_world',
            groups: ['imis_world', 'Testlabor_1'],
            columns: [{
                dataIndex: 'MessstelleLabor',
                sort: 'asc'
            },{
                dataIndex: 'Probenart',
                sort: 'asc'
            },{
                dataIndex:'MST-ID',
                sort: 'asc'
            }, {
                dataIndex:'Messregime',
                sort: 'none'
            }]
        });
// end of dummy data

        var i18n = Lada.getApplication().bundle;
        this.title =  i18n.getMsg('query.title');
        this.layout = {
            type: 'vbox',
            align: 'stretch',
            defaults: {
                margin: '10,0,10,5'
            }
        };
        var me = this;
        this.items = [{
            xtype: 'container',
            layout: {
                type:'hbox',
                align: 'stretchmax'
            },
            items: [{
                xtype: 'combobox',
                title: i18n.getMsg('query.query'),
                name: 'selectedQuery',
                displayField: 'name',
                valueField: 'id',
                flex: 2,
                store: Ext.create('Ext.data.Store',{
                    model: 'Lada.model.DummyBaseQuery',
                    data: baseQuery
                })
            }, {
                xtype: 'checkbox',
                name: 'allqueries',
                flex: 1,
                boxLabel: i18n.getMsg('query.showall'),
                checked: false
            }]
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretchmax'
            },
            defaults: {
                xtype: 'button',
                margin: '5,5,5,5'
            },
            items: [{
                action: 'newquery',
                text: i18n.getMsg('query.new'),
                stretch: 1
            },{
                action: 'editquery',
                text: i18n.getMsg('query.edit'),
                stretch: 1
            },{
                action: 'delquery',
                text: i18n.getMsg('query.delete'),
                stretch: 1,
                disabled: true
            }]
        }, {
            xtype : 'fieldset',
            name: 'querydetails',
            store: 'dummyStore',
            model: 'Lada.model.DummyQuery',
            collapsible : true,
            collapsed: true,
            layout: {
                type: 'vbox',
                align: 'stretchmax'
            },
            title: i18n.getMsg('query.details'),
            items: [{
                xtype: 'textfield', //TODO tfield or textfield?
                name: 'name',
                fieldLabel: i18n.getMsg('query.name'),
                value: 'Lorem Ipsum',
                flex: 1,
                triggers: {
                    clear: {
                        extraCls: 'x-form-clear-trigger',
                        handler: function() {
                            this.clearValue(); //not a function in textfield
                        }
                    }
                }
            }, {
                xtype: 'cbox',
                multiselect: true,
                fieldLabel: i18n.getMsg('query.groups')
            }, {
                xtype: 'columnchoser'
            }, {
                xtype: 'cbox',
                name: 'activefilters',
                multiselect: true,
                fieldLabel: i18n.getMsg('query.filters.visible')
            }]
        }, {
            xtype: 'fieldset',
            // border: false,
            name: 'filtervariables',
            hidden: true,
            margin: '10, 0, 10, 0',
            items: [{
                xtype: 'panel',
                border: false,
                name: 'filtervalues',
                items: []
            }]
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretchmax'
            },
            items: [{
                xtype: 'button',
                action: 'save',
                flex: 1,
                margin: '5,0,5,0',
                text: i18n.getMsg('query.save')
            }, {
                xtype: 'button',
                action: 'reset',
                margin: '5,0,5,0',
                flex: 1,
                text: i18n.getMsg('query.reset')
            }]
        }, {
            xtype: 'button',
            action: 'search',
            text: i18n.getMsg('query.search'),
            margin: '5,0,5,0',
            flex: 1
        }];
        this.callParent(arguments);
        this.down('combobox[name=selectedQuery]').getStore().add([query0, query1]);
        this.down('combobox[name=selectedQuery]').select(query0);
    }
});
