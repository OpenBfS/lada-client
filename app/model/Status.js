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
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'owner',
        type: 'boolean'
    }, {
        name: 'messungsId'
    }, {
        name: 'mstId'
    }, {
        name: 'statusKombi',
        type: 'int'
    }, {
        name: 'statusWert',
        persist: false
    }, {
        name: 'statusStufe',
        persist: false
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
    }, {
        name: 'datum',
        type: 'date',
        convert: function(v) {
            if (!v) {
                return v;
            }
            return new Date(v);
        }
    }, {
        name: 'text'
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/status',
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
