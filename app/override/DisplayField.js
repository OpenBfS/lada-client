/* Copyright (C) 2024 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * In order to prevent HTML injections, DisplayFields and its
 * derivatives should always be rendered in encoded format.
 */
Ext.define('Lada.override.DisplayField', {
    override: 'Ext.form.field.Display',

    htmlEncode: true
});
