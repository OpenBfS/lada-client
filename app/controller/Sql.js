var queries = new Array('query1', 'query2');

/**
 * Controller for the Search
 * This controller handles all logic related to the search
 */
Ext.define('Lada.controller.Sql', {
    extend: 'Ext.app.Controller',
    stores: [
        'Proben',    // List of found Proben
        'Queries'
    ],
    requires: [
        'Lada.view.widgets.Mst',
        'Lada.view.widgets.Uwb',
        'Lada.view.widgets.Datetime'
    ],
    init: function() {
        console.log('Initialising the Sql controller');
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            '#search': {
                // Map the "render" event to the given function.
                render: this.onPanelRendered,
                // Map Doubleclick on rows of the probenlist.
                select: this.selectSql
            },
            '#SearchBtn': {
                // Map click event on Button.
                click: this.search
            },
            '#ResetBtn': {
                // Map click event on Button.
                click: this.reset
            }
        });
    },
    onPanelRendered: function() {
        console.log('The panel was rendered');
    },
    /**
     * Function called when the user selects a SQL query in the dropdownlist.
     * The function will hide/display additional element related to the
     * selected search query
     */
    selectSql: function(element, record, index) {
        var result = Ext.getCmp('result');
        var filters = Ext.getCmp('queryfilters');
        var sqlquery = Ext.getCmp('sqlquery');
        var sqldesc = Ext.getCmp('sqldesc');
        var buttons = Ext.getCmp('SearchBtnPanel');
        var displayFields = record[0].data.results;
        var filterFields = record[0].data.filters;

        this.reset();

        sqlquery.setValue(record[0].data.sql);
        sqldesc.setValue(record[0].data.description);

        // Setup Columns of the probenlist
        result.setupColumns(displayFields);

        // Setup Filters of the probenlist
        //
        // Allowed types are
        // * text
        // * number
        // * datetime
        // * listmst
        // * listumw
        //
        // Iterate over all configured filters and add filters dynamically
        //
        // 1. Empty filters
        filters.removeAll();
        var hide = true;
        // 2. Iterate over all configured filters
        for (var j=0; j < filterFields.length; j++) {
            var type = filterFields[j].type;
            var name = filterFields[j].dataIndex;
            var label = filterFields[j].label;
            var field = null;
            if (type == "text") {
                console.log("Found text filter");
                field = Ext.create('Ext.form.field.Text', { name: name, fieldLabel: label });
            } else if (type == "number") {
                console.log("Found number filter");
                field = Ext.create('Ext.form.field.Number', { name: name, fieldLabel: label });
            } else if (type == "datetime") {
                console.log("Found datetime filter");
                field = Ext.create('Lada.view.widgets.Datetime', { name: name, fieldLabel: label });
            } else if (type == "listmst") {
                console.log("Found listmst filter");
                field = Ext.create('Lada.view.widgets.Mst', { name: name, fieldLabel: label });
            } else if (type == "listumw") {
                console.log("Found listumw filter");
                field = Ext.create('Lada.view.widgets.Uwb', { name: name, fieldLabel: label });
            }
            if (field) {
                console.log("Pushing field to filters");
                filters.add(field);
                filters.show();
                hide = false;
            }
        }
        if (hide) {
            filters.hide();
        }
        buttons.show();
    },
    /**
     * Function is called when the user clicks the search button. The function
     * will perform a search to the server on refreshes the result list.
     */
    search: function(element, record, index) {
        var result = Ext.getCmp('result');
        var filters = Ext.getCmp('queryfilters');
        var search = Ext.getCmp('search');

        // Get search parameters:
        var searchParams = {};
        searchParams['qid'] = search.getValue();
        for (var i = filters.items.length - 1; i >= 0; i--){
            var filter = filters.items.items[i];
            var value = filter.getValue();
            searchParams[filter.getName()] = filter.getValue();
        }
        console.log('Loading store with the following search params: ' + searchParams);
        result.getStore().load({
            params: searchParams
        });
        console.log('Store loaded');
        result.show();
    },
    reset: function(element, record, index) {
        var buttons = Ext.getCmp('SearchBtnPanel');
        var result = Ext.getCmp('result');
        //for (var i = 0; i < queries.length; ++i) {
        //    var toHide = Ext.getCmp(queries[i]);
        //    toHide.hide();
        //}
        //result.hide();
        //buttons.hide();
    }
});
