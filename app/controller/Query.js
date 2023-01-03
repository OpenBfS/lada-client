/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.controller.Query', {
    extend: 'Ext.app.Controller',
    requires: [
        'Lada.view.widget.base.DateRange',
        'Lada.store.GridColumnValue',
        'Lada.store.GenericResults',
        'Lada.store.Orte',
        'Lada.view.widget.base.DateTimeRange',
        'Lada.view.widget.Messstelle',
        'Lada.view.widget.Umwelt',
        'Lada.view.widget.Staat',
        'Lada.view.widget.base.TextField',
        'Lada.view.widget.Status',
        'Lada.view.widget.StatuskombiSelect',
        'Lada.view.widget.StatusStufe',
        'Lada.view.widget.MessprogrammLand',
        'Lada.view.widget.Verwaltungseinheit',
        'Lada.view.widget.BoolFilter',
        'Lada.view.widget.base.NumberRange',
        'Lada.view.widget.Netzbetreiber',
        'Lada.view.widget.Datenbasis',
        'Lada.view.widget.Betriebsart',
        'Lada.view.widget.TagFilter',
        'Lada.view.plugin.GridRowExpander',
        'Lada.view.widget.DynamicGrid',
        'Lada.view.window.SqlDisplay'
    ],

    resultStore: null,

    /**
     * Initialize the controller.
     */
    init: function() {
        var me = this;
        this.control({
            'querypanel checkbox[name=filterQueriesGlobal]': {
                change: me.changeListedQueries
            },
            'querypanel checkbox[name=filterQueriesAvail]': {
                change: me.changeListedQueries
            },
            'querypanel checkbox[name=filterQueriesOwn]': {
                change: me.changeListedQueries
            },
            'querypanel button[action=newquery]': {
                click: me.cloneQuery
            },
            'querypanel button[action=delquery]': {
                click: me.deleteQuery
            },
            'querypanel combobox[name=selectedQuery]': {
                // Do not use 'change' event here, because that destroys
                // user experience when typing into the combobox field
                select: me.changeCurrentQuery
            },
            'querypanel button[action=save]': {
                click: me.handleSaveClicked
            },
            'querypanel button[action=reset]': {
                click: me.reset
            },
            'querypanel button[action=showsql]': {
                click: me.showsql
            },
            'querypanel button[action=search]': {
                click: me.search
            },
            'querypanel cbox[name=activefilters] tagfield': {
                change: me.activeFiltersChanged
            },
            'querypanel panel[name=filtervalues] tagfield': {
                change: me.filterValueChanged
            },
            'querypanel panel[name=filtervalues] textfield': {
                change: me.filterValueChanged
            },
            'querypanel panel[name=filtervalues] combobox': {
                change: me.filterValueChanged
            },
            'querypanel panel[name=filtervalues] checkbox': {
                change: me.checkboxChanged
            },
            'querypanel button[action=reload]': {
                click: me.reloadQuery
            },
            'dynamicgrid': {
                columnresize: me.dataChanged,
                gridreload: me.drawGeometryColumns
            },
            'querypanel textarea[name=descr]': {
                change: me.dataChanged
            },
            'querypanel textfield[name=name]': {
                change: me.dataChanged
            },
            'querypanel combobox[name=messStellesIds]': {
                change: me.dataChanged
            },
            'querypanel columnchoser': {
                change: me.dataChanged
            },
            'querypanel columnsort': {
                change: me.dataChanged
            }

        });
    },

    createResultStore: function() {
        if (!this.resultStore) {
            this.resultStore = Ext.create('Lada.store.GenericResults');
        }
    },

    changeListedQueries: function(checkbox) {
        var qp = checkbox.up('querypanel');
        var cbGlobal = qp.down('checkbox[name=filterQueriesGlobal]').getValue();
        var cbOwn = qp.down('checkbox[name=filterQueriesOwn]').getValue();
        var cbAvail = qp.down('checkbox[name=filterQueriesAvail]').getValue();

        var queryBox = qp.down('combobox[name=selectedQuery]');
        var qStore = queryBox.getStore();
        qStore.clearFilter();
        var filterFn = function(item) {
            if (cbOwn && item.get('ladaUserId') === Lada.userId) {
                return true;
            } else if ( cbGlobal && item.get('ladaUserId') === 0) {
                return true;
            } else if (
                cbAvail &&
                item.get('ladaUserId') !== Lada.userId &&
                item.get('ladaUserId') !== 0
            ) {
                return true;
            }
            return false;
        };
        qStore.filter(filterFn);

        var newquery = qStore.findRecord('id', queryBox.getValue(), false,
            false, false, true);
        if (!newquery) {
            this.changeCurrentQuery(queryBox);
        }
    },

    cloneQuery: function(button) {
        this.showLoadingMask();

        // Create new query record
        var qp = button.up('querypanel');
        var cbox = qp.down('combobox[name=selectedQuery]');
        var cquery = cbox.getSelection();
        var name = qp.down('textfield[name=name]').getValue();
        if (name.length > 70) {
            name = name.substring(0, 60) + '... (' + Lada.username + ')';
        } else {
            name = name + '(' + Lada.username + ')';
        }
        var messStellesIds = qp.down('cbox[name=messStellesIds]').getValue();
        var newrecord = Ext.create('Lada.model.QueryUser', {
            baseQueryId: cquery.get('baseQueryId'),
            name: name,
            ladaUserId: Lada.userId,
            descr: cquery.get('descr'),
            messStellesIds: messStellesIds,
            clonedFrom: cquery.get('id')
        });
        newrecord.set('id', null);

        // Clone columns after query is saved
        var me = this;
        var saveCallback = function(savedQuery) {
            var columnValues = qp.down('columnchoser').store.getData();
            var saved = 0;
            return new Ext.Promise(function(resolve) {
                columnValues.each(function(item) {
                    var clonedModel = Ext.create('Lada.model.GridColConf', {
                        columnIndex: item.get('columnIndex'),
                        gridColumnId: item.get('gridColumnId'),
                        visible: item.get('visible'),
                        sort: item.get('sort'),
                        sortIndex: item.get('sortIndex'),
                        filterActive: item.get('filterActive'),
                        filterNegate: item.get('filterNegate'),
                        filterRegex: item.get('filterRegex'),
                        filterValue: item.get('filterValue'),
                        width: me.getVisibleColumnWidth(item)
                    });
                    clonedModel.set('id', null);
                    clonedModel.set('queryUserId', savedQuery.get('id'));
                    clonedModel.set('userId', null);
                    clonedModel.save({
                        success: function() {
                            saved++;
                            if (saved === columnValues.length) {
                                resolve();
                            }
                        },
                        failure: this.handleSaveFailure
                    });
                });
            });
        };
        this.saveQuery(newrecord, saveCallback);

        qp.down('fieldset[name=querydetails]').setCollapsed(false);
    },

    deleteQuery: function(button) {
        var qp = button.up('querypanel');
        var query = qp.getForm().getRecord();
        if (!query) {
            return;
        }
        if ( (Lada.userId === query.get('userId'))) {
            var i18n = Lada.getApplication().bundle;
            var me = this;
            Ext.MessageBox.confirm(i18n.getMsg('delete'),
                i18n.getMsg('delete.query'), function(btn) {
                    if (btn === 'yes') {
                        query.erase({
                            callback: function(rec, op, success) {
                                if (!success) {
                                    Ext.Msg.alert(
                                        i18n.getMsg('err.msg.delete.title'),
                                        i18n.getMsg('err.msg.generic.body'));
                                }
                                var combobox = qp.down(
                                    'combobox[name=selectedQuery]');
                                var queryStore = combobox.getStore();
                                queryStore.remove(rec);

                                // Trigger filtering store
                                if (queryStore.getData().count() === 0) {
                                    queryStore.clearFilter();
                                    qp.down(
                                        'checkbox[name=filterQueriesGlobal]')
                                        .setValue(true);
                                }

                                // Select a query and load columns.
                                // Note that calling select() does not fire
                                // a 'select' event!
                                combobox.select(queryStore.getAt(0));
                                me.changeCurrentQuery(combobox);

                                qp.down('fieldset[name=querydetails]')
                                    .collapse();
                            }
                        });
                    }
                }
            );
        }
    },

    changeCurrentQuery: function(combobox) {
        var qp = combobox.up('querypanel');
        qp.down('button[name=search]').setDisabled(true);
        qp.down('button[action=showsql]').setDisabled(true);
        var contentPanel = qp.up('panel[name=main]').down(
            'panel[name=contentpanel]');
        contentPanel.removeAll();

        var newquery = combobox.getStore().findRecord(
            'id',
            combobox.getValue(),
            false,
            false,
            false,
            true);
        if (!newquery) {
            combobox.clearValue();
            newquery = Ext.create('Lada.model.QueryUser', {
                baseQueryId: null,
                name: null,
                ladaUserId: null,
                descr: null,
                messStellesIds: null,
                clonedFrom: 'empty'
            });
        }
        qp.getForm().loadRecord(newquery);
        qp.loadGridColumnStore();
        qp.down('button[action=newquery]').setDisabled(newquery.phantom);
        qp.down('button[action=delquery]').setDisabled(
            qp.isQueryReadonly());
        qp.down('button[action=save]').setDisabled(true);
        Lada.view.window.PrintGrid.getInstance().parentGrid = null;
    },

    handleSaveClicked: function(button) {
        this.showLoadingMask();
        button.setDisabled(true);

        var query = button.up('querypanel').getForm().getRecord();
        var me = this;
        var saveCallback = function() {
            var columnValues = button.up('querypanel').down('columnchoser')
                .store.getData();
            var saved = 0;
            return new Ext.Promise(function(resolve) {
                columnValues.each(function(item) {
                    //Set column width
                    item.set('width', me.getVisibleColumnWidth(item));
                    // Save the column
                    item.save({
                        success: function() {
                            saved++;
                            if (saved === columnValues.length) {
                                resolve();
                            }
                        },
                        failure: this.handleSaveFailure
                    });
                });
            });
        };
        this.saveQuery(query, saveCallback);
    },

    /**
     * Saves the current query object and attached columns
     * @param button UI el inside the querypanel
     * @param callback (optional) async Function to call after successful save.
     *     If present, it will replace the saving of gridColumns
     */
    saveQuery: function(record, callback) {
        var qp = Ext.ComponentQuery.query('querypanel')[0];
        record.set(qp.getForm().getFieldValues(true));
        var me = this;
        record.save({
            success: function(rec, op) {
                callback(rec).then(function() {
                    var cbox = qp.down('combobox[name=selectedQuery]');
                    var cstore = cbox.getStore();
                    cstore.add(rec);

                    // Trigger filtering the store
                    if (op.getRequest().getAction() === 'create') {
                        cstore.clearFilter();
                        cbox.up('querypanel')
                            .down('checkbox[name=filterQueriesOwn]')
                            .setValue(true);
                    }

                    // Select new query and load columns.
                    // Note that calling select() does not fire
                    // a 'select' event!
                    cbox.select(rec);
                    me.changeCurrentQuery(cbox);

                    qp.loadingMask.hide();
                });
            },
            failure: this.handleSaveFailure
        });
    },

    reset: function(button) {
        var panel = button.up('querypanel');
        var qid = null;
        var rec = panel.getForm().getRecord();
        if (rec.phantom) {
            qid = rec.get('clonedFrom');
        } else {
            qid = rec.get('id');
        }
        if (qid !== 'empty') {
            panel.down('combobox[name=selectedQuery]').select(qid);
            panel.down('button[action=newquery]').setDisabled(false);
            panel.loadGridColumnStore();
        }
    },

    search: function(button) {
        this.createResultStore();
        var qp = button.up('querypanel');
        var gcs = qp.gridColumnValueStore;
        var rowtarget = this.setrowtarget();
        var jsonData = this.getQueryPayload(gcs, rowtarget);
        if (!jsonData) {
            //TODO warning: no data requested
            return;
        }
        var loadingMask = Ext.create('Ext.LoadMask', {
            target: qp
        });
        loadingMask.show();
        if (!jsonData.columns.length) {
            //TODO warning: no data requested
        } else {
            this.resultStore.getProxy().setPayload(jsonData);
            this.resultStore.setPageSize(Lada.pagingSize);

            var plugin = null;
            if (rowtarget.dataType === 'probeId') {
                plugin = Ext.create('Lada.view.plugin.GridRowExpander', {
                    gridType: 'Lada.view.grid.Messung',
                    idRow: rowtarget.dataIndex,
                    expandOnDblClick: false,
                    gridConfig: {
                        bottomBar: false
                    }
                });
            } else if (rowtarget.dataType === 'messungId') {
                plugin = Ext.create('Lada.view.plugin.GridRowExpander', {
                    gridType: 'Lada.view.grid.Messwert',
                    idRow: rowtarget.dataIndex,
                    expandOnDblClick: false,
                    gridConfig: {
                        bottomBar: false
                    }
                });
            }
            //If grid still exists suspend paging toolbar events to prevent
            //eventhandler from accessing a grid that may already have been
            //cleared and will be destroyed after loading
            var resultGrid = Ext.getCmp('dynamicgridid');
            if (resultGrid) {
                resultGrid.down('pagingtoolbar').suspendEvent('change');
            }
            this.resultStore.loadPage(1, {
                scope: this,
                callback: function(responseData, operation, success) {
                    loadingMask.hide();
                    if (success && responseData) {
                        var contentPanel = button.up('panel[name=main]').down(
                            'panel[name=contentpanel]');
                        contentPanel.removeAll();
                        if (resultGrid) {
                            resultGrid.destroy();
                        }
                        resultGrid = Ext.create(
                            'Lada.view.widget.DynamicGrid', {
                                id: 'dynamicgridid',
                                emptyText: 'query.nodata',
                                basequery: qp.getForm().getRecord()
                                    .get('baseQueryId'),
                                selModel: Ext.create(
                                    'Ext.selection.CheckboxModel', {
                                        checkOnly: true,
                                        injectCheckbox: 1
                                    }),
                                plugins: plugin || null,
                                rowtarget: rowtarget
                            });
                        resultGrid.setup(gcs, Ext.getStore('columnstore'));
                        resultGrid.setStore(this.resultStore);
                        contentPanel.add(resultGrid);
                        contentPanel.show();
                        this.drawGeometryColumns();
                        //Update print window instance
                        Lada.view.window.PrintGrid.getInstance()
                            .updateGrid(resultGrid);
                    } else {
                        //If loading failed, resume paging events
                        if (resultGrid) {
                            resultGrid.down('pagingtoolbar')
                                .resumeEvent('change');
                        }
                        var i18n = Lada.getApplication().bundle;
                        if (operation.error === undefined
                            && operation.getResponse()
                        ) {
                            var json = Ext.decode(
                                operation.getResponse().responseText);
                            if (json.message) {
                                var out = [];
                                var errors = json.errors;
                                for (var key in errors) {
                                    out.push(key);
                                }
                                Ext.Msg.alert(i18n.getMsg(json.message),
                                    out);
                            }
                        } else {
                            if (operation.error.response
                                        && operation.error.response.timedout) {
                                Ext.Msg.alert(
                                    i18n.getMsg('query.error.search.title'),
                                    i18n.getMsg(
                                        'query.error.search.querytimeout.message')
                                );
                            } else if (operation.error.status !== 0) {
                                /* Server response has HTTP error code.
                                   If it's 0, we probably got a 302 from SSO,
                                   which is handled elsewhere. */
                                Ext.Msg.alert(
                                    i18n.getMsg('query.error.search.title'),
                                    i18n.getMsg('query.error.search.message'));
                            }
                        }
                    }
                }
            });
        }
    },

    showsql: function(button) {
        var qp = button.up('querypanel');
        var rowtarget = this.setrowtarget();
        var gcs = qp.gridColumnValueStore;
        var jsonData = this.getQueryPayload(gcs, rowtarget);
        if (!jsonData) {
            //TODO warning: no data requested
            return;
        }
        Ext.Ajax.request({
            url: 'lada-server/rest/sql',
            method: 'POST',
            jsonData: jsonData,
            success: function(response) {
                if (response) {
                    var json = Ext.decode(response.responseText);
                    if (json.success && json.data) {
                        Ext.create('Lada.view.window.SqlDisplay', {
                            sql: json.data
                        }).show();
                    } else {
                        var i18n = Lada.getApplication().bundle;
                        var errors = json.errors;
                        var out = [];
                        for (var key in errors) {
                            out.push(key);
                        }
                        Ext.Msg.alert(i18n.getMsg(json.message), out);
                    }
                }
            },
            failure: function() {
                Ext.log({msg: 'Unable to get sql query', lvl: 'warn'});
            }
        });
    },

    /**
     * Creates the current query as to be sent to the server
     * @param {*} gcs an Extjs store containing the current baseQuery and
     *  gridColumns (usually: querypanel.gridColumnStore)
     * @param {*} rowtarget the calculated rowtarget calculated from the query
     *   panel (see setrowtarget)
     */
    getQueryPayload: function(gcs, rowtarget) {
        var csdata = gcs.getData().items;
        if (!csdata.length) {
            return null;
        }
        var jsonData = {columns: []};
        for (var i = 0; i < csdata.length; i++ ) {
            var columnObj = {
                gridColumnId: csdata[i].get('gridColumnId'),
                filterActive: csdata[i].get('filterActive'),
                filterValue: csdata[i].get('filterValue') || '',
                filterRegex: csdata[i].get('filterRegex') || false,
                filterNegate: csdata[i].get('filterNegate') || false,
                filterIsNull: csdata[i].get('filterIsNull') || false,
                visible: csdata[i].get('visible'),
                columnIndex: csdata[i].get('columnIndex'),
                sortIndex: csdata[i].get('sortIndex'),
                sort: csdata[i].get('sort')
            };
            if (csdata[i].get('dataIndex') === rowtarget.dataIndex) {
                jsonData.columns.push(columnObj);
                continue;
            }
            if (csdata[i].get('visible') === true ||
                csdata[i].get('filterActive') === true ) {
                jsonData.columns.push(columnObj);
            }
        }
        return jsonData;
    },

    /**
     * Create or update the filter panel according to given combobox
     * @param {Ext.form.field.Tag} element Tagfield containing chosen filters
     */
    showFilter: function(element) {
        var i18n = Lada.getApplication().bundle;
        var panel = element.up('querypanel');
        var fixColumnStore = Ext.data.StoreManager.get('columnstore');
        var fvpanel = panel.down('panel[name=filtervalues]');
        fvpanel.removeAll();
        var recs = panel.gridColumnValueStore.getData().items;
        var filters = [];
        for (var i = 0; i < recs.length; i++) {
            if (recs[i].get('filterActive') !== true) {
                continue;
            }
            var fixcolumn = fixColumnStore.findRecord('id',
                recs[i].get('gridColumnId'), false, false, false, true);
            if (fixcolumn) {
                var dt = fixcolumn.get('dataType');
                var field = null;
                var negateCheckbox = false;
                var regexCheckbox = false;
                var options = {
                    name: fixcolumn.get('dataIndex'),
                    columnIndex: recs[i].get('columnIndex'),
                    labelWidth: 125,
                    margin: '10,0,0,0',
                    fieldLabel: fixcolumn.get('name'),
                    negateValue: recs[i].get('filterNegate'),
                    regexValue: recs[i].get('filterRegex'),
                    isNullValue: recs[i].get('filterIsNull'),
                    width: '100%',
                    editable: true,
                    border: false,
                    isFormField: false,
                    triggers: {
                        clear: {
                            extraCls: 'x-form-clear-trigger',
                            handler: function() {
                                this.clearValue();
                            }
                        }
                    }
                };
                switch (dt.name) {
                    case 'text':
                    case 'probeId':
                    case 'messungId':
                    case 'mpId':
                    case 'ortId':
                        options.triggers = {
                            clear: {
                                extraCls: 'x-form-clear-trigger',
                                handler: function() {
                                    this.setValue('');
                                }
                            }
                        };
                        options.value = recs[i].get('filterValue') || null;
                        field = Ext.create(
                            'Lada.view.widget.base.TextField',
                            options);
                        negateCheckbox = true;
                        regexCheckbox = true;
                        break;
                    case 'date':
                        options.triggers = {
                            clear: {
                                extraCls: 'x-form-clear-trigger',
                                handler: function() {
                                    this.setValue(',');
                                }
                            }
                        };
                        if (dt.format === 'd.m.Y') {
                            field = Ext.create(
                                'Lada.view.widget.base.DateRange',
                            options);
                        } else {
                            field = Ext.create(
                                'Lada.view.widget.base.DateTimeRange',
                            options);
                        }
                        negateCheckbox = true;
                        field.setValue(recs[i].get('filterValue'));
                        break;
                    case 'number':
                        options.allowDecimals = true;
                        options.hideTrigger = true;
                        options.keyNavEnabled = false;
                        options.mouseWheelEnabled = false;
                        options.decimalPrecision = 10;
                        options.value = recs[i].get('filterValue') || null;
                        if (dt.format === '###########') {
                            field = Ext.create('Lada.view.widget.base.IntegerRange',
                                options);
                        } else {
                            field = Ext.create('Lada.view.widget.base.NumberRange',
                                options);
                        }
                        negateCheckbox = true;
                        field.setValue(recs[i].get('filterValue'));
                        break;
                    case 'land':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        options.store = Ext.getStore(
                            'messprogrammkategorie');
                        field = Ext.create('Lada.view.widget.MessprogrammLand',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'messstelle':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        options.store = Ext.getStore('messstellen');
                        field = Ext.create(
                            'Lada.view.widget.Messstelle',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'leitstelle':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create(
                            'Lada.view.widget.Leitstelle', options);
                        negateCheckbox = true;
                        break;
                    case 'boolean':
                        options.multiSelect = false;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create(
                            'Lada.view.widget.BoolFilter',
                            options);
                        break;
                    case 'umwbereich':
                        options.multiSelect = true;
                        options.store = Ext.getStore('umwelt');
                        options.value = recs[i].get('filterValue');
                        field = Ext.create('Lada.view.widget.Umwelt', options);
                        negateCheckbox = true;
                        break;
                    case 'statuswert':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        options.store = Ext.getStore('statuswerte');
                        field = Ext.create('Lada.view.widget.Status', options);
                        negateCheckbox = true;
                        break;
                    case 'geom':
                        break;
                    case 'egem':
                        options.multiSelect = true;
                        options.editable = true;
                        options.store = Ext.getStore(
                            'verwaltungseinheitenwidget');
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create(
                            'Lada.view.widget.Verwaltungseinheit',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'datenbasis':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create(
                            'Lada.view.widget.Datenbasis',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'netzbetr':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create('Lada.view.widget.Netzbetreiber',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'probenart':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create(
                            'Lada.view.widget.Probenart',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'staat':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create('Lada.view.widget.Staat', options);
                        negateCheckbox = true;
                        break;
                    case 'messRegime':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create('Lada.view.widget.Betriebsart',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'statusstufe':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        options.store = Ext.getStore('statusstufe');
                        field = Ext.create(
                            'Lada.view.widget.StatusStufe',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'statuskombi':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        options.store = Ext.getStore('statuskombi');
                        field = Ext.create('Lada.view.widget.StatuskombiSelect',
                            options);
                        field.store.load();
                        negateCheckbox = true;
                        break;
                    case 'anlage':
                        options.multiSelect = true;
                        options.store = Ext.getStore('ktaGruppe');
                        options.value = recs[i].get('filterValue');
                        field = Ext.create('Lada.view.widget.KtaGruppe',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'reiproggrp':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = recs[i].get('filterValue');
                        field = Ext.create(
                            'Lada.view.widget.ReiProgpunktGruppe',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'mpl':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = recs[i].get('filterValue');
                        field = Ext.create('Lada.view.widget.MessprogrammLand',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'prnId':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = recs[i].get('filterValue');
                        field = Ext.create('Lada.view.widget.Probenehmer',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'mmtId':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = recs[i].get('filterValue');
                        field = Ext.create('Lada.view.widget.Messmethode',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'messgroesse':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = recs[i].get('filterValue');
                        field = Ext.create('Lada.view.widget.Messgroesse',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'bundesland':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create('Lada.view.widget.Bundesland',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'landkreis':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create('Lada.view.widget.Landkreis',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'regbezirk':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create('Lada.view.widget.Regierungsbezirk',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'ortszusatz':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create('Lada.view.widget.OrtsZusatz',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'ortTyp':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create('Lada.view.widget.OrtTyp',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'sollistUmwGr':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create('Lada.view.widget.SollIstUmwGruppe',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'sollistMmtGr':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create('Lada.view.widget.SollIstMmtGruppe',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'intervall':
                        options.multiSelect = true;
                        options.editable = true;
                        options.value = this.getFilterValueMulti(recs[i]);
                        field = Ext.create('Lada.view.widget.Probenintervall',
                            options);
                        negateCheckbox = true;
                        break;
                    case 'tag':
                        options.multiSelect = true;
                        options.editable = true;
                        options.fieldLabel = i18n.getMsg(
                            'tag.filterwidget.label');
                        options.emptyText = '';
                        options.monitorChanges = false;
                        options.value = recs[i].get('filterValue');
                        field = Ext.create(
                            'Lada.view.widget.TagFilter', options);
                        negateCheckbox = false;
                        break;
                    case 'tagTyp':
                        options.multiSelect = true;
                        options.value = recs[i].get('filterValue');
                        field = Ext.create('Lada.view.widget.TagTyp',
                            options);
                        negateCheckbox = true;
                        break;
                    default:
                        options.value = recs[i].get('filterValue');
                        field = Ext.create('Lada.view.widget.base.TextField',
                            options);
                        negateCheckbox = true;
                        regexCheckbox = true;
                        break;
                }
                if (field) {
                    filters.push(this.createFieldSet(field, options,
                        negateCheckbox, regexCheckbox));
                }
            }
        }
        filters.sort(function(item0, item1) {
            var a = item0.columnIndex;
            var b = item1.columnIndex;
            if (a === -1 || a === null) {
                if (b === -1 || b === null) {
                    // both no columns; sort alphabetically by dataIndex?
                    return (item0.dataIndex).localeCompare(item1.dataIndex);
                }
                return -1;
            } else if (b === -1 || b === null) {
                return 1;
            } else {
                return a - b;
            }
        });
        fvpanel.add(filters);
    },

    activeFiltersChanged: function(box, newvalue, oldvalue) {
        var qp = box.up('querypanel');
        var store = qp.gridColumnValueStore;
        var cs = Ext.data.StoreManager.get('columnstore');
        for (var i = 0; i < oldvalue.length; i++) {
            if (newvalue.indexOf(oldvalue[i]) < 0) {
                var rec = store.findRecord('dataIndex', oldvalue[i],
                    false, false, false, true);
                if (rec) {
                    rec.set('filterActive', false);
                }
            }
        }
        for (var j = 0 ; j < newvalue.length; j++) {
            var nrec = store.findRecord('dataIndex', newvalue[j],
                false, false, false, true);
            if (!nrec) {
                var fixrecord = cs.findRecord('dataIndex', newvalue[j],
                    false, false, false, true);
                var col = Ext.create('Lada.model.GridColConf', {
                    gridColumnId: fixrecord.get('id'),
                    visible: false,
                    filterActive: true,
                    dataIndex: fixrecord.get('dataIndex'),
                    name: fixrecord.get('name')
                });
                store.add(col);
            } else {
                nrec.set('filterActive', true);
            }
        }
        this.showFilter(box);
        this.dataChanged();
    },

    filterValueChanged: function(box, newvalue) {
        if (box.xtype === 'datefield' && box.up('daterange')) {
            this.multiValueChanged(box, newvalue, box.up('daterange'));
        } else if (box.xtype === 'datetimefield' && box.up('datetimerange')) {
            this.multiValueChanged(box, newvalue, box.up('datetimerange'));
        } else if (box.xtype === 'numberfield' && box.up('datetimerange')) {
            this.multiValueChanged(box, newvalue, box.up('datetimerange'));
        } else if (box.xtype === 'expnumberfield' && box.up('numrangefield')) {
            this.multiValueChanged(box, newvalue, box.up('numrangefield'));
        } else if (box.xtype === 'formatnumberfield' && box.up('intrangefield')) {
            this.multiValueChanged(box, newvalue, box.up('intrangefield'));
        } else {
            // Find matching GridColumnValue
            var store = box.up('querypanel').gridColumnValueStore;
            var name = box.name;
            var rec = store.findRecord('dataIndex', name, false, false, false,
                true);

            if (box.xtype === 'tagwidget') {
                // Add tags the user cannot un-select
                newvalue = newvalue.concat(
                    box.up('tagfilterwidget')
                        .down('tagwidget[name=readonly]').getValue());
            }

            // Set new filter value in GridColumnValue
            if (newvalue && Array.isArray(newvalue)) {
                newvalue = newvalue.join(',');
            }
            if (newvalue === '') {
                rec.set('filterValue', null);
            } else {
                rec.set('filterValue', newvalue);
            }
        }
        this.dataChanged();
    },

    multiValueChanged: function(box, newvalue, widget) {
        var store = box.up('querypanel').gridColumnValueStore;
        var rec = store.findRecord('dataIndex', widget.name, false, false,
            false, true);
        if (widget.getValue() === '') {
            rec.set('filterValue', null);
        } else {
            rec.set('filterValue', widget.getValue());
        }
    },

    /**
     * Fired by query filter checkboxes that modify the information of a filter
     * (currently:
     * - filterNegate: reverse the filter
     * - isNull: filter value is explicitly set to 'empty'
     * - filterRegex: ask the server to treat the filter string as regular
     *   expression
     */
    checkboxChanged: function(checkbox) {
        var store = checkbox.up('querypanel').gridColumnValueStore;
        var dataIndex = checkbox.name.slice(0, checkbox.name.lastIndexOf('_'));
        var model = checkbox.name.slice(checkbox.name.lastIndexOf('_') + 1 );
        if (
            ['filterNegate', 'filterRegex', 'filterIsNull']
                .indexOf(model) >= 0
        ) {
            if (
                model === 'filterIsNull' &&
                checkbox.getValue() === true
            ) {
                var field = checkbox.up('querypanel')
                    .down('[name=' + dataIndex + ']');
                if (field.clearValue) {
                    field.clearValue();
                } else {
                    field.setValue(null);
                }
            }
            var rec = store.findRecord('dataIndex', dataIndex, false, false,
                false, true);
            rec.set(model, checkbox.getValue());
            this.dataChanged();
        }
    },

    /*
     * Guess the type of data represented by a query result row based on
     * the existence of columns with specific data types, the latter being
     * listed in rowHierarchy.
     * If multiple columns with such specific types appear in the result,
     * the column of which the type appears first in rowHierarchy
     * determines the type of data represented by the actual query result.
     */
    setrowtarget: function() {
        var rowHierarchy = [
            'id',
            'messungId',
            'probeId',
            'mpId',
            'ortId',
            'tagId',
            'probenehmer',
            'dsatzerz',
            'mprkat'
        ];
        var result = {
            dataType: null,
            dataIndex: null,
            idx: rowHierarchy.length + 1,
            probeIdentifier: null // used to check if a grid contains a probe
        };
        var csdata = Ext.getStore('columnstore').getData().items;
        for (var i = 0; i < csdata.length; i++ ) {
            if (csdata[i].get('dataType').name === 'probeId') {
                result.probeIdentifier = csdata[i].get('dataIndex');
            }
            if (csdata[i].get('dataType').name === 'messungId') {
                result.messungIdentifier = csdata[i].get('dataIndex');
            }
            var idx = rowHierarchy.indexOf(csdata[i].get('dataType').name);
            if (idx > -1 && idx < result.idx) {
                result.dataType = csdata[i].get('dataType').name;
                result.dataIndex = csdata[i].get('dataIndex');
                result.idx = idx;
            }
        }
        if (result.idx < rowHierarchy.length + 2) {
            return {
                dataType: result.dataType,
                dataIndex: result.dataIndex,
                probeIdentifier: result.probeIdentifier || null,
                messungIdentifier: result.messungIdentifier || null

            };
        } else {
            return {
                dataType: null,
                dataIndex: null,
                probeIdentifier: null,
                messungIdentifier: null
            };
        }
    },

    reloadQuery: function(button) {
        var me = this;
        var cb = button.up('querypanel').down('combobox[name=selectedQuery]');
        var current = cb.getValue();
        cb.getStore().load({
            callback: function() {
                var newrec = this.findRecord('id', current,
                    false, false, false, true);
                if (newrec) {
                    cb.select(newrec);
                } else {
                    cb.clearValue();
                }
                me.changeCurrentQuery(cb);
            }
        });
    },

    getFilterValueMulti: function(record) {
        var filterValue = record.get('filterValue');
        if (!filterValue) {
            return null;
        } else {
            if (filterValue.indexOf(',') >= 0) {
                return filterValue.split(',');
            }
            return filterValue;
        }
    },

    dataChanged: function() {
        var qp = Ext.ComponentQuery.query('querypanel')[0];
        var savedisabled = qp.isQueryReadonly();
        if (qp.isValid()) {
            qp.down('button[action=save]').setDisabled(savedisabled);
            qp.down('button[action=newquery]').setDisabled(false);
        } else {
            qp.down('button[action=save]').setDisabled(true);
            qp.down('button[action=newquery]').setDisabled(true);
        }
    },


    /**
     * Creates a filedset for a filter field, adding the additional options
     * @param {*} field the original Ext.form.Field
     * @param {*} options the option containing the field creation parameter
     *  (name, defaults...)
     * @param {*} negateBox set to true if a "negate Filter"option is desired
     * @param {*} regexBox set to true if a "regex" option is desired
     */
    createFieldSet: function(field, options, negateBox, regexBox) {
        var i18n = Lada.getApplication().bundle;
        var checkboxRow = Ext.create('Ext.container.Container', {
            layout: {
                type: 'hbox',
                align: 'right'
            },
            defaults: {
                isFormField: false,
                flex: 1
            }
        });

        if (negateBox) {
            checkboxRow.add(
                Ext.create('Ext.form.field.Checkbox', {

                    name: options.name + '_filterNegate',
                    boxLabel: i18n.getMsg('query.negate'),
                    value: options.negateValue
                })
            );
        }
        if (regexBox) {
            checkboxRow.add(
                Ext.create('Ext.form.field.Checkbox', {
                    name: options.name + '_filterRegex',
                    boxLabel: i18n.getMsg('query.regex'),
                    value: options.regexValue
                })
            );
        }
        checkboxRow.add(
            Ext.create('Ext.form.field.Checkbox', {
                name: options.name + '_filterIsNull',
                boxLabel: i18n.getMsg('query.isNull'),
                value: options.isNullValue
            })
        );
        return Ext.create('Ext.form.FieldSet', {
            width: '100%',
            dataIndex: options.name,
            columnIndex: options.columnIndex,
            items: [field, checkboxRow]
        });
    },

    /**
     * Draw the content of the geometry column if available.
     */
    drawGeometryColumns: function() {
        var resultGrid = Ext.getCmp('dynamicgridid');
        //Get geom column index
        var geomColIdx = this.getGeomColumnIndex();
        if (geomColIdx <= -1) {
            return;
        }
        var dataIdx = this.getVisibleColumns()[geomColIdx]
            .dataIndex;
        var featureTextDataIdx
            = this.getFeatureTextDataIndex();
        var featuresJson = {
            type: 'FeatureCollection',
            features: []
        };
        //For each geometry, construct a geojson feature
        //containing the needed properties
        this.resultStore.getData().each(function(item) {
            var feature = {
                type: 'Feature',
                properties: {}
            };
            var geomString = item.get(dataIdx);
            if (geomString) {
                var geomJson = Ext.decode(geomString);
                feature.properties.id = item.get('id');
                if (featureTextDataIdx) {
                    feature.properties.bez
                        = item.get(featureTextDataIdx);
                }
                feature.geometry = geomJson;
                featuresJson.features.push(feature);
            }
        });
        if (featuresJson.features.length > 0) {
            resultGrid.down('map').drawGeoJson(featuresJson);
        }
    },

    /**
     * Get the width of the given column in the grid.
     * @param {Lada.model.GridColumnValue} col Column
     * @returns Grid column width if visible, else width stored
     * in the column record
     */
    getVisibleColumnWidth: function(col) {
        var visibleCols = this.getVisibleColumns();
        // Get width of visible columns
        var vcIdx;
        // eslint-disable-next-line no-loop-func
        if (visibleCols && visibleCols.some(function(vc, idx) {
            if (vc.dataIndex === col.get('dataIndex')) {
                vcIdx = idx;
                return true;
            }
            return false;
        })) {
            return visibleCols[vcIdx].width;
        }
        return col.get('width');
    },

    showLoadingMask: function() {
        var qp = Ext.ComponentQuery.query('querypanel')[0];
        if (!qp.loadingMask) {
            qp.loadingMask = Ext.create('Ext.LoadMask', {
                target: Ext.getCmp('querypanelid')
            });
        }
        qp.loadingMask.show();
    },

    handleSaveFailure: function() {
        var i18n = Lada.getApplication().bundle;
        Ext.ComponentQuery.query('querypanel')[0].loadingMask.hide();
        Ext.Msg.alert(i18n.getMsg('query.error.save.title'),
                      i18n.getMsg('query.error.save.message'));
    },

    /**
     * Get visible grid columns
     * @returns {Lada.model.GridColumn} Array of column models
     */
    getVisibleColumns: function() {
        var dgs = Ext.ComponentQuery.query('dynamicgrid');
        var visibleCols;
        if (dgs && dgs[0]) {
            visibleCols = dgs[0].getVisibleColumns();
        }
        return visibleCols;
    },

    /**
     * Check if the given column is visible.
     * @param {String} dataIndex
     * @return True if visible
     */
    isColumnVisible: function(dataIndex) {
        var columns = this.getVisibleColumns();
        var foundCol = Ext.Array.findBy(columns, function(col) {
            if (col.dataIndex) {
                return col.dataIndex === dataIndex;
            }
            return false;
        });
        return foundCol !== null;
    },

    /**
     * Get the array index of the geometry column in the visible columns.
     * @returns Index or -1 if not visible
     */
    getGeomColumnIndex: function() {
        return this.getVisibleColumns().findIndex(
            function(i) {
                return i.dataType ?
                    i.dataType.name === 'geom' :
                    false;
            });
    },

    /**
     * Get the dataindex for the column used for geojson feature texts for the
     * given columns.
     *
     * The dataIndex is guessed based upon the given rowtarget and picked from
     * the visible columns.
     * @return {String} dataIndex or null if no suitable column could be found
     */
    getFeatureTextDataIndex: function() {
        switch (this.setrowtarget().dataType) {
            //For ort queries: Show ortId
            case 'ortId':
                return this.isColumnVisible('ortId') ? 'ortId' : null;
            default: return null;
        }
    }
});
