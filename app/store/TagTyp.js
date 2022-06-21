/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for Tags
 */
Ext.define('Lada.store.TagTyp', {
    extend: 'Ext.data.Store',

    model: Ext.create('Ext.data.Model', {
        fields: [
            { name: 'value', type: 'string' }, // as defined by server
            { name: 'label', type: 'string' }, //display value
            { name: 'canSelect'}
        ]
    }),

    data: [{
        value: 'mst',
        label: 'Messstelle',
        canSelect: () => true
    }, {
        value: 'netzbetreiber',
        label: 'Netzbetreiber',
        canSelect: () => true
    }, {
        value: 'global',
        label: 'Global',
        canSelect: () => false
    }],

    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
