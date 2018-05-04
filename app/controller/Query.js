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
            checkbox.up('querypanel').store.filter('userId', 0); //TODO dummy value
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
            owner: null, //TODO: 'myself'
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
        if (query.get('userId') === 1) { //TODO dummy data! Should not work yet
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
        if (newquery.get('owner') === true) {
            qp.down('button[action=delquery]').setDisabled(false);
            qp.down('button[action=save]').setDisabled(false);
        } else {
            qp.down('button[action=delquery]').setDisabled(true);
            qp.down('button[action=save]').setDisabled(true);
        }
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

    search: function(button) {
        var cs = button.up('querypanel').gridColumnStore;
        var cols = cs.getData().items;
        var columns = [];
        for (var i= 0; i < cols.length; i++) {
            if (cols[i].get('filterActive') === true
            || cols[i].get('visible') === true) {
                columns.push(cols[i].getData());
            }
        }
        Ext.Ajax.request({
            url: 'lada-server/rest/universal',
            method: 'GET',
            jsonData: {'columns': columns },
            scope: this,
            success: this.createResultGrid
        });
    },

    showFilter: function(combo) {
        var panel = combo.up('querypanel');
        var queryno = panel.down('combobox[name=selectedQuery]').getValue;
        var fixColumn = Ext.data.StoreManager.get('columnstore');
        var fcr = fixColumn.findRecord('id', queryno);
        var fvpanel = panel.down('panel[name=filtervalues]');
        fvpanel.removeAll(true);
        var recs = panel.gridColumnStore.getData().items;
        for (var i= 0; i < recs.length; i++) {
            if (recs[i].get('filterActive') !== true) {
                continue;
            }
            var dt = fcr.get('dataType');
            var field = null;
            switch (dt) {
                case 1: // 'text'
                case 4: // probeId
                case 5: // messungId
                case 6: // ortId
                    field = Ext.create('Ext.form.field.Text', {
                        name: fcr.get('dataIndex'),
                        fieldLabel: fcr.get('name'),
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
                case 2: //'date':
                    field = Ext.create('Lada.view.widget.base.DateRange', {
                        name: fcr.get('dataIndex'),
                        labelWidth: 125,
                        fieldLabel: fcr.get('name'),
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
                case 3: //'number'
                    field = Ext.create('Lada.view.widget.base.NumberField', {
                        name: fcr.get('dataIndex'),
                        labelWidth: 125,
                        fieldLabel: fcr.get('name'),
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
                case 7:// 7 geom TODO: how/if to implement
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
        var name = box.up('panel').name;
        // TODO: check nesting for each type
        var rec = store.findRecord('dataIndex', name);
        rec.set('filterValue', newvalue);
    },

    createResultGrid: function(response) {
        return true;
        //TODO not yet implemented
    }
});
