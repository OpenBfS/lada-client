/* Copyright (C) 2023 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Overrides the dateFormat used in model date fields.
 */
Ext.define('Lada.override.DateField', (function() {
    return {
        override: 'Ext.data.field.Date',
        dateFormat: 'C'
    };
}())
);
