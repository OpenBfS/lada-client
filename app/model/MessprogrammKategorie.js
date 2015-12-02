/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for MessprogrammKategorie Stammdaten
 */
Ext.define('Lada.model.MessprogrammKategorie', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'netzbetreiberId'
    }, {
        name: 'mplId'
    }, {
        name: 'bezeichnung'
    }, {
        name: 'letzteAenderung',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        }
    }, {
        name: 'treeModified',
        serialize: function(value) {
            if (value === '') {
                return null;
            }
            return value;
        }
    }, {
        name: 'parentModified',
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
        url: 'lada-server/messprogrammkategorie',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
