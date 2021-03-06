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
    extend: 'Ext.data.Model',

    /**
     * Save original record if probe is a copy of another
     */
    copiedFrom: null,

    fields: [{
        name: 'id',
        allowNull: true
        //persist: false
    }, {
        name: 'owner',
        type: 'boolean',
        persist: false
    }, {
        name: 'externeProbeId',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'hauptprobenNr'
    }, {
        name: 'test',
        type: 'boolean'
    }, {
        name: 'mstId',
        persist: true
    }, {
        name: 'laborMstId',
        persist: true
    }, {
        name: 'datenbasisId'
    }, {
        name: 'baId'
    }, {
        name: 'probenartId'
    }, {
        name: 'mediaDesk',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'media',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'umwId',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'probeentnahmeBeginn',
        type: 'date',
        allowNull: true,
        convert: Lada.util.Date.convertTimeFn,
        serialize: function(v) {
            if (v === '' || v === null) {
                return null;
            }
            var formatted = Ext.Date.format(v, 'Y-m-d\\TH:i:sP');
            return formatted;
        }
    }, {
        name: 'probeentnahmeEnde',
        type: 'date',
        allowNull: true,
        convert: Lada.util.Date.convertTimeFn,
        serialize: function(v) {
            if (v === '' || v === null) {
                return null;
            }
            var formatted = Ext.Date.format(v, 'Y-m-d\\TH:i:sP');
            return formatted;
        }
    }, {
        name: 'mittelungsdauer'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        dateFormat: 'time',
        convert: Lada.util.Date.convertTimeFn
    }, {
        name: 'erzeugerId'
    }, {
        name: 'probeNehmerId'
    }, {
        name: 'mplId'
    }, {
        name: 'mprId'
    }, {
        name: 'reiProgpunktGrpId'
    }, {
        name: 'ktaGruppeId'
    }, {
        name: 'solldatumBeginn',
        type: 'date',
        convert: Lada.util.Date.convertTimeFn,
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'solldatumEnde',
        type: 'date',
        convert: Lada.util.Date.convertTimeFn,
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'ursprungszeit',
        type: 'date',
        convert: Lada.util.Date.convertTimeFn,
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'treeModified',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
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
