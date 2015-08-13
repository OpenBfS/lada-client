/* Copyright (C) 2015 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.override.RestProxy', {
    override: 'Ext.data.proxy.Rest',
/*
    buildRequest: function (operation) {
        this.headers = { 'X-OPENID-PARAMS': Lada.openIDParams };
        return this.callParent(arguments);
    },

    processResponse: function (success, operation, request, response, callback, scope) {
        /* Check if we were authenticated at one point (Lada.openIDParams) and
         * if the response means that we lost that authentcation
        if (Lada.openIDParams && !success && response.status == 401) {
            var json = Ext.decode(response.responseText);
            if (json) {
                if (json.message === "699" || json.message === "698") {
                    /* This is the unauthorized message with the authentication
                     * redirect in the data 

                    /* We decided to handle this with a redirect to the identity
                     * provider. In which case we have no other option then to
                     * handle it here with relaunch. 
                    Ext.MessageBox.confirm('Erneutes Login erforderlich',
                        'Der Server konnte die Anfrage nicht authentifizieren.<br/>'+
                        'Für ein erneutes Login muss die Anwendung neu geladen werden.<br/>' +
                        'Alle ungesicherten Daten gehen dabei verloren.<br/>' +
                        'Soll die Anwendung jetzt neu geladen werden?', this.reload);
                }
            }
        }
        this.callParent(arguments);
    },
*/
    reload: function(btn) {
        if (btn === 'yes') {
            location.reload();
        }
    }
});
