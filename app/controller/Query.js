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
            'querypanel button[action=editquery]': {
                click: me.expandDetails
            },
            'querypanel button[action=delquery]': {
                click: me.deleteQuery
            },
            'querypanel combobox[name=selectedQuery]': {
                select: me.changeCurrentQuery
            },
            'querypanel button[action=save]': {
                click: me.saveQuery
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
            }
        });
        this.resultStore = Ext.StoreManager.get('GenericResults');
    },

    listAllQueries: function(checkbox, newval) {
        checkbox.resetOriginalValue(); // avoids field being cleaned on reset
        checkbox.up('querypanel').store.clearFilter();
        if (newval === true) {
            checkbox.up('querypanel').store.filter({
                property: 'userId',
                value: Lada.userId,
                exactMatch: true
            });
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
        panel.store.add([newrecord]);
        cbox.setStore(panel.store);
        cbox.select(newrecord);
        this.changeCurrentQuery(cbox);
        panel.down('fieldset[name=querydetails]').setCollapsed(false);
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
            var i18n = Lada.getApplication().bundle;
            Ext.MessageBox.confirm(i18n.getMsg('delete'),
                i18n.getMsg('delete.query'), function(btn) {
                    if (btn === 'yes') {
                        query.erase({
                            callback: function(record, operation, success) {
                                var combobox = qp.down('combobox[name=selectedQuery]');
                                qp.store.reload();
                                combobox.setStore(qp.store);
                                var firstEntry = qp.store.getAt(0);
                                if (!firstEntry) {
                                    qp.down('checkbox[name=ownqueries]').setValue(false);
                                    firstEntry = qp.store.getAt(0);
                                }
                                combobox.select(qp.store.getAt(0));
                                qp.down('fieldset[name=querydetails]').collapse();
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
        combobox.resetOriginalValue();
        qp.getForm().loadRecord(newquery);
        this.loadGridColumnStore(combobox);
        var groupstore = qp.down('cbox[name=messStellesIds]').down(
            'tagfield').getStore();
        groupstore.removeAll();
        var newMst = newquery.get('messStellesIds');
        if (newMst !== null) {
            for (var i = 0; i < newMst.length; i++) {
                groupstore.add(
                    Ext.create('Lada.model.QueryGroup', {
                        messStellesIds: newMst[i]
                    })
                );
            }
        }
        if (this.isQueryReadonly(newquery) === false) {
            for (var j =0; j < Lada.mst.length; j++) {
                if (groupstore.findRecord('messStelle', Lada.mst[j], false,
                    false, false, true) === null) {
                    groupstore.add(
                        Ext.create('Lada.model.QueryGroup', {
                            messStellesId: Lada.mst[j]
                        })
                    );
                }
            }
        }

        this.loadGridColumnStore(combobox);
        qp.down('button[action=newquery]').setDisabled(newquery.phantom);
        qp.down('button[action=delquery]').setDisabled(
            this.isQueryReadonly(newquery));
        qp.down('button[action=save]').setDisabled(
            this.isQueryReadonly(newquery));
    },

    saveQuery: function(button) {
        var qp = button.up('querypanel');
        var me = this;
        var record = qp.getForm().getRecord();
        if (record.phantom) {
            record.set('id', null);
            record.set('userId', Lada.userId);
        }
        record.save({
            success: function(rec, response) {
                var json = Ext.decode(response.getResponse().responseText);
                var newId = json.data.id;
                var columns = qp.gridColumnStore.getData().items;
                qp.gridColumnStore.proxy.extraParams = {};
                for (var i=0; i < columns.length; i++) {
                    columns[i].set('queryUserId', newId);
                    if (columns[i].phantom) {
                        // hack to avoid duplicate 'null' ids
                        var tmpid = columns[i].get('id');
                        columns[i].set('id', null);
                        columns[i].save();
                        columns[i].set('id', tmpid);
                    } else {
                        columns[i].save();
                    }
                }
                qp.store.reload();
                qp.down('combobox[name=selectedQuery]').setStore(qp.store);
                qp.down('combobox[name=selectedQuery]').setValue(newId);
            },
            failure: function(rec, response) {
                //TODO error handling
            }
        });
    },

    reset: function(button) {
        var panel = button.up('querypanel');
        var qid = '';
        var rec = panel.getForm().getRecord();
        if (rec.phantom) {
            qid = rec.get('clonedFrom');
        } else {
            qid = rec.get('id');
        }
        panel.getForm().loadRecord(panel.store.getById(qid));
        panel.store.remove(rec);
        this.loadGridColumnStore(button);
    },

    search: function(button) {
        var qp = button.up('querypanel');
        var gcs = qp.gridColumnStore;
        var jsonData = {columns: []};
        var csdata = gcs.getData().items;
        for (var i=0; i < csdata.length; i++ ) {
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
            this.resultStore.load({
                scope: this,
                callback: function(responseData, operation, success) {
                    if (success && responseData) {
                        var contentPanel = button.up('panel[name=main]').down(
                            'panel[name=contentpanel]');
                        contentPanel.removeAll();
                        var resultGrid = Ext.create('Lada.view.widget.DynamicGrid', {
                            selModel: Ext.create('Ext.selection.CheckboxModel', {
                                checkOnly: true,
                                injectCheckbox: 1
                            })
                        });
                        resultGrid.setup(gcs, fixColumnStore);
                        resultGrid.setStore(this.resultStore);
                        //resultGrid.store.removeAll();
                        //resultGrid.store.add(responseData);
                        resultGrid.show();
                        contentPanel.add(resultGrid);
                    }
                    //TODO error handling if search fails
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
        var recs = panel.gridColumnStore.getData().items;
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
        var store =qp.gridColumnStore;
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
            var store = box.up('querypanel').gridColumnStore;
            var name = box.name;
            var rec = store.findRecord('dataIndex', name, false, false, false,
                true);
            rec.set('filterValue', newvalue);
        }
    },

    dateValueChanged: function(box, newvalue, oldvalue) {
        var store = box.up('querypanel').gridColumnStore;
        var widget = box.up().up();
        var rec = store.findRecord('dataIndex', widget.name, false, false,
            false, true);
        rec.set('filterValue', widget.getValue());
    },

    loadGridColumnStore: function(element) {
        var panel = element.up('querypanel');
        var gcs = Ext.create('Lada.store.GridColumn');
        gcs.proxy.extraParams = {
            'qid': panel.getForm().getRecord().get('id')
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
                panel.gridColumnStore = gcs;
                panel.down('columnchoser').setStore(gcs, cs);
                panel.down('columnchoser').setStore(gcs, cs);
                panel.down('columnsort').setStore(gcs);
                panel.down('cbox[name=activefilters]').setStore(cs);

                panel.down('cbox[name=activefilters]').setValue(
                    panel.getForm().getRecord().get('filteractive'));
            }
        });
    },

    //checks checks if a query is editable by the current user
    isQueryReadonly: function(query) {
        var qmst = query.get('messStellesIds');
        if (qmst === null) {
            return true;
        }
        for (var i=0; i < Lada.mst.length; i++) {
            if (qmst.indexOf(Lada.mst[i]) >= 0) {
                return false;
            }
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
    }

});
