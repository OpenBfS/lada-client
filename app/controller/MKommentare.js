Ext.define('Lada.controller.MKommentare', {
    extend: 'Lada.controller.Kommentare',
    stores: [
        'MKommentare'
    ],
    models: [
        'MKommentar'
    ],
    addKommentar: function(button) {
        console.log('Adding new Kommentar for Messung ' + button.parentId + ' Probe ' + button.probeId);
        var kommentar = Ext.create('Lada.model.MKommentar');
        kommentar.set('probeId', button.probeId);
        kommentar.set('messungsId', button.parentId);
        var view = Ext.widget('kommentarecreate', {model: kommentar});
    },
    createSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getMKommentareStore();
        store.reload();
        var win = form.up('window');
        win.close();
    },
    editSuccess: function(form, record, operation) {
        // Reload store
        var store = this.getMKommentareStore();
        store.reload();
        var win = form.up('window');
        win.close();
    }
});
