/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model class for query Groups
 */
Ext.define('Lada.model.QueryGroup', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'messStellesIds'},
        {name: 'name', persist: false}
    ]
});
