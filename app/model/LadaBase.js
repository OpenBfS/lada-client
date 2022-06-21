/* Copyright (C) 2022 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Base class for all other model classes.
 **/
Ext.define('Lada.model.LadaBase', {
    extend: 'Ext.data.Model',

    schema: {
        namespace: 'Lada.model'
    }
});
