/**
 *
 */
Ext.define('Lada.model.Deskriptor', {
    extend: 'Lada.model.LadaBase',

    /**
     * Fields are:
     *  - ...
     */
    fields: [{
        name: 'bedeutung'
    }, {
        name: 'beschreibung'
    }, {
        name: 'ebene'
    }, {
        name: 'id'
    }, {
        name: 'sn'
    }, {
        name: 'sXx'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/deskriptor',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});
