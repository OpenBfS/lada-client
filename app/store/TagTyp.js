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
        { name: 'validity', type: 'number' },
        { name: 'canSelect'}
        ]
    }),
    data: [{
        value: 'auto',
        label: 'Auto',
        validity: 548,
        canSelect: () => false
    }, {
        value: 'mst',
        label: 'Messstelle',
        validity: 365,
        canSelect: () => true
    }, {
        value: 'netzbetreiber',
        label: 'Netzbetreiber',
        validity: -1,
        canSelect: () => Ext.Array.contains(Lada.funktionen, 4)
    }, {
        value: 'global',
        label: 'Global',
        validity: -1,
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
