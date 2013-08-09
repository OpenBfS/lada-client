Ext.application({

    // Name of the application. Do not change as this name is used in
    // references!
    name: 'Lada',

    // Setting up translations. This is done using a ext-plgin which can be
    // found on https://github.com/elmasse/Ext.i18n.Bundle
    requires: ['Ext.i18n.Bundle', 'Lada.lib.Helpers'],
    bundle: {
        bundle: 'Lada',
        lang: 'de-DE',
        path: 'resources',
        noCache: true
    },

    // Setting this variable to true triggers loading the Viewport.js
    // file which sets ob the viewport.
    autoCreateViewport: true,

    // Start the application.
    launch: function() {
        console.log('Launching the application');
    },

    // Define the controllers of the application. They will be initialized
    // first before the application "launch" function is called.
    controllers: [
        'Sql',
        'Proben',
        'Zusatzwerte',
        'Kommentare',
        'MKommentare',
        'Orte',
        'Messungen',
        'Messwert',
        'Status'
    ]
});

Ext.data.writer.Json.override({
    getRecordData: function(record, getEverything) {
        if(this.writeEverything || record.writeEverything){
            console.log('getRecordData', this,arguments);
            return record.getAllData();
        } else {
            return this.callOverridden(arguments);
        }
    }
});

Ext.data.Model.addMembers({
    getAllData: function() {
        var data1 = this.getData();
        var data2 = this.getAssociatedData( );
        var dataMerged = Ext.Object.merge(data1, data2);
        return dataMerged;
    },
    getEidi: function() {
        return "/" + this.getId();
    }
});
