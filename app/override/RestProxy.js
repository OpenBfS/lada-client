/* Copyright (C) 2015 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.override.RestProxy', {
    override: 'Ext.data.proxy.Rest',

    buildRequest: function (operation) {
        this.headers = { 'X-OPENID-PARAMS': Lada.openIDParams };
        return this.callParent(arguments);
    },

    processResponse: function (success, operation, request, response, callback, scope) {
        if (!success && response.status == 401) {
            var json = Ext.decode(response.responseText);
            if (json) {
                if (json.message == "699") {
                    /* This is the unauthorized message with the authentication
                     * redirect in the data */

                    /* We decided to handle this with a redirect to the identity
                     * provider. In which case we have no other option then to
                     * handle it here with relaunch. */
                    Lada.launch(); // Data loss!
                }
            }
        }
        this.callParent(arguments);
    }
});
