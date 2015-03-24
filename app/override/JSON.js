/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */


// The Date returned by EXT-JSON serializer has to contain the timezone identifier

Ext.define("Lada.override.JSON", {
    override: 'Ext.JSON',
    encodeDate: function(o){
        return '"' + Ext.Date.format(o, 'c') + '"';
    }
});

