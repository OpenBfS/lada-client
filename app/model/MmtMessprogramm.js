/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * A Messmethoden Messprogramm.
 * This class represents and defines the model of a 'MmtMessprogramm'
 **/
Ext.define('Lada.model.MmtMessprogramm', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id'
    }, {
        name: 'messprogrammId'
    }, {
        name: 'mmtId'
    }, {
        name: 'messgroessen',
        defaultValue: []
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
        url: 'lada-server/messprogrammmmt',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
