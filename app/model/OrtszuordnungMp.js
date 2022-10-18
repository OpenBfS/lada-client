/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Ortszuordnung of Messprogramme
 */
Ext.define('Lada.model.OrtszuordnungMp', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'ortId',
        type: 'int'
    }, {
        name: 'messprogrammId',
        type: 'int'
    }, {
        name: 'ortszuordnungTyp',
        allowNull: true
    }, {
        name: 'ortszusatztext',
        allowNull: true
    }, {
        name: 'ozId',
        allowNull: true
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'treeModified',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'copyOf',
        persist: false
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/ortszuordnungmp',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});

