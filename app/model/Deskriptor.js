/**
 *
 */
Ext.define('Lada.model.Deskriptor', {
    extend: 'Ext.data.Model',

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
        url: 'lada-server/deskriptor',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'totalCount'
        }
    }
});
