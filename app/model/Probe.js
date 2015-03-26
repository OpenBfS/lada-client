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
        name: 'id'
    }, {
        name: 'owner',
        type: 'boolean',
        persist: false
    }, {
        name: 'probeIdAlt'
    }, {
        name: 'hauptprobenNr'
    }, {
        name: 'test'
    }, {
        name: 'netzbetreiberId',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'mstId'
    }, {
        name: 'datenbasisId'
    }, {
        name: 'baId'
    }, {
        name: 'probenartId'
    }, {
        name: 'mediaDesk'
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
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        },
        defaultValue: new Date()
    }, {
        name: 'probeentnahmeEnde',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        },
        defaultValue: new Date()
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
        defaultValue: new Date()
    }, {
        name: 'erzeugerId'
    }, {
        name: 'probeNehmerId'
    }, {
        name: 'mpKat'
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
        defaultValue: new Date()
    }, {
        name: 'solldatumEnde',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        },
        defaultValue: new Date()
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'treeModified'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/probe',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
