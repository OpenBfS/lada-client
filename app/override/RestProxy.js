/* Copyrighte(C) 2015 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.override.RestProxy', {
    override: 'Ext.data.proxy.Rest',

    processResponse: function(success, operation, request, response, callback, scope) {
        //SSO will send an html form if session is expired. Check content type for json or html:
        var me = this;
        var contentType = response.getAllResponseHeaders()['content-type'];
        if (contentType !== 'application/json') {
            var i18n = Lada.getApplication().bundle;
            Ext.MessageBox.confirm(
                i18n.getMsg('err.msg.sso.expired.title'),
                i18n.getMsg('err.msg.sso.expired.body'),
                function(btn) {
                    me.reload(btn, response, '/lada-idp/idp/profile/SAML2/POST/SSO');
                }
            );
        } else {
            this.callParent(arguments);
        }

        /*
           SSO will send a 302 if the Client is not authenticated
           unfortunately this seems to be filtered by the browser.
           We assume that a 302 was send when the follwing statement
           is true.
        */
        /*
        if (!success && response.status === 0 && response.responseText === '') {
            var i18n = Lada.getApplication().bundle;
            Ext.MessageBox.confirm(
                i18n.getMsg('err.msg.sso.expired.title'),
                i18n.getMsg('err.msg.sso.expired.body'),
                this.reload
            );
        } */
    },

    /**
     * If parameter "filter" is set, convert it to a simple string,
     * suitable for lada-server remote filtering.
     */
    getParams: function(operation) {
        var params = this.callParent(arguments);
        if (operation.getFilters) {
            var filters = operation.getFilters();
            var filterParam = this.getFilterParam();
            if (filterParam && filters && filters.length > 0) {
                var filterJson = Ext.decode(params[filterParam]);
                if (filterJson) {
                    for (var i = 0; i < filterJson.length; i++) {
                        if (filterJson[i].name === 'ortStringSearch') {
                            params[filterParam] = filterJson[i].value;
                        }
                    }
                }
            }
        }
        return params;
    },

    parseStatus: function(status) {
        console.log(status);
    },

    reload: function(btn, response, url) {
        var me = this;
        if (btn === 'yes') {
            //Parse responseform to get saml request parameter
            var response = response.responseText;
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(response,"text/html");
            //Parameters can be found as value of hidden input fields
            var inputFields = xmlDoc.getElementsByTagName('input');
            var relayState = inputFields.RelayState.value;
            var samlRequest = inputFields.SAMLRequest.value;
            var idpUrl = xmlDoc.getElementsByTagName('form')[0].action;

            //Issue a request to the idp containing the form data
            Ext.Ajax.setUseDefaultXhrHeader(false);
            Ext.Ajax.setWithCredentials(true);
            Ext.Ajax.request({
                url: url,
                method: 'POST',
                params: {
                    RelayState: relayState,
                    SAMLRequest: samlRequest
                },
                callback: function(opts, success, idpresponse) {
                    //Parse responseform to get sso request parameter
                    var idpresponseText = idpresponse.responseText;
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(idpresponse,"text/html");
                    //Parameters can be found as value of hidden input fields
                    var inputFields = xmlDoc.getElementsByTagName('input');
                    var relayState = inputFields.RelayState.value;
                    var samlRequest = inputFields.SAMLRequest.value;
                    Ext.Ajax.setUseDefaultXhrHeader(false);
                    Ext.Ajax.setWithCredentials(true);
                    Ext.Ajax.request({
                        url: '/Shibboleth.sso/SAML2/POST',
                        method: 'POST',
                        jsonData: {
                            RelayState: relayState,
                            SAMLRequest: samlRequest
                        },
                        callback: function(opts, success, idpresponse) {
                            debugger;
                        }
                    });
                }
            });
        }
    }
});
