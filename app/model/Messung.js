/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Messungen
 */
Ext.define('Lada.model.Messung', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'owner',
        type: 'boolean'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'statusEdit',
        type: 'boolean',
        persist: false
    }, {
        name: 'probeId',
        type: 'int'
    }, {
        name: 'mmtId'
    }, {
        name: 'nebenprobenNr',
        allowNull: true
    }, {
        name: 'messdauer',
        type: 'int',
        allowNull: true
    }, {
        name: 'messzeitpunkt',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'status',
        type: 'int',
        allowNull: true
    }, {
        name: 'fertig',
        type: 'boolean'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'geplant',
        type: 'boolean'
    }, {
        name: 'externeMessungsId',
        type: 'int',
        allowNull: true
    }, {
        name: 'treeModified',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'parentModified',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'statusWert',
        persist: false
    }, {
        name: 'statusStufe',
        persist: false
    }, {
        name: 'statuskombi',
        persist: false
    }, {
        name: 'messwerteCount',
        persist: false
    }, {
        name: 'kommentarCount',
        persist: false
    }, {
        name: 'copyOfMessungId',
        persist: false
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/messung',
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
