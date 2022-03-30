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
        // default gueltigBis (-1: infinite)
        { name: 'validity', type: 'number' }
        ]
    }),
    data: [{
        value: 'auto',
        label: 'Auto',
        validity: 548
    }, {
        value: 'mst',
        label: 'Messstelle',
        validity: 365
    }, {
        value: 'netzbetreiber',
        label: 'Netzbetreiber',
        validity: -1
    }, {
        value: 'global',
        label: 'Global',
        validity: -1
    }],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
