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
            'querypanel checkbox[name=allqueries]': {
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
            'querypanel button[action=save]':{
                click: me.saveQuery
            },
            'querypanel button[action=reset]':{
                click: me.reset
            },
            'querypanel button[action=search]':{
                click: me.search
            },
            'querypanel cbox[name=activefilters] tagfield': {
                 change: me.activeChanged
            }
        });
    },

    listAllQueries: function(checkbox, newval){
        checkbox.resetOriginalValue(); //avoids field being cleaned on reset
        if (newval === true){
            checkbox.up('panel').down('combobox[name=selectedQuery]').store.clearFilter();
        }
        else {
            //TODO: currently selected may disappear from visible store!
            checkbox.up('panel').down(
                'combobox[name=selectedQuery]').store.filter(
                'owner', 'Testlabor_4'); //TODO dummy entry!
        }
    },

    cloneQuery: function(button){
        var panel =  button.up('panel');
        var cbox = panel.down('combobox[name=selectedQuery]');
        var cquery = cbox.getStore().getById(cbox.getValue());
        var newgroups = cquery.get('groups');
        if (newgroups.indexOf('Testlabor_4') < 0){
            newgroups.push('Testlabor_4')
        };
        var newrecord = Ext.create('Lada.model.DummyQuery',{
            basequery: cquery.get('basequery'),
            id: cbox.getStore().totalCount + 11,
            name : cquery.get('name') + ' (Kopie)',
            owner: 'Testlabor_4',
            groups: newgroups,
            columns: cquery.get('columns')
        });
        cbox.getStore().add([newrecord]);
        cbox.select(newrecord);
        this.changeCurrentQuery(cbox);
        panel.down('fieldset[name=querydetails]').setCollapsed(false);
    },

    expandDetails: function(button){
        button.up('querypanel').down('fieldset[name=querydetails]').setCollapsed(false);
    },

    deleteQuery: function (button){
        var query = button.up('querypanel').getRecord();
        if (!query){
            return;
        }
        //check permission to delete
        if (query.get('owner') === 'Testlabor_4'){ //TODO dummy data!
            var combobox = button.up('querypanel').down('combobox[name=selectedQuery]');
            combobox.getStore().remove(query);
            var firstEntry = combobox.getStore().getAt(0);
            if (!firstEntry) {
                button.up('querypanel').down('checkbox[name=allqueries]').setValue(true);
                firstEntry = combobox.getStore().getAt(0);
            }
            combobox.select(combobox.getStore().getAt(0));
            button.up('querypanel').down('fieldset[name=querydetails]').collapse();
        } else {
            Ext.Msg.alert('','Query nicht gelöscht');
        }
    },

    changeCurrentQuery: function(combobox){
        var newquery = combobox.getStore().getById(combobox.getValue());
        this.resetQueryParameters(combobox, newquery);
    },

    saveQuery: function(button){
        Ext.Msg.alert('Query gespeichert','Query gespeichert');
        // check for uniqueness of name/owner
        //send to server, wait for callback, reload availableQueriesstore
    },

    reset: function (button){
        var panel =  button.up('querypanel'); //Reset does not work here
        var cbox = panel.down('combobox[name=selectedQuery]');
        var originalrecord = null;
        originalrecord = cbox.getStore().getById(cbox.getValue());
        this.resetQueryParameters(button, originalrecord);
    },

    resetQueryParameters: function(element, newquery){
        var panel = element.up('querypanel');
        panel.getForm().loadRecord(newquery);
        if (newquery.get('owner') === 'Testlabor_4') { //hardcoded dummy data
            panel.down('button[action=delquery]').setDisabled(false);
            panel.down('button[action=save]').setDisabled(false);
        } else {
            panel.down('button[action=delquery]').setDisabled(true);
            panel.down('button[action=save]').setDisabled(true);
        }
        panel.down('cbox[name=groups]').setValue(newquery.get('groups'));
        panel.down('columnchoser').setQuery(newquery);
    },

    search: function (button){
        Ext.Msg.alert('', 'Suche - TODO');
        //search. See existing controller (filterresult etc.)
    },

    showFilter: function(combo){
        var panel = combo.up('querypanel');

        var currentActive = panel.down('cbox[name=activefilters]').getValue();
        var filtervalues = panel.down('panel[name=filtervalues]');
        filtervalues.removeAll(); //excessive? Could be made more efficient by not deleting and reintroducing?
        var cols = panel.currentColumns.getRange();
        for (var i = 0; i < cols.length; i++){
            var col = cols[i];
            if (currentActive.indexOf(col.get('dataIndex')) > -1){
                col.set('filteractive', true);
                var field = null;
                var dt = col.get('dataType');
                switch(dt.name){
                    case 'text':
                        field = Ext.create('Ext.form.field.Text', {
                            name: col.get('dataIndex'),
                            fieldLabel: col.get('dataIndex'), //needs "beschreibung"
                            labelWidth: 125,
                            margin: 5,
                            width: '100%',
                            value: col.get('filter'),
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
                            name: col.get('dataIndex'),
                            labelWidth: 125,
                            fieldLabel: col.get('dataIndex'),
                            value: col.get('filter'),
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
                }
                if (field){
                    filtervalues.add(field);
                }
            } else {
                col.set('filteractive', false);
                col.set('filter', null);
            }
        }
    },

    setSortandFilterActive: function(me){
        var qpanel = me.up('querypanel');

        qpanel.down('cbox[name=activefilters]').setStore(qpanel.currentColumns);
        var cols = qpanel.currentColumns.getRange();
        var active = [];
        for (var i = 0; i< cols.length; i++){
            if (!cols[i].get('sort')){
                cols[i].set('sort', 'none');
            }
            if (cols[i].get('filteractive') === true){
                active.push(cols[i].get('dataIndex'));
            }
        }
        qpanel.down('columnsort').setStore(qpanel.currentColumns);
        qpanel.down('cbox[name=activefilters]').setValue(active);
    },

    activeChanged: function(box, newvalue){
        var colstore = box.up('querypanel').currentColumns;
        var cols = colstore.getRange();
        for (var i=0;i< cols.lentgh; i++){
            if (newvalue.indexOf(cols[i].get('dataIndex')) > -1){
                cols[i].setValue('filteractive', true);
            } else {
                cols[i].setValue('filteractive', false);
            }
        }
        box.up('querypanel').currentColumns = colstore;
        this.showFilter(box);
    }
});
