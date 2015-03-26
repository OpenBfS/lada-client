/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for Status
 */
Ext.define('Lada.model.Status', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'owner',
        type: 'boolean'
    }, {
        name: 'messungsId'
    }, {
        name: 'erzeuger'
    }, {
        name: 'status'
    }, {
        name: 'sdatum',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        },
        defaultValue: new Date()
    }, {
        name: 'skommentar'
    }, {
        name: 'treeModified'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/status',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
