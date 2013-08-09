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

        // Setup Columns of the probenlist
        if (filterFields.length > 0) {
            var items = filters.items.items;
            for (var i=0; i < items.length; i++) {
                var filtername = items[i].id;
                items[i].hide();
                for (var j=0; j < filterFields.length; j++) {
                    if ('filter-'+filterFields[j] === filtername) {
                        items[i].show();
                    };
                };

            };
            filters.show();
        } else {
            filters.hide();
        };
        buttons.show();
    },
    /**
     * Function is called when the user clicks the search button. The function
     * will perform a search to the server on refreshes the result list.
     */
    search: function(element, record, index) {
        var result = Ext.getCmp('result');
        console.log('Loading store');

        // Get search parameters:
        var searchParams = {};
        if (Ext.getCmp('search').getValue() == 1) {
            var mst = Ext.getCmp('filter-mstId').getValue();
            var uwb = Ext.getCmp('filter-umwId').getValue();
            if (mst !== null) {
                searchParams['mstId'] = mst;
            }
            if (uwb !== null) {
                searchParams['umwId'] = uwb;
            }
        } else {
            // Get date object an convert it into a timestamp (ms since epoch)
            var datefield = Ext.getCmp('filter-pbegin').getValue();
            if (datefield !== null) {
                var ts = Ext.getCmp('filter-pbegin').getValue().getTime();
                searchParams['begin'] = ts;
            }
        }
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
