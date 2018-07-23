/* Copyrighte(C) 2015 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

 /**
  * A Proxy override using POST requests with JSON data to get universal query results
  */
Ext.define('Lada.query.QueryProxy', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.query',

    //JSON payload used for executing queries
    payload: null,

    buildUrl: function(request) {
        request.setJsonData(this.payload);
        request.setHeaders({'Content-Type': 'application/json'});
        return this.callParent(arguments);
    },

    //Set JSON payload
    setPayload: function(payload) {
        this.payload = payload;
    }

});