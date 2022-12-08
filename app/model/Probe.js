/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * A Probe.
 * This class represents and defines the model of a 'Probe'
 **/
Ext.define('Lada.model.Probe', {
    extend: 'Lada.model.LadaBase',

    /**
     * Save original record if probe is a copy of another
     */
    copiedFrom: null,

    fields: [{
        name: 'id',
        allowNull: true
    }, {
        name: 'owner',
        type: 'boolean',
        persist: false
    }, {
        name: 'externeProbeId'
    }, {
        name: 'hauptprobenNr',
        allowNull: true
    }, {
        name: 'test',
        type: 'boolean'
    }, {
        name: 'mstId'
    }, {
        name: 'laborMstId'
    }, {
        name: 'datenbasisId',
        type: 'int',
        allowNull: true
    }, {
        name: 'baId',
        type: 'int',
        allowNull: true
    }, {
        name: 'probenartId',
        type: 'int',
        allowNull: true
    }, {
        name: 'mediaDesk',
        allowNull: true,
        serialize: function(value) {
            if (!value) {
                return null;
            }
            return value;
        }
    }, {
        name: 'media',
        allowNull: true
    }, {
        name: 'umwId',
        allowNull: true
    }, {
        name: 'probeentnahmeBeginn',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'probeentnahmeEnde',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'mittelungsdauer',
        type: 'int',
        allowNull: true
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'erzeugerId',
        type: 'int',
        allowNull: true
    }, {
        name: 'probeNehmerId',
        type: 'int',
        allowNull: true
    }, {
        name: 'mplId',
        type: 'int',
        allowNull: true
    }, {
        name: 'mprId',
        type: 'int',
        allowNull: true
    }, {
        name: 'reiProgpunktGrpId',
        type: 'int',
        allowNull: true
    }, {
        name: 'ktaGruppeId',
        type: 'int',
        allowNull: true
    }, {
        name: 'solldatumBeginn',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'solldatumEnde',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'ursprungszeit',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'treeModified',
        type: 'date',
        dateFormat: 'time'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/probe',
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
