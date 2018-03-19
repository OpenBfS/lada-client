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
    extend: 'Ext.form.Panel',
    alias: 'widget.querypanel',
    model: 'Lada.model.DummyQuery',
    require: [
        'Lada.view.widget.ColumnChoser',
        'Lada.view.widget.ColumnSort'],
    layout: {
        type: 'vbox',
        align: 'stretch',
        defaults: {
            margin: '10,0,10,5'
        }
    },
    header: false,
    items: [{
        xtype: 'container',
        layout: {
            type:'hbox',
            align: 'stretchmax'
        },
        margin: '10,5,10,5',
        items: [{
            xtype: 'combobox',
                title: 'query.query',
                name: 'selectedQuery',
                displayField: 'name',
                valueField: 'id',
                flex: 1,
                margin: '0,10,0,0',
            }, {
                xtype: 'checkbox',
                name: 'allqueries',
                boxLabel: 'query.showall',
                checked: false
        }]
    }, {
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'stretchmax'
        },
        margin: '5,15,5,15',
        defaults: {
            xtype: 'button',
            margin: '5,5,5,5'
        },
        items: [{
            action: 'newquery',
            text: 'query.new',
            flex: 1
        },{
            action: 'editquery',
            text: 'query.edit',
            flex: 1
        },{
            action: 'delquery',
            text: 'query.delete',
            flex: 1,
            disabled: true
        }]
    }, {
        xtype : 'fieldset',
        name: 'querydetails',
        title: 'query.details',
        collapsible : true,
        collapsed: true,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        width: '100%',
        items: [{
            xtype: 'textfield', //TODO tfield or textfield?
            name: 'name',
            fieldLabel: 'query.name',
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
            name: 'groups',
            multiselect: true,
            fieldLabel: 'query.groups'
        }, {
            xtype: 'columnchoser'
            // allcolumns: baseQuery.columns
            //selectedColumns: Model.columns
        },{
            xtype: 'columnsort'
            //selectedColumns: Model.columns
            //selectedColumns: Model.columns
        }, {
            xtype: 'cbox',
            name: 'activefilters',
            multiselect: true,
            fieldLabel: 'query.filters.visible'
        }]
    }, {
        xtype: 'fieldset',
        name: 'filtervariables',
        margin: '10, 0, 20, 0',
        minHeight: 20,
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
            text: 'query.save'
        }, {
            xtype: 'button',
            action: 'reset',
            margin: '5,0,5,0',
            flex: 1,
            text: 'query.reset'
        }]
    }, {
        xtype: 'button',
        action: 'search',
            text: 'query.search',
            margin: '5,0,5,0',
            flex: 1
    }],

    initComponent: function() {

//dummy data
        var baseQuery = Ext.create('Lada.model.DummyBaseQuery', {
            id: 1,
            name: 'basequery in database',
            fields: [{
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
            id: 1,
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
            id: 2,
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
        var me = this;

        this.callParent(arguments);

        this.down('button[action=search]').text = i18n.getMsg('query.search');
        this.down('button[action=save]').text = i18n.getMsg('query.save');
        this.down('button[action=reset]').text =i18n.getMsg('query.reset');
        this.down('checkbox[name=allqueries]').boxLabel = i18n.getMsg('query.showall');
        this.down('fieldset[name=querydetails]').setTitle(i18n.getMsg('query.details'));
        this.down('button[action=newquery]').text = i18n.getMsg('query.new');
        this.down('button[action=editquery]').text= i18n.getMsg('query.edit');
        this.down('button[action=delquery]').text = i18n.getMsg('query.delete');
        this.down('textfield[name=name]').fieldLabel = i18n.getMsg('query.name');
        //TODO these two are ugly hacks:
        this.down('cbox[name=groups]').down().fieldLabel = i18n.getMsg('query.groups');
        this.down('cbox[name=activefilters]').down().fieldLabel = i18n.getMsg('query.filters.visible');
        this.down('combobox[name=selectedQuery]').store = Ext.create(
            'Ext.data.Store',{
                model: 'Lada.model.DummyBaseQuery'
        });
        var selquery = this.down('combobox[name=selectedQuery]');
        selquery.title = i18n.getMsg('query.query');
        selquery.getStore().add([query0, query1]);
        selquery.getStore().filter('owner', 'Testlabor_4');//hardcoded dummy data
        this.down('button[action=delquery]').setDisabled(false);

        this.down('combobox[name=selectedQuery]').select(query0);
        this.loadRecord(query0);
        this.down('columnchoser').setQuery(query0);

    }
});
