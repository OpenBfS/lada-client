Ext.define('Lada.store.Testdatensatz', {
    extend: 'Ext.data.Store',
    fields: ['testdatensatzId', 'testdatensatz'],
    autoLoad: true,
    data: [
        {"testdatensatzId":true, "testdatensatz":"Ja"},
        {"testdatensatzId":false, "testdatensatz":"Nein"}
    ]
});
