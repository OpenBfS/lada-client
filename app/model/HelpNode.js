/* Copyright (C) 2022 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for nodes in the help tree
 */
Ext.define('Lada.model.HelpNode', {
    extend: 'Ext.data.TreeModel',

    fields: ['id', 'text', 'content'],

    // Define a custom proxy as the Lada.model.LadaBase proxy seems to interfere
    // with this model even though it does not extend LadaBase
    proxy: {
        type: 'memory',
        url: undefined,
        reader: {
            type: 'json',
            rootProperty: function(data) {
                return data.children;
            }
        }
    }
});
