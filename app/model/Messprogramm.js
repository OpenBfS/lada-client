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
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'test',
        type: 'boolean'
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
        name: 'name'
    }, {
        name: 'datenbasisId'
    }, {
        name: 'baId'
    }, {
        name: 'gemId'
    }, {
        name: 'ortId'
    }, {
        name: 'mediaDesk'
    }, {
        name: 'umwId',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'probenartId'
    }, {
        name: 'probenintervall'
    }, {
        name: 'teilintervallVon'
    }, {
        name: 'teilintervallBis'
    }, {
        name: 'intervallOffset'
    }, {
        name: 'gueltigVon',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        },
        serialize: function(value) {
            if (value instanceof Date && !isNaN(value.valueOf())) {
                return value.getDOY();
            }
        }
    }, {
        name: 'gueltigBis',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        },
        serialize: function(value) {
            if (value instanceof Date && !isNaN(value.valueOf())) {
                return value.getDOY();
            }
        }
    }, {
        name: 'probeNehmerId'
    }, {
        name: 'probeKommentar'
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
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/messprogramm', //not yet implemented
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
