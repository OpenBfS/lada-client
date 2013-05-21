var queries = new Array('query1', 'query2');
Ext.define('Lada.controller.Sql', {
    extend: 'Ext.app.Controller',
    views: [
        'search.List'
    ],
    stores: [
        'Sql'
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
        var selection = element.getValue() - 1;
        console.log('Selected SQL ' + selection);
        for (var i = 0; i < queries.length; ++i) {
            var toHide = Ext.getCmp(queries[i]);
            toHide.hide();
        }
        var toShow = Ext.getCmp(queries[selection]);
        var buttons = Ext.getCmp('SearchBtnPanel');
        this.reset();
        toShow.show();
        buttons.show();
    },
    search: function(element, record, index) {
        var result = Ext.getCmp('result');
        console.log('Loading store');
        result.getStore().load();
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
        result.hide();
        buttons.hide();
    }
});
