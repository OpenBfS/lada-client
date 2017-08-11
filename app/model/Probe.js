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

    fields: [{
        name: 'id',
        allowNull: true
        //persist: false
    }, {
        name: 'owner',
        type: 'boolean',
        persist: false
    }, {
        name: 'idAlt',
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
        persist: true,
    }, {
        name: 'laborMstId',
        persist: true,
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
        name: 'media'
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
        convert: function(v, record) {
            if (!v) {
                return v;
            }
            return new Date(v);
        },
        serialize: function(v, record) {
            var formatted = Ext.Date.format(v, 'Y-m-d\\TH:i:sP');
            return formatted;
        }
    }, {
        name: 'probeentnahmeEnde',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        },
        serialize: function(v, record) {
            var formatted = Ext.Date.format(v, 'Y-m-d\\TH:i:sP');
            return formatted;
        }
    }, {
        name: 'mittelungsdauer'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        },
        serialize: function(v, record) {
            var formatted = Ext.Date.format(v, 'Y-m-d\\TH:i:sP');
            return formatted;
        }

    }, {
        name: 'erzeugerId'
    }, {
        name: 'probeNehmerId'
    }, {
        name: 'mplId'
    }, {
        name: 'mprId'
    }, {
        name: 'solldatumBeginn',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        },
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'solldatumEnde',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        },
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
