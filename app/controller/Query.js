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
            }
        });
    },

    listAllQueries: function(checkbox, newval) {
        checkbox.resetOriginalValue(); // avoids field being cleaned on reset
        if (newval === false) {
            checkbox.up('querypanel').getStore().clearFilter();
        } else {
            //TODO: currently selected may disappear from visible store!
            checkbox.up('querypanel').getStore().filter(
                'owner', 'Testlabor_4'); // TODO dummy entry!
        }
    },

    cloneQuery: function(button) {
        var panel = button.up('panel');
        var cbox = panel.down('combobox[name=selectedQuery]');
        var cquery = cbox.getStore().getById(cbox.getValue());
        var newgroups = cquery.get('groups');
        if (newgroups.indexOf('Testlabor_4') < 0) {
            newgroups.push('Testlabor_4');
        }
        var newrecord = Ext.create('Lada.model.DummyQuery',{
            basequery: cquery.get('basequery'),
            id: cbox.getStore().totalCount + 11,
            name: cquery.get('name') + ' (Kopie)',
            owner: 'Testlabor_4',
            groups: newgroups,
            columns: cquery.get('columns')
        });
        panel.getStore().add([newrecord]);
        cbox.setStore(panel.getStore());
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
        //check permission to delete
        if (query.get('owner') === 'Testlabor_4') { //TODO dummy data!
            if (query.phantom) {
                qp.getStore().remove(query);
            }
            // else TODO: send a deletion request
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
        var newquery = qp.getStore().getById(combobox.getValue());
        qp.getForm().loadRecord(newquery);
        if (newquery.get('owner') === 'Testlabor_4') {//hardcoded dummy data
            qp.down('button[action=delquery]').setDisabled(false);
            qp.down('button[action=save]').setDisabled(false);
        } else {
            qp.down('button[action=delquery]').setDisabled(true);
            qp.down('button[action=save]').setDisabled(true);
        }
        var cs = Ext.data.StoreManager.get('columnstore');
        cs.proxyextraParams.qid = newquery.get('id');
        cs.load(function() {
            qp.setColumnStore(cs);
        });
    },

    saveQuery: function(button) {
        Ext.Msg.alert('Query gespeichert','Speicherung der gesamten Query- noch nciht implementiert');
        //TODO:
        // check for uniqueness of name/owner
        // validate fields.
        // convert columns and column.filters
        //send to server, wait for callback, reload availableQueriesstore
        button.up('querypanel').down('fieldset[name=querydetails]').setCollapsed(true);
    },

    reset: function(button) {
        var panel = button.up('querypanel'); //Reset does not work here
        panel.getForm().reset();
    },

    /**
     * change data modified in derived stores in the main column store, too
     * Expects a Lada.model.Column
     */
    changeQueryParameter: function(element, property, data, newvalue) {

        var panel = element.up('querypanel');
        var origentry = panel.store.getById(data.get('id'));
        origentry.set(property, newvalue);
    },

    search: function(button) {
        Ext.Msg.alert('', 'Suche - TODO');
        //search. See existing controller (filterresult etc.)
    },

    showFilter: function(combo) {
        var panel = combo.up('querypanel');
        filtervalues.removeAll();
        var recs = panel.getStore().getData();
        for (var i= 0; i< recs.length; i++) {
            var gcv = recs[i].get('gridColumValues');
            var dt = recs[i].get('datatype');
            switch (dt) {
                case '1': // 'text':
                case '4': // probeId
                case '5': // messungId
                case '6': // ortId

                    field = Ext.create('Ext.form.field.Text', {
                        name: recs[i].get('dataIndex'),
                        fieldLabel: recs[i].get('name'),
                        labelWidth: 125,
                        margin: 5,
                        width: '100%',
                        value: gcv.filterValue || '',
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
                case '2': //'date':
                    field = Ext.create('Lada.view.widget.base.DateRange', {
                        name: recs[i].get('dataIndex'),
                        labelWidth: 125,
                        fieldLabel: recs[i].get('name'),
                        value: gcv.filterValue || null,
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
                case '3': //'number'
                    field = Ext.create('Lada.view.widget.base.NumberField', {
                        name: recs[i].get('dataIndex'),
                        labelWidth: 125,
                        fieldLabel: recs[i].get('name'),
                        value: gcv.filterValue || null,
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
                case '7':// 7 geom TODO: how/if to implement
                default:
                    break;
            }
            if (field) {
                filtervalues.add(field);
            }
        }
    },

    activeFiltersChanged: function(box, newvalue, oldvalue) {
        var store = box.up('querypanel').getStore();
        for (var i=0; i< oldvalue.length; i++) {
            if (newvalue.indexOf(oldvalue[i]) < 0) {
                var rec = store.findRecord('dataIndex', oldvalue[i]);
                var gcv = rec.get('gridColumValues');
                gcv['filteractive'] = false;
                rec.set('gridColumValues', gcv);
            }
        }
        for (var j= 0 ; j < newvalue.length; newvalue ++) {
            var nrec = store.findRecord('dataIndex', newvalue[j]);
            var ngcv = nrec.get('gridColumValues');
            ngcv['filteractive'] = true;
            nrec.set('gridColumValues', ngcv);
        }
        this.showFilter(box);
    }
});
