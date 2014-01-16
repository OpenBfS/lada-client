/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Model class for Status
 */
Ext.define('Lada.model.Status', {
    extend: 'Lada.model.Base',
    fields: [
        {name: "sid"},
        {name: "messungsId"},
        {name: "probeId"},
        {name: "erzeuger"},
        {name: "status", defaultValue: 1},
        {name: "sdatum", type: 'date', convert: Lada.lib.Helpers.ts2date, defaultValue: new Date()},
        {name: "skommentar"}
    ],
    idProperty: "sid",
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: 'server/rest/status',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    getEidi: function() {
        var sid =  this.get('sid');
        var messId = this.get('messungsId');
        var probeId = this.get('probeId');
        return "/" + sid + "/" + messId + "/" + probeId;
    }
});
