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
        name: 'implication',
        allowNull: true
    }, {
        name: 'name',
        allowNull: true
    }, {
        name: 'lev',
        type: 'int',
        allowNull: true
    }, {
        name: 'id'
    }, {
        name: 'levVal',
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
        url: 'lada-server/rest/envdescrip',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    }
});
