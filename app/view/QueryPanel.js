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
    id: 'querypanelid',
    model: 'Lada.model.Query',
    requires: [
        'Lada.view.widget.ColumnChoser',
        'Lada.view.widget.ColumnSort',
        'Lada.store.GridColumnValue'
    ],
    gridColumnValueStore: Ext.create('Lada.store.GridColumnValue'),
    store: null,
    scrollable: true,
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
                layout: 'hbox',
                width: '100%',
                align: 'stretch',
                border: false,
                margin: 0,
                items: [{
                    xtype: 'combobox',
                    margin: 5,
                    fieldLabel: 'query.query',
                    name: 'selectedQuery',
                    displayField: 'name',
                    queryMode: 'local',
                    valueField: 'id',
                    tpl: Ext.create('Ext.XTemplate',
                        '<tpl for="."><div class="x-combo-list-item x-boundlist-item" >' +
                        '{name}</div></tpl>'),
                    displayTpl: Ext.create('Ext.XTemplate', '<tpl for=".">{name}</tpl>'),
                    flex: 1,
                    labelWidth: 125,
                    submitValue: false,
                    triggers: {
                        clear: { hidden: true}
                    }
                },{
                    xtype: 'button',
                    name: 'queryreload',
                    action: 'reload',
                    maxWidth: 100,
                    minWidth: 100,
                    text: 'query.button.reload',
                    margin: '5 5 0 3',
                    submitValue: false
                }]
            }, {
                xtype: 'checkbox',
                margin: '0 5 0 160',
                name: 'filterQueriesGlobal',
                submitValue: false,
                boxLabel: 'query.showglobal',
                flex: 1
            }, {
                xtype: 'checkbox',
                margin: '0 5 0 160',
                name: 'filterQueriesAvail',
                submitValue: false,
                boxLabel: 'query.showavail',
                flex: 1
            }, {
                xtype: 'checkbox',
                margin: '0 5 0 160',
                name: 'filterQueriesOwn',
                submitValue: false,
                boxLabel: 'query.showown',
                checked: true,
                flex: 1
            }, {
                xtype: 'textarea',
                name: 'description',
                width: '100%',
                fieldLabel: 'query.comment',
                labelWidth: 125,
                margin: '15 5 5 5'
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
            action: 'delquery',
            text: 'delete',
            flex: 1,
            disabled: true
        }]
    },  {
        xtype: 'fieldset',
        name: 'querydetails',
        title: 'query.details',
        style: {'border': '2px solid grey;'},
        margin: 15,
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
            queryMode: 'local',
            store: Ext.create('Ext.data.Store',{
                model: 'Lada.model.QueryGroup'
            }),
            valueField: 'messStellesIds',
            displayField: 'messStellesIds',
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
                '{messStellesIds} - {mst_name}</div></tpl>'),
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">{messStellesIds} - {mst_name}</tpl>')
        }, {
            xtype: 'columnchoser'
        }, {
            xtype: 'columnsort'
        }, {
            xtype: 'cbox',
            name: 'activefilters',
            labelWidth: 125,
            store: Ext.create('Ext.data.Store',{
                model: 'Lada.model.GridColumn',
                autoLoad: true
            }),
            multiSelect: true,
            queryMode: 'local',
            valueField: 'dataIndex',
            displayField: 'name',
            fieldLabel: 'query.filters.visible',
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
                '{name}</div></tpl>'),
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">{name}</tpl>'),
            persist: false

        }]
    }, {
        xtype: 'fieldset',
        name: 'filtervariables',
        style: {'border': '2px solid grey;'},
        margin: '10 15 10 15',
        minHeight: 20,
        layout: {
            type: 'hbox',
            align: 'stretchmax'
        },

        items: [{
            xtype: 'panel',
            margin: '5',
            border: false,
            layout: 'vbox',
            name: 'filtervalues',
            items: [],
            flex: 1,
            padding: '5, 0, 5, 0',
            defaults: {
                margin: '5, 0, 5, 0'
            }
        }]
    }, {
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'stretchmax'
        },
        margin: '5 10 0 10',
        items: [{
            xtype: 'button',
            action: 'save',
            flex: 1,
            margin: '5,0,5,0',
            text: 'save',
            disabled: true
        }, {
            xtype: 'button',
            action: 'reset',
            margin: '5,0,5,0',
            flex: 1,
            text: 'reset'
        }]
    }],

    initComponent: function() {

        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('query.title');
        this.callParent(arguments);
        this.down('fieldset[name=filtervariables]').title = i18n.getMsg(
            'title.filter');
        this.down('button[action=search]').text = i18n.getMsg('query.search');
        this.down('button[action=save]').text = i18n.getMsg('save');
        this.down('button[action=reset]').text =i18n.getMsg('reset');
        this.down('checkbox[name=filterQueriesAvail]').boxLabel = i18n.getMsg('query.showavailable');
        this.down('checkbox[name=filterQueriesOwn]').boxLabel = i18n.getMsg('query.showown');
        this.down('checkbox[name=filterQueriesGlobal]').boxLabel = i18n.getMsg('query.showglobal');
        this.down('fieldset[name=querydetails]').setTitle(i18n.getMsg('query.details'));
        this.down('button[action=newquery]').text = i18n.getMsg('query.new');
        this.down('button[action=delquery]').text = i18n.getMsg('delete');
        this.down('textfield[name=name]').fieldLabel = i18n.getMsg('query.name');
        this.down('textarea[name=description]').fieldLabel = i18n.getMsg('query.comment');
        //TODO these two are ugly hacks:
        this.down('cbox[name=messStellesIds]').down().fieldLabel = i18n.getMsg('query.groups');
        this.down('cbox[name=activefilters]').down().fieldLabel = i18n.getMsg('query.filters.visible');
        this.down('button[name=queryreload]').text = i18n.getMsg('query.button.reload');

        var selquery = this.down('combobox[name=selectedQuery]');
        selquery.fieldLabel = i18n.getMsg('query.query');

        var activefilterFilter = function(tagfield) {
            tagfield.getStore().filter(function(item) {
                if (item.get('filter')) {
                    return true;
                }
                return false;
            });
        };
        var filtertags = this.down('cbox[name=activefilters]').down('tagfield');
        filtertags.on('focus',activefilterFilter);
        filtertags.on('select',activefilterFilter);
        filtertags.triggers.clear.handler = function() {
            filtertags.clearValue();
            activefilterFilter(filtertags);
        };
        this.store = Ext.data.StoreManager.get('querystore');

        this.store.load({
            scope: this,
            callback: function() {
                this.store.clearFilter();
                var fq = this.down('checkbox[name=filterQueriesOwn]');
                fq.fireEvent('change', fq);
                var record0 = this.store.getAt(0);
                if (!record0) {
                    this.down('button[action=delquery]').setDisabled(true);
                    var globalCB = this.down('checkbox[name=filterQueriesGlobal]');
                    globalCB.setValue(true);
                    globalCB.fireEvent('change', globalCB);
                    record0 = this.store.getAt(0);
                } else {
                    this.down('button[action=delquery]').setDisabled(false);
                }
                selquery.setStore(this.store);
                selquery.select(record0);
                selquery.fireEvent('select', selquery);
            }
        });
        //Init messstellen data
        var mst_store = Ext.data.StoreManager.get('messstellen');
        mst_store.load({
            scope: this,
            callback: function(records) {
                var qp = this;
                var groupstore = qp.down('cbox[name=messStellesIds]').down(
                    'tagfield').getStore();
                for ( var i = 0; i < records.length; i++) {
                    groupstore.add(
                        Ext.create('Lada.model.QueryGroup', {
                            messStellesIds: records[i].get('id'),
                            mst_name: records[i].get('messStelle')
                        })
                    );
                }
            }
        });
    },

    loadGridColumnStore: function() {
        var columnstore = Ext.data.StoreManager.get('columnstore');
        var record = this.getForm().getRecord();
        if (record === undefined || record.get('clonedFrom') === 'empty') {
            var ccstore = this.down('columnchoser').store;
            if (ccstore) {
                ccstore.removeAll();
                this.down('columnchoser').setStore(ccstore);
            }
            this.down('columnsort').setStore(null);
            this.down('cbox[name=activefilters]').store.filter(function(item) {
                // don't show any items, as there is no baseQuery
                return false;
            });
            this.down('cbox[name=activefilters]').setValue('');
            this.down('cbox[name=messStellesIds]').setValue('');
            this.gridColumnValueStore.removeAll();
        } else {
            var qid = null;
            if (record.phantom) {
                qid = record.get('clonedFrom');
            } else {
                qid = record.get('id');
            }
            this.gridColumnValueStore.proxy.extraParams = {
                'qid': qid
            };
            var me = this;
            this.gridColumnValueStore.load({
                callback: function() {
                    columnstore.clearFilter();
                    columnstore.filter({
                        property: 'baseQuery',
                        value: record.get('baseQuery'),
                        exactMatch: true
                    });
                    var items = me.gridColumnValueStore.getData().items;
                    var activeFilters = [];
                    if (items.length) {
                        for (var i=0; i < items.length; i++) {
                            var gridColumn = columnstore.findRecord('id',
                                items[i].get('gridColumnId'),0,false, false, true);
                            items[i].set('dataIndex', gridColumn.get('dataIndex'));
                            items[i].set('name', gridColumn.get('name'));
                            if (items[i].get('filterActive')) {
                                activeFilters.push(gridColumn.get('dataIndex'));
                            }
                        }
                    }
                    me.down('columnchoser').setStore(me.gridColumnValueStore,
                        columnstore);
                    me.down('columnsort').setStore(me.gridColumnValueStore);
                    var filterwidget = me.down('cbox[name=activefilters]');
                    filterwidget.store.clearFilter();
                    filterwidget.store.filter({
                        property: 'baseQuery',
                        value: record.get('baseQuery'),
                        exactMatch: true
                    });
                    filterwidget.store.filter(function(item) {
                        if (item.get('filter')) {
                            return true;
                        }
                        return false;
                    });
                    filterwidget.setValue(activeFilters.join(','));

                    me.down('cbox[name=messStellesIds]').setValue(record.get('messStellesIds'));

                    me.down('button[action=save]').setDisabled(me.isQueryReadonly());

                    if (record.get('clonedFrom') !== 'empty' || !record.phantom) {
                        me.down('button[name=search]').setDisabled(false);
                    }
                }
            });
        }
    },

    //checks checks if a query is editable by the current user
    isQueryReadonly: function() {
        var query = this.getForm().getRecord();
        if (query.phantom && (query.get('clonedFrom') === 'empty')) {
            return true;
        }
        if (Lada.userId === query.get('userId') || query.phantom) {
            return false;
        }
        return true;
    }
});
