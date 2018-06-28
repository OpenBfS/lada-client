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
        'Lada.store.GridColumn',
        'Lada.store.GenericResults',
        'Lada.view.widget.Messstelle',
        'Lada.view.widget.Umwelt',
        'Lada.view.widget.Staat',
        'Lada.view.widget.base.TextField',
        'Lada.view.widget.Status',
        'Lada.view.widget.MessprogrammLand',
        'Lada.view.widget.Verwaltungseinheit',
        'Lada.view.widget.BoolFilter',
        'Lada.view.widget.base.NumberField',
        'Lada.view.widget.Netzbetreiber',
        'Lada.view.widget.Datenbasis',
        'Lada.view.widget.Betriebsart'

    ],

    resultStore: null,

    /**
     * TODO
     */
    init: function() {
        var me = this;
        this.control({
            'querypanel checkbox[name=ownqueries]': {
                change: me.listAllQueries
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
            'querypanel button[action=search]': {
                click: me.search
            },
            'querypanel cbox[name=activefilters] tagfield': {
                change: me.activeFiltersChanged
            },
            'querypanel panel[name=filtervalues] tagfield': {
                change: me.filterValueChanged
            },
            'querypanel panel[name=filtervalues] numberfield': {
                change: me.filterValueChanged
            },
            'querypanel panel[name=filtervalues] textfield': {
                change: me.filterValueChanged
            },
            'querypanel panel[name=filtervalues] combobox': {
                change: me.filterValueChanged
            },
            'querypanel button[action=reload]': {
                click: me.reloadQuery
            }
        });
        this.resultStore = Ext.StoreManager.get('GenericResults');

    },

    listAllQueries: function(checkbox, newval) {
        var qp = checkbox.up('querypanel');
        qp.store.clearFilter();
        if (newval === true) {
            qp.store.filter({
                property: 'userId',
                value: Lada.userId,
                exactMatch: true
            });
            var newrec = qp.store.findRecord('id',
                qp.down('combobox[name=selectedQuery]').getValue(), false, false,false, true);
            if (newrec) {
                checkbox.resetOriginalValue();
            } else {
                qp.down('combobox[name=selectedQuery]').clearValue();
                qp.down('combobox[name=selectedQuery]').resetOriginalValue();
                this.changeCurrentQuery(checkbox);
            }
        }
    },

    cloneQuery: function(button) {
        var panel = button.up('panel');
        var cbox = panel.down('combobox[name=selectedQuery]');
        var cquery = cbox.getStore().getById(cbox.getValue());
        var newrecord = Ext.create('Lada.model.Query',{
            baseQuery: cquery.get('baseQuery'),
            name: cquery.get('name') + ' (Kopie)',
            userId: Lada.userId,
            description: cquery.get('description'),
            messStellesIds: this.getMessStellenUnique(),
            clonedFrom: cquery.get('id')
        });
        panel.store.add(newrecord);
        var columnChooser = panel.down('columnchoser');
        var columnValues = columnChooser.store.getData();
        //Clone columns after query is saved
        saveCallback = function(savedQuery) {
            columnValues.each(function(item){
                var clonedModel = Ext.create('Lada.model.GridColumn', {
                    columnIndex: item.get('columnIndex'),
                    gridColumnId: item.get('gridColumnId'),
                    visible: item.get('visible'),
                    sort: item.get('sort'),
                    sortIndex: item.get('sortIndex'),
                    filterActive: item.get('filterActive'),
                    filterValue: item.get('filterValue')
                })
                clonedModel.set('id', null);
                clonedModel.set('queryUserId', savedQuery.get('id'));
                clonedModel.set('userId', null)
                clonedModel.phantom = true;
                clonedModel.save()
            })
        }

        cbox.setStore(panel.store);
        cbox.select(newrecord);
        this.changeCurrentQuery(cbox);
        panel.down('fieldset[name=querydetails]').setCollapsed(false);
        this.saveQuery(button, saveCallback);
    },

    expandDetails: function(button) {
        button.up('querypanel').down('fieldset[name=querydetails]').setCollapsed(false);
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
                            callback: function(record, operation, success) {
                                var combobox = qp.down('combobox[name=selectedQuery]');
                                qp.store.load({callback: function() {
                                    combobox.setStore(qp.store);
                                    if (combobox.store.getData().count() == 0) {
                                        var checkbox = qp.down('checkbox[name=ownqueries]');
                                        checkbox.setValue(false);
                                    }
                                    combobox.setValue(qp.store.getAt(0));
                                    me.changeCurrentQuery(combobox);
                                    qp.down('fieldset[name=querydetails]').collapse();
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
        var newquery = qp.store.getById(combobox.getValue());
        if (!newquery) {
            qp.getForm().reset(true);
            this.loadGridColumnStore(combobox);
            qp.down('button[action=newquery]').setDisabled(true);
            qp.down('button[action=delquery]').setDisabled(true);
            qp.down('button[action=save]').setDisabled(true);
        } else {

            combobox.resetOriginalValue();
            qp.getForm().loadRecord(newquery);
            this.loadGridColumnStore(combobox);

            var newMst = newquery.get('messStellesIds');

            /* if (this.isQueryReadonly(newquery) === false) {
                for (var j =0; j < Lada.mst.length; j++) {
                    if (groupstore.findRecord('messStelle', Lada.mst[j], false,
                        false, false, true) === null) {
                        var mst = mst_store.getById(Lada.mst[j]);
                        var mst_name = mst ? mst.get('messStelle') : Lada.mst[j];
                        groupstore.add(
                            Ext.create('Lada.model.QueryGroup', {
                                messStellesId: Lada.mst[j],
                                name: mst_name
                            })
                        );
                    }
                }
            }*/
            if (newMst) {
                qp.down('cbox[name=messStellesIds]').setValue(newMst);
            } else {
                qp.down('cbox[name=messStellesIds]').setValue('');
            }
            qp.down('button[action=newquery]').setDisabled(newquery.phantom);
            qp.down('button[action=delquery]').setDisabled(
                this.isQueryReadonly(newquery));
            qp.down('button[action=save]').setDisabled(
                this.isQueryReadonly(newquery));
        }
    },

    handleSaveClicked: function(button) {
        this.saveQuery(button);
    },

    saveQuery: function(button, callback) {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var qp = button.up('querypanel');
        var record = qp.getForm().getRecord();
        var values = qp.getForm().getFieldValues(true);
        var fv = Object.keys(values);

        var queryUserFields = Ext.create('Lada.model.Query').fields;
        for (var i=0; i< fv.length; i++) {
            //If field is in query model, append key and value to record
            queryUserFields.forEach(function(element) {
                if (element.getName() === fv[i]) {
                    record.set(fv[i], values[fv[i]]);
                }
            });
        }
        record.set('messStellesIds', qp.down('cbox[name=messStellesIds]').getValue());
        if (record.phantom) {
            record.set('id', null);
            record.set('userId', Lada.userId);
        }
        button.setDisabled(true);
        record.save({
            success: function(rec, response) {
                if (callback) {
                    callback(rec);
                }

                var json = Ext.decode(response.getResponse().responseText);
                var newId = json.data.id;
                qp.getForm().loadRecord(rec);
                var columns = qp.gridColumnValueStore.getData().items;
                qp.gridColumnValueStore.proxy.extraParams = {};
                for (var i=0; i < columns.length; i++) {
                    columns[i].save();
                }
                qp.store.load({callback: function() {
                    qp.down('combobox[name=selectedQuery]').setStore(qp.store);
                    qp.down('combobox[name=selectedQuery]').select(newId);
                    me.loadGridColumnStore(button);
                    button.setDisabled(false);
                }});
            },
            failure: function(rec, response) {
                Ext.Msg.alert(i18n.getMsg('query.error.save.title'), i18n.getMsg('query.error.save.message'))
                button.setDisabled(false);
            }
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
        panel.down('combobox[name=selectedQuery]').select(qid);
        if (rec.phantom) {
            panel.store.remove(rec);
        }
        panel.down('button[action=newquery]').setDisabled(false);
        this.loadGridColumnStore(button);
    },

    search: function(button) {
        var i18n = Lada.getApplication().bundle;
        var qp = button.up('querypanel');
        var gcs = qp.gridColumnValueStore;
        var jsonData = {columns: []};
        var csdata = gcs.getData().items;
        if (csdata.length === 0) {
            //TODO warning: no data requested
            return;
        }
        var rowtarget = this.setrowtarget(qp);
        for (var i=0; i < csdata.length; i++ ) {
            if (csdata[i].get('dataIndex') === rowtarget.dataIndex) {
                jsonData.columns.push({
                    gridColumnId: csdata[i].get('gridColumnId'),
                    filterActive: csdata[i].get('filterActive'),
                    filterValue: csdata[i].get('filterValue') || '',
                    visible: csdata[i].get('visible'),
                    columnIndex: csdata[i].get('columnIndex'),
                    sortIndex: csdata[i].get('sortIndex'),
                    sort: csdata[i].get('sort')
                });
                continue;
            }
            if (csdata[i].get('visible') === true ||
                csdata[i].get('filterActive') === true ) {
                jsonData.columns.push({
                    gridColumnId: csdata[i].get('gridColumnId'),
                    filterActive: csdata[i].get('filterActive'),
                    filterValue: csdata[i].get('filterValue') || '',
                    visible: csdata[i].get('visible'),
                    columnIndex: csdata[i].get('columnIndex'),
                    sortIndex: csdata[i].get('sortIndex'),
                    sort: csdata[i].get('sort')
                });
            }
        }
        if (!jsonData.columns.length) {
            //TODO warning: no data requested
        } else {
            var fixColumnStore = Ext.data.StoreManager.get('columnstore');
            fixColumnStore.clearFilter();
            fixColumnStore.filter({
                property: 'baseQuery',
                value: qp.getForm().getRecord().get('baseQuery'),
                exactMatch: true});
            if (!this.resultStore) {
                this.resultStore = Ext.StoreManager.get('genericresults');
            }
            this.resultStore.setProxyPayload(jsonData);
            this.resultStore.setPageSize(Lada.pagingSize);
            this.resultStore.loadPage(1,{
                scope: this,
                callback: function(responseData, operation, success) {
                    if (success && responseData) {
                        var contentPanel = button.up('panel[name=main]').down(
                            'panel[name=contentpanel]');
                        contentPanel.removeAll();
                        var resultGrid = Ext.create('Lada.view.widget.DynamicGrid', {
                            basequery: qp.getForm().getRecord().get('baseQuery'),
                            selModel: Ext.create('Ext.selection.CheckboxModel', {
                                checkOnly: true,
                                injectCheckbox: 1
                            }),
                            rowtarget: rowtarget
                        });
                        resultGrid.setup(gcs, fixColumnStore);
                        resultGrid.setStore(this.resultStore);
                        contentPanel.add(resultGrid);
                        contentPanel.show();

                        if (rowtarget.dataType === 'ortId') {
                            resultGrid.ortstore = Ext.create(
                                'Lada.store.Orte', {
                                    autoLoad: true,
                                    remoteFilter: false
                                });
                        //     resultGrid.store.addListener('datachanged',
                        //     function(store){
                        //         var items = store.getData().items;
                        //         for (var i=0; i< items.length; i++){
                        //             var id = items[i].get(rowtarget.dataIndex);
                            resultGrid.ortstore.addListener('load',
                                resultGrid.down('map').addLocations,
                                resultGrid.down('map')
                            );
                        }
                    } else {
                        Ext.Msg.alert(i18n.getMsg('query.error.search.title'), i18n.getMsg('query.error.search.message'))
                    }
                }
            });
        }
    },

    showFilter: function(combo) {
        var panel = combo.up('querypanel');
        var fixColumnStore = Ext.data.StoreManager.get('columnstore');
        fixColumnStore.clearFilter();
        fixColumnStore.filter({
            property: 'baseQuery',
            value: panel.getForm().getRecord().get('baseQuery'),
            exactMatch: true
        });
        var fvpanel = panel.down('panel[name=filtervalues]');
        fvpanel.removeAll();
        var recs = panel.gridColumnValueStore.getData().items;
        for (var i= 0; i < recs.length; i++) {
            if (recs[i].get('filterActive') !== true) {
                continue;
            }
            var fixcolumn = fixColumnStore.findRecord('id',
                recs[i].get('gridColumnId'), false, false, false, true);
            var dt = fixcolumn.get('dataType');
            var field = null;
            var options = {
                name: fixcolumn.get('dataIndex'),
                labelWidth: 125,
                fieldLabel: fixcolumn.get('name'),
                value: recs[i].get('filterValue') || null,
                width: '100%',
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
                case 'ortId':
                    options.triggers = {
                        clear: {
                            extraCls: 'x-form-clear-trigger',
                            handler: function() {
                                this.setValue('');
                            }
                        }
                    };
                    field = Ext.create('Ext.form.field.Text', options);
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
                    field = Ext.create('Lada.view.widget.base.DateRange',
                        options);
                    field.setValue(recs[i].get('filterValue'));
                    break;
                case 'number':
                    options.triggers = {
                        clear: {
                            extraCls: 'x-form-clear-trigger',
                            handler: function() {
                                this.clearValue();
                            }
                        }
                    };
                    options.allowDecimals = true;
                    options.hideTrigger = true;
                    options.keyNavEnabled = false;
                    options.mouseWheelEnabled = false;
                    field = Ext.create('Lada.view.widget.base.NumberField',
                        options);
                    break;
                case 'land':
                    options.store = Ext.data.StoreManager.get(
                        'messprogrammkategorie');
                    field = Ext.create('Lada.view.widget.MessprogrammLand',
                        options);

                    break;
                case 'messsstelle':
                    options.store = Ext.data.StoreManager.get('messstellen');
                    field = Ext.create('Lada.view.widget.Messstelle', options);
                    break;
                case 'boolean':
                    field = Ext.create('Lada.view.widget.BoolFilter', options);
                    break;
                case 'umwbereich':
                    options.store = Ext.data.StoreManager.get('umwelt');
                    field = Ext.create('Lada.view.widget.Umwelt' , options);
                    break;
                case 'status':
                    options.store = Ext.data.StoreManager.get('statuswerte');
                    field = Ext.create('Lada.view.widget.Status', options);
                    break;
                case 'geom':// TODO: how/if to implement
                    break;
                case 'egem':// TODO not yet in db
                    field = Ext.create('Lada.view.widget.Verwaltungseinheit',
                        options);
                    break;
                case 'datenbasis':// TODO not yet in db
                    field = Ext.create('Lada.view.widget.Datenbasis', options);
                    break;
                case 'netzbetr':// TODO not yet in db
                    field = Ext.create('Lada.view.widget.Netzbetreiber',
                        options);
                    break;
                case 'probenart':// TODO not yet in db
                    field = Ext.create('Lada.view.widget.Probenart', options);
                    break;
                case 'staat':// TODO not yet in db
                    field = Ext.create('Lada.view.widget.Staat', options);
                    break;
                case 'betrart':// TODO not yet in db
                    field = Ext.create('Lada.view.widget.Betriebsart',
                        options);
                    break;
                case 'statusstfe':// TODO not yet in db
                default:
                    field = Ext.create('Lada.view.widget.base.TextField',
                        options);
                    break;
            }
            if (field) {
                fvpanel.add(field);
            }
        }
    },

    activeFiltersChanged: function(box, newvalue, oldvalue) {
        var qp = box.up('querypanel');
        var store =qp.gridColumnValueStore;
        var cs = Ext.data.StoreManager.get('columnstore');
        cs.clearFilter();
        cs.filter({
            property: 'baseQuery',
            value: qp.getForm().getRecord().get('baseQuery'),
            exactMatch: true
        });
        for (var i=0; i < oldvalue.length; i++) {
            if (newvalue.indexOf(oldvalue[i]) < 0) {
                var rec = store.findRecord('dataIndex', oldvalue[i],
                    false, false, false, true);
                if (rec) {
                    rec.set('filterActive',false);
                }
            }
        }
        for (var j= 0 ; j < newvalue.length; j++) {
            var nrec = store.findRecord('dataIndex', newvalue[j],
                false, false, false, true);
            if (!nrec) {
                var fixrecord = cs.findRecord('dataIndex', newvalue[j],
                    false, false, false, true);
                var col = Ext.create('Lada.model.GridColumn', {
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
    },

    filterValueChanged: function(box, newvalue, oldvalue) {
        if (box.xtype === 'datefield') {
            this.dateValueChanged(box, newvalue);
        } else {
            var store = box.up('querypanel').gridColumnValueStore;
            var name = box.name;
            var rec = store.findRecord('dataIndex', name, false, false, false,
                true);
            rec.set('filterValue', newvalue);
        }
    },

    dateValueChanged: function(box, newvalue, oldvalue) {
        var store = box.up('querypanel').gridColumnValueStore;
        var widget = box.up().up();
        var rec = store.findRecord('dataIndex', widget.name, false, false,
            false, true);
        rec.set('filterValue', widget.getValue());
    },

    loadGridColumnStore: function(element) {
        var panel = element.up('querypanel');
        var gcs = Ext.create('Lada.store.GridColumn');
        if (panel.getForm().getRecord() === undefined) {
            panel.down('columnchoser').setStore(null);
            panel.down('columnsort').setStore(null);
            panel.down('cbox[name=activefilters]').store.removeAll();
            panel.down('cbox[name=activefilters]').setValue('');
            panel.down('cbox[name=messStellesIds]').setValue('');
            gcs.removeAll();
        } else {
            var qid = null;
            if (panel.getForm().getRecord().phantom) {
                qid = panel.getForm().getRecord().get('clonedFrom');
            } else {
                qid = panel.getForm().getRecord().get('id');
            }
            gcs.proxy.extraParams = {
                'qid': qid
            };
            gcs.load({
                callback: function(records, op, success) {
                    var cs = Ext.data.StoreManager.get('columnstore');
                    cs.clearFilter();
                    cs.filter({
                        property: 'baseQuery',
                        value: panel.getForm().getRecord().get('baseQuery'),
                        exactMatch: true
                    });
                    panel.gridColumnValueStore = gcs;
                    panel.setGridColumnStore(qid, panel.getForm().getRecord().get('baseQuery'));
                    var filters = gcs.getData().items;
                    var activefilters = [];
                    for (var a=0; a < filters.length; a++) {
                        if (filters[a].get('filterActive') === true) {
                            var r = cs.findRecord('id', filters[a].get(
                                'gridColumnId'), false, false, false, true);
                            if (r) {
                                activefilters.push(r.get('dataIndex'));
                            }
                        }
                    }
                    panel.down('cbox[name=activefilters]').setValue(
                        activefilters.join(','));
                    panel.down('cbox[name=messStellesIds]').setValue(
                        panel.getForm().getRecord().get('messStellesIds'));
                }
            });
        }
    },

    //checks checks if a query is editable by the current user
    isQueryReadonly: function(query) {
        if (Lada.userId === query.get('userId') || query.phantom) {
            return false;
        }
        return true;
    },

    getMessStellenUnique: function() {
        var mst = [];
        if (Lada.mst) {
            for (var j = 0; j < Lada.mst.length; j++) {
                if (mst.indexOf(Lada.mst[j]) < 0) {
                    mst.push(Lada.mst[j]);
                }
            }
        }
        return mst;
    },

    setrowtarget: function(querypanel) {
        var rowHierarchy = ['messungId', 'probeId', 'mpId', 'ortId', 'pnehmer',
            'dsatzerz', 'mprkat'];
        var result = {
            dataType: null,
            dataIndex: null,
            idx: rowHierarchy.length + 1
        };
        var cs = Ext.data.StoreManager.get('columnstore');
        cs.clearFilter();
        cs.filter({
            property: 'baseQuery',
            value: querypanel.getForm().getRecord().get('baseQuery'),
            exactMatch: true
        });
        var csdata = cs.getData().items;
        for (var i=0; i < csdata.length; i++ ) {
            var idx = rowHierarchy.indexOf(csdata[i].get('dataType').name);
            if (idx > -1 && idx < result.idx) {
                result = {
                    dataType: csdata[i].get('dataType').name,
                    dataIndex: csdata[i].get('dataIndex'),
                    idx: idx
                };
            }
        }
        if (result.idx < rowHierarchy.length + 2) {
            return {
                dataType: result.dataType,
                dataIndex: result.dataIndex
            };
        } else {
            return {
                dataType: null,
                dataIndex: null
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
                    false,false,false,true);
                if (newrec) {
                    cb.select(newrec);
                } else {
                    cb.clearValue();
                }
                me.changeCurrentQuery(cb);
            }
        });
    }

});
