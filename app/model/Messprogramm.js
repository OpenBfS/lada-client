/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * A Messprogramm.
 * This class represents and defines the model of a 'Messprogramm'
 **/
Ext.define('Lada.model.Messprogramm', {
    extend: 'Lada.model.LadaBase',

    hasMany: 'ProbenZusatz',

    fields: [{
        name: 'id'
    }, {
        name: 'test',
        type: 'boolean'
    }, {
        name: 'mstId'
    }, {
        name: 'laborMstId'
    }, {
        name: 'kommentar',
        allowNull: true
    }, {
        name: 'datenbasisId',
        type: 'int'
    }, {
        name: 'mplId',
        type: 'int',
        allowNull: true
    }, {
        name: 'aktiv',
        type: 'boolean'
    }, {
        name: 'baId',
        type: 'int',
        allowNull: true
    }, {
        name: 'mediaDesk',
        allowNull: true
    }, {
        name: 'umwId',
        allowNull: true
    }, {
        name: 'mehId',
        type: 'int',
        allowNull: true
    }, {
        name: 'probenartId',
        type: 'int'
    }, {
        name: 'probenintervall'
    }, {
        name: 'teilintervallVon',
        type: 'int'
    }, {
        name: 'teilintervallBis',
        type: 'int'
    }, {
        name: 'intervallOffset',
        type: 'int'
    }, {
        /* day of year is 0-base in ExtJS, but 1-based in Java.
         * Thus, we expect 1-based values here. */
        name: 'gueltigVon',
        type: 'int'
    }, {
        name: 'gueltigBis',
        type: 'int'
    }, {
        name: 'probeNehmerId',
        type: 'int',
        allowNull: true
    }, {
        name: 'probeKommentar',
        allowNull: true
    }, {
        name: 'probenahmeMenge',
        allowNull: true
    }, {
        name: 'referenceCount',
        type: 'int'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'media',
        persist: false
    }, {
        name: 'owner',
        type: 'boolean',
        persist: false
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/messprogramm',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allDataOptions: {
                persist: true,
                associated: true
            }
        }
    }
});
