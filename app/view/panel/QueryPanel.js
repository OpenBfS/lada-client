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
Ext.define('Lada.view.panel.QueryPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.querypanel',
    id: 'querypanelid',
    requires: [
        'Lada.view.widget.ColumnChoser',
        'Lada.view.widget.ColumnSort',
        'Lada.store.GridColumnValue',
        'Lada.store.Query'
    ],
    gridColumnStore: null,
    gridColumnValueStore: null,

    trackResetOnLoad: true,

    scrollable: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    margin: '5,5,5,5',
    header: false,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('query.title');
        this.items = [{
            xtype: 'container',
            layout: {
                type: 'vbox'
            },
            margin: 10,
            items: [
                {
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    width: '100%',
                    border: false,
                    margin: 0,
                    items: [{
                        xtype: 'combobox',
                        shadow: false,
                        margin: 5,
                        fieldLabel: i18n.getMsg('query.query'),
                        name: 'selectedQuery',
                        isFormField: false,
                        store: Ext.create('Lada.store.Query'),
                        displayField: 'name',
                        queryMode: 'local',
                        valueField: 'id',
                        tpl: Ext.create(
                            'Ext.XTemplate',
                            '<tpl for=".">' +
                            '<div class=' +
                            '"x-combo-list-item x-boundlist-item"' +
                            '>{name}</div></tpl>'),
                        displayTpl: Ext.create(
                            'Ext.XTemplate',
                            '<tpl for=".">{name}</tpl>'),
                        flex: 1,
                        matchFieldWidth: false,
                        labelWidth: 90,
                        submitValue: false
                    }, {
                        xtype: 'button',
                        name: 'queryreload',
                        action: 'reload',
                        maxWidth: 100,
                        minWidth: 100,
                        text: i18n.getMsg('query.button.reload'),
                        margin: '5 5 0 3',
                        submitValue: false
                    }]
                }, {
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    width: '100%',
                    margin: '10 0 10 15',
                    border: false,
                    items: [{
                        xtype: 'checkbox',
                        name: 'filterQueriesGlobal',
                        isFormField: false,
                        submitValue: false,
                        boxLabel: i18n.getMsg('query.showglobal'),
                        flex: 0.3
                    }, {
                        xtype: 'checkbox',
                        name: 'filterQueriesAvail',
                        isFormField: false,
                        submitValue: false,
                        boxLabel: i18n.getMsg('query.showavailable'),
                        flex: 0.3
                    }, {
                        xtype: 'checkbox',
                        name: 'filterQueriesOwn',
                        isFormField: false,
                        submitValue: false,
                        boxLabel: i18n.getMsg('query.showown'),
                        checked: true,
                        flex: 0.3
                    }]
                }, {
                    xtype: 'textarea',
                    name: 'description',
                    width: '100%',
                    allowBlank: false,
                    fieldLabel: i18n.getMsg('query.comment'),
                    labelWidth: 90,
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
                text: i18n.getMsg('query.new'),
                flex: 1
            }, {
                action: 'delquery',
                text: i18n.getMsg('delete'),
                flex: 1,
                disabled: false
            }]
        }, {
            xtype: 'fieldset',
            name: 'querydetails',
            title: i18n.getMsg('query.details'),
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
                fieldLabel: i18n.getMsg('query.name'),
                maxLength: 80,
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
                fieldLabel: i18n.getMsg('query.groups'),
                queryMode: 'local',
                store: Ext.create('Ext.data.Store', {
                    fields: [{
                        name: 'messStellesIds'
                    }, {
                        name: 'mst_name', persist: false
                    }],
                    sorters: [{
                        property: 'messStellesIds',
                        direction: 'ASC'
                    }]
                }),
                valueField: 'messStellesIds',
                displayField: 'messStellesIds',
                searchValueField: 'mst_name',
                tpl: Ext.create(
                    'Ext.XTemplate',
                    '<tpl for=".">' +
                    '<div class="x-combo-list-item  x-boundlist-item" >' +
                    '{messStellesIds} - {mst_name}</div></tpl>'),
                displayTpl: Ext.create(
                    'Ext.XTemplate',
                    '<tpl for=".">{messStellesIds} - {mst_name}</tpl>')
            }, {
                xtype: 'columnchoser'
            }, {
                xtype: 'columnsort'
            }, {
                xtype: 'cbox',
                name: 'activefilters',
                labelWidth: 125,
                multiSelect: true,
                queryMode: 'local',
                isFormField: false,
                // Needs to be different from Ext.getStore('columnstore')
                // because of extra filters:
                store: Ext.create('Ext.data.Store', {
                    model: 'Lada.model.GridColumn',
                    autoLoad: true}),
                valueField: 'dataIndex',
                displayField: 'name',
                fieldLabel: i18n.getMsg('title.filter'),
                tpl: Ext.create(
                    'Ext.XTemplate',
                    '<tpl for=".">' +
                    '<div class="x-combo-list-item  x-boundlist-item" >' +
                    '{name}</div></tpl>'),
                displayTpl: Ext.create(
                    'Ext.XTemplate',
                    '<tpl for=".">{name}</tpl>'),
                persist: false

            }, {
                xtype: 'button',
                action: 'showsql',
                margin: '5,0,5,0',
                flex: 1,
                text: i18n.getMsg('button.showsql'),
                disabled: true
            }]
        }, {
            xtype: 'fieldset',
            name: 'filtervariables',
            title: i18n.getMsg('query.filters.visible'),
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
                text: i18n.getMsg('save'),
                disabled: true
            }, {
                xtype: 'button',
                action: 'reset',
                margin: '5,0,5,0',
                flex: 1,
                text: i18n.getMsg('reset')
            }]
        }];

        this.gridColumnValueStore = Ext.create('Lada.store.GridColumnValue');
        this.callParent(arguments);
        this.down('button[action=search]').text = i18n.getMsg('query.search');

        var activefilterFilter = function(tagfield) {
            tagfield.getStore().filter(function(item) {
                if (item.get('filter')) {
                    return true;
                }
                return false;
            });
        };
        var filtertags = this.down('cbox[name=activefilters]').down('tagfield');
        filtertags.on('focus', activefilterFilter);
        filtertags.on('select', activefilterFilter);
        filtertags.triggers.clear.handler = function() {
            filtertags.clearValue();
            activefilterFilter(filtertags);
        };

        // Load query store
        var selquery = this.down('combobox[name=selectedQuery]');
        var me = this;
        selquery.getStore().load({
            callback: function(records, operation, success) {
                if (!success) {
                    Ext.Msg.alert(
                        i18n.getMsg('query.error.load.title'),
                        i18n.getMsg('query.error.load.message'));
                }

                // Select first query that belongs to the user
                var hasUserQuery = true;
                var record0 = this.findRecord('userId', Lada.userId);
                if (!record0) {
                    hasUserQuery = false;
                    record0 = this.getAt(0);
                    me.down('button[action=delquery]').setDisabled(true);
                }
                selquery.select(record0);

                // Trigger filtering the store and loading columns
                me.down('checkbox[name=filterQueriesGlobal]').setValue(
                    !hasUserQuery);
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
                    groupstore.add({
                        messStellesIds: records[i].get('id'),
                        mst_name: records[i].get('messStelle')
                    });
                }
            }
        });
    },

    loadGridColumnStore: function() {
        this.gridColumnStore = Ext.getStore('columnstore');
        var record = this.getForm().getRecord();
        if (record === undefined || record.get('clonedFrom') === 'empty') {
            var ccstore = this.down('columnchoser').store;
            if (ccstore) {
                ccstore.removeAll();
                this.down('columnchoser').setStore(ccstore);
            }

            this.down('columnsort').setStore(null);
            this.down('cbox[name=activefilters]').store.filter(function() {
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

            // Server-side filters
            this.gridColumnStore.proxy.extraParams = {
                'qid': record.get('baseQuery')
            };
            this.gridColumnValueStore.proxy.extraParams = {
                'qid': qid
            };

            // Actually load stores for gridColumns and gridColumnValues
            this.gridColumnStore.load({
                scope: this,
                callback: this.loadGridColumnValueStore
            });
        }
    },

    loadGridColumnValueStore: function(
        gridColumns,
        operation,
        gridColumnSuccess
    ) {
        var i18n = Lada.getApplication().bundle;
        if (!gridColumnSuccess) {
            Ext.Msg.alert(
                i18n.getMsg('query.error.load.title'),
                i18n.getMsg('query.error.load.message'));
            return;
        }
        var me = this;
        this.gridColumnValueStore.load({
            callback: function(
                items,
                op,
                gridColumnValueSuccess
            ) {
                if (!gridColumnValueSuccess) {
                    Ext.Msg.alert(
                        i18n.getMsg('query.error.load.title'),
                        i18n.getMsg('query.error.load.message'));
                    return;
                }
                var activeFilters = [];
                if (items.length) {
                    for (var i = 0; i < items.length; i++) {
                        var gridColumn = me.gridColumnStore.findRecord(
                            'id',
                            items[i].get('gridColumnId'),
                            0,
                            false,
                            false,
                            true);
                        if (gridColumn) {
                            items[i].set(
                                'dataIndex', gridColumn.get('dataIndex'));
                            items[i].set('name', gridColumn.get('name'));
                            if (items[i].get('filterActive')) {
                                activeFilters.push(gridColumn.get('dataIndex'));
                            }
                        }
                    }
                }
                me.down('columnchoser').setStore(
                    me.gridColumnValueStore,
                    me.gridColumnStore);
                me.down('columnsort').setStore(
                    me.gridColumnValueStore);

                var record = me.getForm().getRecord();
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

                me.down('cbox[name=messStellesIds]').setValue(
                    record.get('messStellesIds'));

                me.down('button[action=save]').setDisabled(
                    me.isQueryReadonly());

                if (record.get('clonedFrom') !== 'empty' || !record.phantom) {
                    me.down('button[name=search]').setDisabled(false);
                    me.down('button[action=showsql]').setDisabled(false);
                }
            }
        });
    },

    // Checks if a query is editable by the current user
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
