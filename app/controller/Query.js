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
        'Lada.view.widget.base.DateRange'
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
            },
            'querypanel panel[name=filtervalues] datefield': {
                change: me.filterValueChanged
            }

        });
    },

    listAllQueries: function(checkbox, newval) {
        checkbox.resetOriginalValue(); // avoids field being cleaned on reset
        if (newval === false) {
            checkbox.up('querypanel').store.clearFilter();
        } else {
            //TODO: currently selected may disappear from visible store!
            checkbox.up('querypanel').store.filter('userId', Lada.userId);
        }
    },

    cloneQuery: function(button) {
        var panel = button.up('panel');
        var cbox = panel.down('combobox[name=selectedQuery]');
        var cquery = cbox.getStore().getById(cbox.getValue());
        // var newgroups = cquery.get('groups');
        // if (newgroups.indexOf('Testlabor_4') < 0) {
        //     newgroups.push('Testlabor_4');
        // }
        var newrecord = Ext.create('Lada.model.Query',{
            baseQuery: cquery.get('baseQuery'),
            name: cquery.get('name') + ' (Kopie)',
            userId: Lada.userId,
            description: cquery.get('description')
            // groups: newgroups TODO
        });
        panel.getStore().add([newrecord]);
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
        qp.getForm().loadRecord(newquery);
        qp.setGridColumnStore(newquery);
        if ( newquery.get('userId') === Lada.userId) {
            qp.down('button[action=delquery]').setDisabled(false);
            qp.down('button[action=save]').setDisabled(false);
        } else {
            qp.down('button[action=delquery]').setDisabled(true);
            qp.down('button[action=save]').setDisabled(true);
        }
    },

    saveQuery: function(button) {
        var qp = button.up('querypanel');
        var record = qp.getForm().getRecord();
        if (record.phantom) {
            record.set('id', null);
        }
        if (record.get('userId') === Lada.userId) {
            record.save({
                success: function(rec, response) {
                    // TODO: save and reload column values, too
                    qp.getForm().loadRecord(rec);
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
        panel.getForm().reset();
        //TODO: reset columnstore and dependencies, too.
    },

    search: function(button) {
        var cs = button.up('querypanel').gridColumnStore;
        var jsonData = {columns: []};
        var csdata = cs.getData().items;
        for (var i=0; i < csdata.length; i++ ) {
            if (csdata[i].get('visible') === true ||
                csdata[i].get('filterActive') === true ) {
                jsonData.columns.push({
                    gridColumnId: csdata[i].get('gridColumnId'),
                    filterActive: csdata[i].get('filterActive'),
                    filterValue: csdata[i].get('filterValue'),
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
            var fixColumnStore = Ext.data.StoreManager.get('columnstore'); // TODO filter by queryno

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
                            }),
                            store: Ext.data.StoreManager.get('genericresults')
                        });
                        resultGrid.setup(cs, fixColumnStore);
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
        var fixColumnStore = Ext.data.StoreManager.get('columnstore'); // TODO filter by queryno

        var fvpanel = panel.down('panel[name=filtervalues]');
        fvpanel.removeAll(true);
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
        var store = box.up('querypanel').gridColumnStore;
        for (var i=0; i < oldvalue.length; i++) {
            if (newvalue.indexOf(oldvalue[i]) < 0) {
                var rec = store.findRecord('dataIndex', oldvalue[i]);
                rec.set('filterActive',false);
            }
        }
        for (var j= 0 ; j < newvalue.length; j++) {
            var nrec = store.findRecord('dataIndex', newvalue[j]);
            nrec.set('filterActive', true);
        }
        this.showFilter(box);
    },

    filterValueChanged: function(box, newvalue, oldvalue) {
        var store = box.up('querypanel').gridColumnStore;
        var name = box.name;
        // TODO: daterange still fails here not work as expected
        var rec = store.findRecord('dataIndex', name);
        rec.set('filterValue', newvalue);
    }
});
