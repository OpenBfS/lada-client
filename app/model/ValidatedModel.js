/* Copyright (C) 2023 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Base class for models that can contain validation messages
 **/
Ext.define('Lada.model.ValidatedModel', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'errors',
        persist: false
    }, {
        name: 'warnings',
        persist: false
    }, {
        name: 'notifications',
        persist: false
    }]
});
