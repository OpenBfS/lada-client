/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Overrides the definition of "start" and "end" in columns, because in
 * ExtJS 6.2.0 the new rtl fucntionality was inserted so that it always
 * overwrites the ltr definitions.
 */
Ext.define('Lada.override.gridColumn', (function() {
    return {
        override: 'Ext.grid.column.Column',
        privates: {
            _alignMap: {
                start: 'left',
                end: 'right'
            }
        }
    };
}())
);
