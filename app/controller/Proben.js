Ext.define('Lada.controller.Proben', {
    extend: 'Ext.app.Controller',
    init: function() {
        console.log('Initialising the Proben controller');
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            'viewport > panel': {
                // Map the "render" event to the given function.
                render: this.onPanelRendered
            }
        });
    },
    onPanelRendered: function() {
        console.log('The panel was rendered');
    }
});
