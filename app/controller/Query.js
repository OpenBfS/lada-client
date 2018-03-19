/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.controller.Query', {
    extend: 'Ext.app.Controller',

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
            'querypanel combobox[action=save]':{
                click: me.saveQuery
            },
            'querypanel combobox[action=reset]':{
                click: me.reset
            },
            'querypanel combobox[action=search]':{
                click: me.search
            },
            'querypanel targetGrid': {
                change: me.changeColumns
            },
            'querypanel tagfield[name=activefilters]': {
                 select: me.showFilter
            }
        });
    },

    listAllQueries: function(checkbox, newval){
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
    //currentquery = get(this.query)
    // Ext.create new Query based on currentquery
    // expand details
    // change name(?)
    // activate speichern button
    },

    expandDetails: function(button){
        // TODO check syntax
        button.up('querypanel').down('fieldset[name=querydetails]').setCollapsed(false);
    },

    deleteQuery: function (button){
        var query = button.up('querypanel').currentQuery;
        if (!currentQuery){
            return;
        }
        //check permission to delete
        if (currentQuery.owner === 'Testlabor_1'){ //TODO dummy data!
            //TODO: confirm message or just delete?
            // TODO Ext.message "this query is deleted from server"
            // delete query from querystore
            // reload store in selectedQuery
            // querystore.delete(currentQuery)
            //if querystore leer:
            // toggle "only local queries"
            // select Query[0]
            // collapse details
        } else{
            //error message needed?
        }
    },

    changeCurrentQuery: function(combobox){
        var newquery = combobox.getStore().getById(combobox.getValue());
        var panel = combobox.up('querypanel');
        panel.getForm().loadRecord(newquery);
        if (newquery.get('owner') === 'Testlabor_4') { //hardcoded dummy data
            panel.down('button[action=delquery]').setDisabled(false);
        } else {
            panel.down('button[action=delquery]').setDisabled(true);
        }
        panel.down('columnchoser').setQuery(newquery);


        // Details need to be filed, expanded or not
        // FilterQueries need to be updated
    },

    saveQuery: function(button){
        Ext.Msg.alert('Query gespeichert','Query gespeichert');
        // check for uniqueness of name/owner
        //send to server, wait for callback, reload availableQueriesstore
    },

    reset: function (button){
        button.up('querypanel').getForm().reset();
        Ext.Msg.alert('Query zurückgesetzt','Query zurückgesetzt');
                    // reload these details
                    // reload these filters
    },
    search: function (button){
                    //search. See existing controller (filterresult etc.)
    },

    changeColumns: function(button){
    //triggers sortgrid change
    // changes store of activeFilter and triggers showFilter
    //showFilter Filters that are not available anymore --> too jumpy?
    },

    showFilter: function(button){
    // fieldset filtervariables neubauen
    }
});
