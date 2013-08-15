Ext.define('Lada.controller.Zusatzwerte', {
    extend: 'Lada.controller.Base',
    views: [
        'zusatzwerte.Create'
    ],
    stores: [
        'Zusatzwerte',
        'Probenzusatzwerte',
        'Messeinheit'
    ],
    init: function() {
        console.log('Initialising the Zusatzwerte controller');
        this.callParent();
    },
    addListeners: function() {
        this.control({
            'zusatzwertelist': {
                itemdblclick: this.editZusatzwert
            },
            'zusatzwertelist toolbar button[action=add]': {
                click: this.addZusatzwert
            },
            'zusatzwertelist toolbar button[action=delete]': {
                click: this.deleteZusatzwert
            },
            'zusatzwertecreate form': {
                savesuccess: this.createSuccess,
                savefailure: this.createFailure
            },
            'zusatzwertecreate button[action=save]': {
                click: this.saveZusatzwert
            },
            'zusatzwerteedit form': {
                savesuccess: this.editSuccess,
                savefailure: this.editFailure
            }
        });
    },
    addZusatzwert: function(button) {
        console.log('Adding new Zusatzwert for Probe' + button.probeId);
        var zusatzwert = Ext.create('Lada.model.Zusatzwert');
        zusatzwert.set('probeId', button.probeId);
        var view = Ext.widget('zusatzwertecreate', {model: zusatzwert});
    },
    editZusatzwert: function(grid, record) {
        console.log('Editing Zusatzwert');
        record.getAuthInfo(this.initEditWindow)
        console.log("Loaded Zusatzwert with ID " + record.getId()); //outputs ID
    },
    initEditWindow: function(record, readonly, owner) {
        var view = Ext.widget('zusatzwertecreate', {model: record});
        // Mark PZW Selection readonly.
        view.down('probenzusatzwert').disabled = true;
        var ignore = Array();
        if (readonly) {
            var form = view.down('form');
            form.setReadOnly(true, ignore);
        }
    },
    createSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getZusatzwerteStore();
        store.reload();
        var win = form.up('window');
        win.close();
    },
    editSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getZusatzwerteStore();
        store.reload();
        var win = form.up('window');
        win.close();
    }
});
