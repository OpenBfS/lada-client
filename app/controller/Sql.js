var queries = new Array('query1', 'query2');
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
    selectSql: function(element, record, index) {
        var result = Ext.getCmp('result');
        var selection = element.getValue() - 1;
        console.log('Selected SQL ' + selection);
        for (var i = 0; i < queries.length; ++i) {
            var toHide = Ext.getCmp(queries[i]);
            toHide.hide();
        }
        var toShow = Ext.getCmp(queries[selection]);
        var buttons = Ext.getCmp('SearchBtnPanel');
        this.reset();
        var displayFields = record[0].data.fields
        result.setupColumns(displayFields);
        toShow.show();
        buttons.show();
    },
    search: function(element, record, index) {
        var result = Ext.getCmp('result');
        console.log('Loading store');

        // Get search parameters:
        var searchParams = {};
        if (Ext.getCmp('search').getValue() == 1) {
            var mst = Ext.getCmp('mst').getValue();
            var uwb = Ext.getCmp('uwb').getValue();
            if (mst !== null) {
                searchParams['mstId'] = mst;
            }
            if (uwb !== null) {
                searchParams['umwId'] = uwb;
            }
        } else {
            // Get date object an convert it into a timestamp (ms since epoch)
            var datefield = Ext.getCmp('pbegin').getValue();
            if (datefield !== null) {
                var ts = Ext.getCmp('pbegin').getValue().getTime();
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
        for (var i = 0; i < queries.length; ++i) {
            var toHide = Ext.getCmp(queries[i]);
            toHide.hide();
        }
        //result.hide();
        //buttons.hide();
    }
});
