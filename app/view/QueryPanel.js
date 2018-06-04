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
    model: 'Lada.model.Query',
    requires: [
        'Lada.view.widget.ColumnChoser',
        'Lada.view.widget.ColumnSort',
        'Lada.store.GridColumn'
    ],
    gridColumnStore: null,
    store: null,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    margin: '5,5,5,5',
    header: false,
    items: [{
        xtype: 'container',
        layout: {
            type: 'vbox'
        },
        margin: 10,
        items: [
            {
                xtype: 'combobox',
                margin: 5,
                fieldLabel: 'query.query',
                name: 'selectedQuery',
                displayField: 'name',
                valueField: 'id',
                labelWidth: 125,
                width: '100%',
                submitValue: false,
                triggers: {
                    clear: { hidden: true}
                }
            }, {
                xtype: 'checkbox',
                margin: '5 5 5 135',
                name: 'ownqueries',
                submitValue: false,
                boxLabel: 'query.showown',
                checked: true,
                flex: 1
            }]
    }, {
        xtype: 'container',
        margin: '10,10',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            xtype: 'button',
            margin: '5,10,5,10'
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
            text: 'delete',
            flex: 1,
            disabled: true
        }]
    }, {
        xtype: 'button',
        action: 'search',
        icon: 'resources/img/Find.png',
        text: 'query.search',
        margin: '15,0,15,0',
        flex: 1
    }, {
        xtype: 'fieldset',
        name: 'querydetails',
        title: 'query.details',
        margin: 15,
        border: {
            style: 'dotted',
            width: 1
        },
        collapsible: true,
        collapsed: true,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'textfield',
            name: 'name',
            fieldLabel: 'query.name',
            labelWidth: 125,
            flex: 1,
            triggers: {
                clear: {
                    extraCls: 'x-form-clear-trigger',
                    handler: function() {
                        this.setValue('');
                    }
                }
            }
        }, {
            xtype: 'cbox',
            name: 'messStellesIds',
            multiSelect: true,
            labelWidth: 125,
            fieldLabel: 'query.groups',
            store: Ext.create('Ext.data.Store',{
                model: 'Lada.model.QueryGroup'
            }),
            valueField: 'messStellesIds',
            displayField: 'messStellesIds',
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
                '{messStellesIds}</div></tpl>'),
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">{messStellesIds}</tpl>')
        },{
            xtype: 'textarea',
            name: 'description',
            fieldLabel: 'query.comment',
            labelWidth: 125
        }, {
            xtype: 'columnchoser'
        },{
            xtype: 'columnsort'
        }, {
            xtype: 'cbox',
            name: 'activefilters',
            labelWidth: 125,
            store: Ext.create('Ext.data.Store',{
                model: 'Lada.model.Column'
            }),
            multiSelect: true,
            valueField: 'dataIndex',
            displayField: 'name',
            fieldLabel: 'query.filters.visible',
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
                '{name}</div></tpl>'),
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">{name}</tpl>')

        }]
    }, {
        xtype: 'fieldset',
        name: 'filtervariables',
        margin: 10,
        minHeight: 20,
        title: 'Filter',
        layout: {
            type: 'hbox',
            align: 'stretchmax'
        },

        items: [{
            xtype: 'panel',
            border: false,
            layout: 'vbox',
            name: 'filtervalues',
            items: [],
            flex: 1
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
            text: 'save'
        }, {
            xtype: 'button',
            action: 'reset',
            margin: '5,0,5,0',
            flex: 1,
            text: 'reset'
        }]
    },{
        xtype: 'button',
        name: 'search2',
        action: 'search',
        icon: 'resources/img/Find.png',
        text: 'query.search',
        margin: '5,0,5,0',
        flex: 1
    }],

    initComponent: function() {

        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('query.title');
        this.callParent(arguments);

        this.down('button[action=search]').text = i18n.getMsg('query.search');
        this.down('button[name=search2]').text = i18n.getMsg('query.search');
        this.down('button[action=save]').text = i18n.getMsg('save');
        this.down('button[action=reset]').text =i18n.getMsg('reset');
        this.down('checkbox[name=ownqueries]').boxLabel = i18n.getMsg('query.showown');
        this.down('fieldset[name=querydetails]').setTitle(i18n.getMsg('query.details'));
        this.down('button[action=newquery]').text = i18n.getMsg('query.new');
        this.down('button[action=editquery]').text= i18n.getMsg('query.edit');
        this.down('button[action=delquery]').text = i18n.getMsg('delete');
        this.down('textfield[name=name]').fieldLabel = i18n.getMsg('query.name');
        this.down('textarea[name=description]').fieldLabel = i18n.getMsg('query.comment');
        //TODO these two are ugly hacks:
        this.down('cbox[name=messStellesIds]').down().fieldLabel = i18n.getMsg('query.groups');
        this.down('cbox[name=activefilters]').down().fieldLabel = i18n.getMsg('query.filters.visible');

        var selquery = this.down('combobox[name=selectedQuery]');
        selquery.fieldLabel = i18n.getMsg('query.query');

        this.store = Ext.data.StoreManager.get('querystore');

        this.store.load({
            scope: this,
            callback: function() {
                this.store.clearFilter();
                this.store.filter({
                    property: 'userId',
                    value: Lada.userId,
                    exactMatch: true
                });
                selquery.setStore(this.store);
                var record0 = this.store.getAt(0);
                if (!record0) {
                    this.down('checkbox[name=ownqueries]').setValue(false);
                    this.down('button[action=delquery]').setDisabled(true);
                    this.store.clearFilter();
                    record0 = this.store.getAt(0);
                    selquery.select(record0);
                } else {
                    this.down('button[action=delquery]').setDisabled(false);
                }
                selquery.select(record0);
                this.getForm().loadRecord(record0);
                this.setGridColumnStore(record0);
            }
        });
    },

    setGridColumnStore: function(query) {
        var me = this;
        if (query) {
            this.gridColumnStore = Ext.create('Lada.store.GridColumn');
            this.gridColumnStore.proxy.extraParams = {
                qid: query.get('id')};
            var cs = Ext.data.StoreManager.get('columnstore');
            cs.clearFilter();
            cs.filter({
                property: 'baseQuery',
                value: query.get('baseQuery'),
                exactMatch: true
            });
            this.gridColumnStore.load({
                callback: function() {
                    var items = me.gridColumnStore.getData().items;
                    for (var i=0; i < items.length; i++) {
                        var gc = cs.findRecord('id',
                            items[i].get('gridColumnId'),false,false, false, true);
                        items[i].set('dataIndex', gc.get('dataIndex'));
                        items[i].set('name', gc.get('name'));
                    }
                    me.down('columnchoser').setStore(me.gridColumnStore, cs);
                    me.down('columnsort').setStore(me.gridColumnStore);
                    me.down('cbox[name=activefilters]').setStore(cs);
                }
            });
        }
    }
});
