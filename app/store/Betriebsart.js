Ext.define('Lada.store.Betriebsart', {
    extend: 'Ext.data.Store',
    fields: ['betriebsartId', 'betriebsart'],
    autoLoad: true,
    // This might be implemented later. Table in database is missing.
    //proxy: {
    //    type: 'ajax',
    //    api: {
    //    read: 'server/rest/probenart'
    //    },
    //    reader: {
    //        type: 'json'
    //    }
    //}
    data: [
        {"betriebsartId":"1", "betriebsart":"Normal-/Routinebtrieb"},
        {"betriebsartId":"2", "betriebsart":"Störfall/Intensivbetrieb"}
    ]
});

