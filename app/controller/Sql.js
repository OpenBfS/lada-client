Ext.define('Lada.controller.Sql', {
    extend: 'Ext.app.Controller',
    views: [
        'sql.List'
    ],
    stores: [
        'Sql'
    ],
    init: function() {
        console.log('Initialising the Sql controller');
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            'viewport > sqllist': {
                // Map the "render" event to the given function.
                render: this.onPanelRendered,
                // Map Doubleclick on rows of the probenlist.
                itemclick: this.selectSql
            }
        });
    },
    onPanelRendered: function() {
        console.log('The panel was rendered');
    },
    selectSql: function(grid, record) {
        console.log('Selected SQL ' + record.get('id'));
    }
});
