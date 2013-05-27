Ext.define('Lada.controller.Proben', {
    extend: 'Ext.app.Controller',
    views: [
        'proben.List',
        'proben.Edit'
    ],
    stores: [
        'Proben',
        'Uwb',
        'Datenbasis',
        'Probenart',
        'Betriebsart',
        'Testdatensatz'
    ],
    models: [
        'Probe'
    ],
    init: function() {
        console.log('Initialising the Proben controller');
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            'probenlist': {
                // Map the "render" event to the given function.
                render: this.onPanelRendered,
                // Map Doubleclick on rows of the probenlist.
                itemdblclick: this.editProbe
            },
            'probenedit button[action=save]': {
                click: this.updateProbe
            }
        });
    },
    onPanelRendered: function() {
        console.log('The panel was rendered');
    },
    editProbe: function(grid, record) {
        console.log('Double click on ' + record.get('name'));
        // Create new window to edit the seletced record.
        var view = Ext.widget('probenedit');
        view.down('form').loadRecord(record);
    },
    updateProbe: function(button) {
        console.log('Click save');
        // We only have a reference to the button here but we really wnat to
        // get the form and the window. So first get the window and form and
        // the the record an values.
        var win = button.up('window');
        var form = win.down('form');
        var record = form.getRecord();
        var values = form.getValues();

        record.set(values);
        win.close();
        // synchronize the store after editing the record
        // NOTE: The function 'getProbenStore' will be generated
        // dynamically based on the Name of the configured Store!!!
        this.getProbenStore().sync();
    }
});
