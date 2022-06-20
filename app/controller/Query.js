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
        'Lada.view.plugin.GridRowExpander',
        'Lada.view.widget.DynamicGrid',
        'Lada.view.window.SqlDisplay'
    ],

    resultStore: null,

    /**
     * TODO
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
                columnresize: me.dataChanged
            },
            'querypanel textarea[name=description]': {
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

            // map <-> dynamic grid data exchange listener
            this.resultStore.addListener('load', function() {
                var dgrid = Ext.getCmp('dynamicgridid');
                if (
                    dgrid &&
                    dgrid.rowtarget.dataType === 'ortId' &&
                    dgrid.ortstore
                ) {
                    var data = dgrid.getStore().getData().items;
                    var request = [];
                    for (var i = 0; i < data.length; i++) {
                        request.push(data[i].get(dgrid.rowtarget.dataIndex));
                    }
                    if (request.length) {
                        Ext.Ajax.request({
                            url: 'lada-server/rest/ort/getbyids',
                            jsonData: JSON.stringify(request),
                            method: 'POST',
                            success: function(response) {
                                var json = Ext.JSON.decode(
                                    response.responseText);
                                if (json.data && dgrid.ortstore) {
                                    dgrid.ortstore.setData(json.data);
                                }
                            }
                        });
                    }
                }
            });
        }
    },

    changeListedQueries: function(checkbox) {
        var qp = checkbox.up('querypanel');
        var cbGlobal = qp.down('checkbox[name=filterQueriesGlobal]').getValue();
        var cbOwn = qp.down('checkbox[name=filterQueriesOwn]').getValue();
        var cbAvail = qp.down('checkbox[name=filterQueriesAvail]').getValue();
        var queryBox = qp.down('combobox[name=selectedQuery]');
        qp.store.clearFilter();
        var filterFn = function(item) {
            if (cbOwn && item.get('userId') === Lada.userId) {
                return true;
            } else if ( cbGlobal && item.get('userId') === 0) {
                return true;
            } else if (
                cbAvail &&
                item.get('userId') !== Lada.userId &&
                item.get('userId') !== 0
            ) {
                return true;
            }
            return false;
        };
        qp.store.filter(filterFn);
        queryBox.setStore(qp.store);
        var newquery = qp.store.findRecord('id', queryBox.getValue(), false,
            false, false, true);
        if (!newquery) {
            this.changeCurrentQuery(queryBox);
        }
    },

    cloneQuery: function(button) {
        var me = this;
        var panel = button.up('panel');
        var cbox = panel.down('combobox[name=selectedQuery]');
        var cquery = cbox.getStore().getById(cbox.getValue());
        var name = panel.down('textfield[name=name]').getValue();
        var messStellesIds = panel.down('cbox[name=messStellesIds]').getValue();
        var qp = button.up('querypanel');
        if (name.length > 70) {
            name = name.substring(0, 60) + '... (' + Lada.username + ')';
        } else {
            name = name + '(' + Lada.username + ')';
        }

        //Store column widths
        var columnWidths = {};
        var columns = qp.gridColumnValueStore.getData().items;
        Ext.Array.each(columns, function(item) {
            columnWidths[item.get('dataIndex')] = me.getVisibleColumnWidth(item);
        });

        var newrecord = Ext.create('Lada.model.Query', {
            baseQuery: cquery.get('baseQuery'),
            name: name,
            userId: Lada.userId,
            description: cquery.get('description'),
            messStellesIds: messStellesIds,
            clonedFrom: cquery.get('id')
        });
        panel.store.add(newrecord);
        var columnChooser = panel.down('columnchoser');
        var columnValues = columnChooser.store.getData();
        var fieldset = Ext.getCmp('querypanelid');
        if (!panel.loadingMask) {
            panel.loadingMask = Ext.create('Ext.LoadMask', {
                target: fieldset
            });
        }
        panel.loadingMask.show();

        //Clone columns after query is saved
        var saveCallback = function(savedQuery) {
            return new Ext.Promise(function(resolve) {
                var len = columnValues.length;
                var cur = 0;
                var success = true;
                columnValues.each(function(item) {
                    var clonedModel = Ext.create('Lada.model.GridColumnValue', {
                        columnIndex: item.get('columnIndex'),
                        gridColumnId: item.get('gridColumnId'),
                        visible: item.get('visible'),
                        sort: item.get('sort'),
                        sortIndex: item.get('sortIndex'),
                        filterActive: item.get('filterActive'),
                        filterNegate: item.get('filterNegate'),
                        filterRegex: item.get('filterRegex'),
                        filterValue: item.get('filterValue'),
                        width: columnWidths[item.get('dataIndex')]
                    });
                    clonedModel.set('id', null);
                    clonedModel.set('queryUserId', savedQuery.get('id'));
                    clonedModel.set('userId', null);
                    clonedModel.save({
                        callback: function(rec, op, suc) {
                            cur++;
                            if (!suc) {
                                success = false;
                            }
                            if (cur === len) {
                                resolve(success);
                            }
                        }
                    });
                });
            });
        };

        cbox.setStore(panel.store);
        cbox.select(newrecord);
        // Before changing query, set "own filter" to ensure that the new query
        // can be shown
        cbox.up('querypanel').down('checkbox[name=filterQueriesOwn]')
            .setValue(true);
        this.changeCurrentQuery(cbox);
        panel.down('fieldset[name=querydetails]').setCollapsed(false);
        this.saveQuery(button, saveCallback);
    },

    expandDetails: function(button) {
        button.up('querypanel').down('fieldset[name=querydetails]')
            .setCollapsed(false);
    },

    deleteQuery: function(button) {
        var qp = button.up('querypanel');
        var query = qp.getForm().getRecord();
        if (!query) {
            return;
        }
        if ( (Lada.userId === query.get('userId'))) {
            var me = this;
            var i18n = Lada.getApplication().bundle;
            Ext.MessageBox.confirm(i18n.getMsg('delete'),
                i18n.getMsg('delete.query'), function(btn) {
                    if (btn === 'yes') {
                        query.erase({
                            callback: function() {
                                var combobox = qp.down(
                                    'combobox[name=selectedQuery]');
                                qp.store.load({callback: function() {
                                    combobox.setStore(qp.store);
                                    if (
                                        combobox.store.getData().count() === 0
                                    ) {
                                        // eslint-disable-next-line max-len
                                        var globalCB = qp.down('checkbox[name=filterQueriesGlobal]');
                                        globalCB.setValue(true);
                                        globalCB.fireEvent('change', globalCB);
                                    }
                                    combobox.setValue(qp.store.getAt(0));
                                    me.changeCurrentQuery(combobox);
                                    qp.down('fieldset[name=querydetails]')
                                        .collapse();
                                }});
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
        var newquery = qp.store.findRecord(
            'id',
            combobox.getValue(),
            false,
            false,
            false,
            true);
        combobox.resetOriginalValue();
        qp.down('checkbox[name=filterQueriesAvail]').resetOriginalValue();
        qp.down('checkbox[name=filterQueriesGlobal]').resetOriginalValue();
        qp.down('checkbox[name=filterQueriesOwn]').resetOriginalValue();
        var contentPanel = qp.up('panel[name=main]').down(
            'panel[name=contentpanel]');
        contentPanel.removeAll();
        if (!newquery) {
            combobox.clearValue();
            combobox.resetOriginalValue();
            var emptyentry = Ext.create('Lada.model.Query', {
                baseQuery: null,
                name: null,
                userId: null,
                description: null,
                messStellesIds: null,
                clonedFrom: 'empty'
            });
            qp.getForm().loadRecord(emptyentry);
            qp.loadGridColumnStore();
            qp.down('button[action=newquery]').setDisabled(true);
            qp.down('button[action=delquery]').setDisabled(true);
            qp.down('button[action=save]').setDisabled(true);
        } else {
            combobox.resetOriginalValue();
            qp.getForm().loadRecord(newquery);
            qp.loadGridColumnStore();
            var newMst = newquery.get('messStellesIds');
            if (newMst) {
                qp.down('cbox[name=messStellesIds]').setValue(newMst);
            } else {
                qp.down('cbox[name=messStellesIds]').setValue('');
            }
            qp.down('button[action=newquery]').setDisabled(newquery.phantom);
            qp.down('button[action=delquery]').setDisabled(
                qp.isQueryReadonly());
            qp.down('button[action=save]').setDisabled(true);
        }
        Lada.view.window.PrintGrid.getInstance().parentGrid = null;
    },

    handleSaveClicked: function(button) {
        this.saveQuery(button);
    },

    /**
     * Saves the current query object and attached columns
     * @param button UI el inside the querypanel
     * @param callback (optional) async Function to call after successful save.
     *     If present, it will replace the saving of gridColumns
     */
    saveQuery: function(button, callback) {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var qp = button.up('querypanel');

        var record = qp.getForm().getRecord();
        var values = qp.getForm().getFieldValues(true);
        var fv = Object.keys(values);

        var queryUserFields = Ext.create('Lada.model.Query').fields;
        for (var i = 0; i < fv.length; i++) {
            //If field is in query model, append key and value to record
            // eslint-disable-next-line no-loop-func
            queryUserFields.forEach(function(element) {
                if (element.getName() === fv[i]) {
                    record.set(fv[i], values[fv[i]]);
                }
            });
        }
        record.set(
            'messStellesIds',
            qp.down('cbox[name=messStellesIds]').getValue());
        if (record.phantom) {
            record.set('id', null);
            record.set('userId', Lada.userId);
        }

        if (!qp.loadingMask) {
            var fieldset = Ext.getCmp('querypanelid');
            qp.loadingMask = Ext.create('Ext.LoadMask', {
                target: fieldset
            });
        }
        qp.loadingMask.show();
        button.setDisabled(true);
        var failureCallback = function() {
            qp.loadingMask.hide();
            Ext.Msg.alert(i18n.getMsg('query.error.save.title'),
                          i18n.getMsg('query.error.save.message'));
        };
        record.save({
            success: function(rec, response) {
                var json = Ext.decode(response.getResponse().responseText);
                var newId = json.data.id;
                qp.getForm().loadRecord(rec);

                var finalCallback = function() {
                    qp.down('combobox[name=selectedQuery]')
                        .setStore(qp.store);
                    qp.down('combobox[name=selectedQuery]').select(newId);
                    qp.loadGridColumnStore();
                    qp.loadingMask.hide();
                };
                if (!callback) {
                    var columns = qp.gridColumnValueStore.getData().items;
                    var saved = 0;
                    new Ext.Promise(function(resolve) {
                        for (var i2 = 0; i2 < columns.length; i2++) {
                            var col = columns[i2];
                            //Set column width
                            col.set('width', me.getVisibleColumnWidth(col));

                            // Save the column
                            col.save({
                                // eslint-disable-next-line no-loop-func
                                success: function() {
                                    saved++;
                                    if (saved === columns.length) {
                                        resolve();
                                    }
                                },
                                failure: failureCallback
                            });
                        }
                    }).then(function() {
                        finalCallback();
                    });
                } else {
                    callback(rec).then(function() {
                        finalCallback();
                    });
                }
            },
            failure: failureCallback
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
            if (rec.phantom) {
                panel.store.remove(rec);
            }
            panel.down('button[action=newquery]').setDisabled(false);
            panel.loadGridColumnStore();
        }
    },

    search: function(button) {
        this.createResultStore();
        var i18n = Lada.getApplication().bundle;
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
            this.resultStore.loadPage(1, {
                scope: this,
                callback: function(responseData, operation, success) {
                    loadingMask.hide();
                    if (success && responseData) {
                        var contentPanel = button.up('panel[name=main]').down(
                            'panel[name=contentpanel]');
                        contentPanel.removeAll();
                        var resultGrid = Ext.getCmp('dynamicgridid');
                        if (resultGrid) {
                            resultGrid.destroy();
                        }
                        resultGrid = Ext.create(
                            'Lada.view.widget.DynamicGrid', {
                                id: 'dynamicgridid',
                                emptyText: 'query.nodata',
                                basequery: qp.getForm().getRecord()
                                    .get('baseQuery'),
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
                        if (rowtarget.dataType === 'ortId') {
                            this.setMapOrte(resultGrid);
                        }
                        //Update print window instance
                        Lada.view.window.PrintGrid.getInstance()
                            .updateGrid(resultGrid);
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
                        field = Ext.create(
                            'Lada.view.widget.base.DateTimeRange',
                            options);
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
                    case 'geom':// TODO: how/if to implement
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
                        field = Ext.create('Lada.view.widget.Tag',
                            options);
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
                var col = Ext.create('Lada.model.GridColumnValue', {
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
        /*} else if (box.xtype === 'tagwidget') {
            var store = box.up('querypanel').gridColumnValueStore;
            var name = box.name;
            var rec = store.findRecord('dataIndex', name, false, false, false,
                true);
            //Send tags to filter for as comma separated tag names
            var tagNames = [];
            for (var i = 0; i < newvalue.length; i++) {
                    tagNames.push(box.store.getById(newvalue[i]).get('tag'));
            }
            rec.set('filterValue', tagNames.join(',')); */
        } else {
            var store = box.up('querypanel').gridColumnValueStore;
            var name = box.name;
            var rec = store.findRecord('dataIndex', name, false, false, false,
                true);
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
        var qp = button.up('querypanel');
        var cb = qp.down('combobox[name=selectedQuery]');
        var current = cb.getValue();
        qp.store.reload({
            callback: function() {
                cb.setStore(qp.store);
                var newrec = qp.store.findRecord('id', current,
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

    setMapOrte: function(grid) {
        grid.ortstore = Ext.create(
            'Lada.store.Orte', {
                autoLoad: false,
                remoteFilter: true
            });
        grid.ortstore.addListener('datachanged', function() {
            var dgrid = Ext.getCmp('dynamicgridid');
            dgrid.down('map').addLocations(dgrid.ortstore);
        });
        grid.getStore().fireEvent('load');
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
     * Get the width of the given column in the grid.
     * @param {Lada.model.GridColumnValue} col Column
     * @returns Grid column width if visible, else width store in the column record
     */
    getVisibleColumnWidth: function(col) {
        // Visible columns for saving column width
        var dgs = Ext.ComponentQuery.query('dynamicgrid');
        var visibleCols;
        if (dgs && dgs[0]) {
            visibleCols = dgs[0].getVisibleColumns();
        }
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
    }
});
