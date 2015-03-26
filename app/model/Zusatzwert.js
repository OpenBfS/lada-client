/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Zusatzwerte
 */
Ext.define('Lada.model.Zusatzwert', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'owner',
        type: 'boolean'
    }, {
        name: 'probeId'
    }, {
        name: 'pzsId'
    }, {
        name: 'nwgZuMesswert',
        type: 'float'
    }, {
        name: 'messwertPzs',
        type: 'float'
    }, {
        name: 'messfehler',
        type: 'float'
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
        name: 'treeModified'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/zusatzwert',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
