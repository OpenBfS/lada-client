Ext.define('Lada.controller.Proben', {
    extend: 'Ext.app.Controller',
    views: [
        'proben.List'
    ],
    stores: [
        'Proben'
    ],
    models: [
        'Probe'
    ],
    init: function() {
        console.log('Initialising the Proben controller');
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            'viewport > probenlist': {
                // Map the "render" event to the given function.
                render: this.onPanelRendered,
                // Map Doubleclick on rows of the probenlist.
                itemdblclick: this.editProbe
            }
        });
    },
    onPanelRendered: function() {
        console.log('The panel was rendered');
    },
    editProbe: function(grid, record) {
        console.log('Double click on ' + record.get('name'));
    }
});
