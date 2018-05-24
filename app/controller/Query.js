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
        'Lada.store.GridColumn'
    ],

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
        if (query.phantom) {
            qp.store.remove(query);
        }
        //check permission to delete
        if (query.get('userId') === Lada.userId ) {

            // else TODO: send a DELETE request to /rest/query?id=query.get('id')
            var combobox = qp.down('combobox[name=selectedQuery]');
            var firstEntry = qp.getStore().getAt(0);
            if (!firstEntry) {
                qp.down('checkbox[name=ownqueries]').setValue(false);
                firstEntry = qp.getStore().getAt(0);
            }
            combobox.select(qp.getStore().getAt(0));
            qp.down('fieldset[name=querydetails]').collapse();
        } else {
            Ext.Msg.alert('','Query nicht gelöscht');
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
                if (groupstore.findRecord('messStelle', Lada.mst[j]) === null) {
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
        var record = qp.getForm().getRecord();
        if (record.phantom) {
            record.set('id', null);
            record.set('userId', Lada.userId);
        }
        if (record.get('userId') === Lada.userId) {
            if (record.phantom) {
                record.set('id', null);
            }
            record.save({
                success: function(rec, response) {
                    var columns = qp.gridColumnStore.getData().items;
                    for (var i=0; i < columns.length; i++) {
                        if (columns[i].phantom) {
                            columns[i].set('id', null);
                        }
                        columns[i].save();
                        //TODO callbacks: report errors
                    }
                },
                failure: function(rec, response) {
                    //TODO error handling
                }
            });
        } else {
            //TODO error handling
        }
        button.up('querypanel').down('fieldset[name=querydetails]').setCollapsed(true);
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
            Ext.Ajax.request({
                url: 'lada-server/rest/universal',
                jsonData: jsonData,
                method: 'POST',
                success: function(response) {
                    if (response.responseText) {
                        var responseData = Ext.JSON.decode(response.responseText).data;
                        var contentPanel = button.up('panel[name=main]').down(
                            'panel[name=contentpanel]');
                        contentPanel.removeAll();
                        var resultGrid = Ext.create('Lada.view.widget.DynamicGrid', {
                            selModel: Ext.create('Ext.selection.CheckboxModel', {
                                checkOnly: true,
                                injectCheckbox: 1
                            })
                        });
                        resultGrid.setStore(
                            Ext.data.StoreManager.get('genericresults')
                        );
                        resultGrid.setup(gcs, fixColumnStore);
                        resultGrid.store.removeAll();
                        resultGrid.store.add(responseData);
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
                recs[i].get('gridColumnId'));
            var dt = fixcolumn.get('dataType');
            var field = null;
            switch (dt.name) {
                case 'text':
                case 'probeId':
                case 'messungId':
                case 'ortId':
                    field = Ext.create('Ext.form.field.Text', {
                        name: fixcolumn.get('dataIndex'),
                        fieldLabel: fixcolumn.get('name'),
                        labelWidth: 125,
                        margin: 5,
                        width: '100%',
                        value: recs[i].get('filterValue') || '',
                        triggers: {
                            clear: {
                                extraCls: 'x-form-clear-trigger',
                                handler: function() {
                                    this.setValue('');
                                }
                            }
                        }
                    });
                    break;
                case 'date':
                    field = Ext.create('Lada.view.widget.base.DateRange', {
                        name: fixcolumn.get('dataIndex'),
                        labelWidth: 125,
                        fieldLabel: fixcolumn.get('name'),
                        width: '100%',
                        triggers: {
                            clear: {
                                extraCls: 'x-form-clear-trigger',
                                handler: function() {
                                    this.setValue(',');
                                }
                            }
                        }
                    });
                    field.setValue(recs[i].get('filterValue'));
                    break;
                case 'number':
                    field = Ext.create('Lada.view.widget.base.NumberField', {
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
                    });
                    break;
                case 'geom':// TODO: how/if to implement
                default:
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
                var rec = store.findRecord('dataIndex', oldvalue[i]);
                if (rec) {
                    rec.set('filterActive',false);
                }
            }
        }
        for (var j= 0 ; j < newvalue.length; j++) {
            var nrec = store.findRecord('dataIndex', newvalue[j]);
            if (!nrec) {
                var fixrecord = cs.findRecord('dataIndex', newvalue[j]);
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
            var rec = store.findRecord('dataIndex', name);
            rec.set('filterValue', newvalue);
        }
    },

    dateValueChanged: function(box, newvalue, oldvalue) {
        var store = box.up('querypanel').gridColumnStore;
        var widget = box.up().up();
        var rec = store.findRecord('dataIndex', widget.name);
        rec.set('filterValue', widget.getValue());
    },

    loadGridColumnStore: function(element) {
        var panel = element.up('querypanel');
        var gcs = Ext.create('Lada.store.GridColumn');
        gcs.proxy.extraParams = {
            'queryUserId': panel.getForm().getRecord().get('id')
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
