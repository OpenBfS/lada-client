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
        if (newVal === true){
            checkbox.up('panel').down('selectedQuery').store.clearFilter();
        }
        else {
            //TODO: currently selected may disappear from visible store!
        checkbox.up('panel').down('selectedQuery').store.clearFilter();
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
        button.up('querypanel').down('fieldset[name.querydetails').collapsed = false;
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
        // Details need to be filed, expanded or not
        // FilterQueries need to be updated
    },

    saveQuery: function(button){
        // check for uniqueness of name/owner
        //send to server, wait for callback, reload availableQueriesstore
    },

    reset: function (button){
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
