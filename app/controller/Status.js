Ext.define('Lada.controller.Status', {
    extend: 'Lada.controller.Base',
    views: [
        'status.Create'
    ],
    stores: [
        'Status'
    ],
    init: function() {
        console.log('Initialising the Status controller');
        this.callParent();
    },
    addListeners: function() {
        this.control({
            'statuslist': {
                itemdblclick: this.editItem
            },
            'statuslist toolbar button[action=add]': {
                click: this.addItem
            },
            'statuslist toolbar button[action=delete]': {
                click: this.deleteItem
            },
            'statuscreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            },
            'statuscreate button[action=save]': {
                click: this.saveItem
            },
            'statusedit form': {
                savesuccess: this.editSuccess,
                savefailure: this.editFailure
            }
        });
    },
    addItem: function(button) {
        console.log('Adding new Status for Messung ' + button.parentId + ' in Probe ' + button.probeId);
        var zusatzwert = Ext.create('Lada.model.Status');
        zusatzwert.set('probeId', button.probeId);
        zusatzwert.set('messungsId', button.parentId);
        var view = Ext.widget('statuscreate', {model: zusatzwert});
    },
    editItem: function(grid, record) {
        console.log('Editing Status');
        var view = Ext.widget('statuscreate', {model: record});
        console.log("Loaded Status with ID " + record.getId()); //outputs ID
    },
    createSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getStatusStore();
        store.reload();
        var win = form.up('window');
        win.close();
    },
    editSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getStatusStore();
        store.reload();
        var win = form.up('window');
        win.close();
    },
});
