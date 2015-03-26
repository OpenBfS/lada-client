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
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'owner',
        type: 'boolean'
    }, {
        name: 'readonly',
        type: 'boolean'
    }, {
        name: 'probeId'
    }, {
        name: 'mmtId'
    }, {
        name: 'nebenprobenNr'
    }, {
        name: 'messdauer'
    }, {
        name: 'messzeitpunkt',
        convert: function(v) {
            if (!v) {
                return new Date();
            }
            return new Date(v);
        },
        defaultValue: new Date()
    }, {
        name: 'fertig',
        type: 'boolean'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return new Date();
            }
            return new Date(v);
        },
        defaultValue: new Date()
    }, {
        name: 'geplant',
        type: 'boolean'
    }, {
        name: 'messungsIdAlt'
    }, {
        name: 'treeModified'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/messung',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
