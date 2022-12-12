/* Copyright (C) 2022 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * A field which is serialized as null if blank.
 **/
Ext.define('Lada.model.field.NonBlankString', {
    extend: 'Ext.data.field.Field',
    alias: 'data.field.nonblankstring',

    serialize: function(value) {
        if (!value) {
            return null;
        }
        return value;
    }
});
