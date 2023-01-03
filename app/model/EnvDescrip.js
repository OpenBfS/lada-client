/**
 *
 */
Ext.define('Lada.model.EnvDescrip', {
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
});
