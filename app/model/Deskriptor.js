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
        name: 'bedeutung',
        allowNull: true
    }, {
        name: 'beschreibung',
        allowNull: true
    }, {
        name: 'ebene',
        type: 'int',
        allowNull: true
    }, {
        name: 'id'
    }, {
        name: 'sn',
        type: 'int',
        allowNull: true
    }, {
        name: 'sXx',
        type: 'int',
        allowNull: true
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
