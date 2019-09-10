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
        var parent = this.callParent;
        var contentType = response.getAllResponseHeaders()['content-type'];
        if (contentType !== 'application/json') {
            var i18n = Lada.getApplication().bundle;
            try {
                Ext.MessageBox.confirm(
                    i18n.getMsg('err.msg.sso.expired.title'),
                    i18n.getMsg('err.msg.sso.expired.body'),
                    function(btn) {
                        me.reload(btn, response, request).then(function(args) {
                            var succ = args[1];
                            var resp = args[2];
                            me.processResponse(succ, operation, request, resp, callback, scope);
                            Ext.MessageBox.alert({
                                title: i18n.getMsg('shib.session.renewed.title'),
                                message: i18n.getMsg('shib.session.renewed.text')
                            });
                        });
                    }
                );
            } catch (e) {
                Ext.MessageBox.alert({
                    title: i18n.getMsg('err.msg.sso.renew.failed.title'),
                    message: i18n.getMsg('err.msg.sso.renew.failed.body')
                });
            }
            
        } else {
            this.callParent(arguments);
        }
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

    /**
     * Parse the form inside an idp response and send
     * the response containing form data
     */
    parseAuthenticationRequest: function(responseObj, callback) {
        //Parse responseform to get saml request parameter
        //This should be the response to the request to the lada server
        var response = responseObj.responseText;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(response,"text/html");
        //Parameters can be found as value of hidden input fields
        var idpUrl = this.getActionUrl(responseObj);
        var inputFields = xmlDoc.getElementsByTagName('input');
        var params = {};
        for (var i = 0; i < inputFields.length; i++) {
            var field = inputFields[i];
            var name = field.getAttribute('name');
            var value = field.getAttribute('value');
            if (name && name != "") {
                params[name] = value;
            }
        }
        //Issue a request to the idp containing the form data
        Ext.Ajax.setUseDefaultXhrHeader(false);
        Ext.Ajax.setWithCredentials(true);
        Ext.Ajax.request({
            url: idpUrl,
            method: 'POST',
            params: params,
            callback: callback ? callback : null
        });
    },

    /**
     * Return the action url of a form tag inside a response
     */
    getActionUrl: function(responseObj) {
        var response = responseObj.responseText;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(response,"text/html");
        return xmlDoc.getElementsByTagName('form')[0].getAttribute('action');

    },

    /**
     * Renew an expired shibboleth sp session.
     */
    reload: function(btn, response, initialRequest) {
        var me = this;
        return new Ext.Promise(function(resolve, reject) {
            Ext.Ajax.on("beforerequest",function(con){
                con.setUseDefaultXhrHeader(false);
                con.setWithCredentials(true);
              });
            if (btn === 'yes') {
                //Get the idp base url
                var idpBaseUrl = me.getActionUrl(response).match(/^https:\/\/[^\/]+/i);
                //Parse the first response form and send data back to idp
                me.parseAuthenticationRequest(response, function(opts, success, idpresponse) {
                        /* The response should be a form and scripts to save session
                        information to the local storage */
                        var idpresponseText = idpresponse.responseText;
                        var parser = new DOMParser();
                        var xmlDoc = parser.parseFromString(idpresponseText,"text/html");
                        //Parameters can be found as value of hidden input fields
                        var inputFields = xmlDoc.getElementsByTagName('input');
                        var params = {};
                        for (var i = 0; i < inputFields.length; i++) {
                            var field = inputFields[i];
                            var name = field.getAttribute('name');
                            var value = field.getAttribute('value');
                            if (name && name != "") {
                                params[name] = value;
                            }
                        }
                        var execUrl = idpBaseUrl
                                + xmlDoc.getElementsByTagName('form')[0].getAttribute('action');
                        var scripts = xmlDoc.getElementsByTagName('script');
                        var wrappingDiv = xmlDoc.getElementsByClassName('wrapper')[0];
    
                        var scripts = xmlDoc.getElementsByTagName('script');
                        var infoScript;
                        for (var j = 0; j < scripts.length; j++) {
                            var tag = scripts[j]
                            if (tag.parentElement.className === 'container') {
                                infoScript = tag;
                            }
                        }
                        writeLocalStorage = function(key, value) {
                            params = me.writeLocalStorage(key, value, params);
                        }
                        var funcText = infoScript.innerText;
                        funcText = funcText.replace('<!--', '');
                        funcText = funcText.replace('-->', '');
                        funcText = funcText.replace('function doSave() {', '');
                        funcText = funcText.replace('document.form1.submit()', '');
                        funcText = funcText.replace('}', '');
                        var doSave = new Function(funcText);
                        doSave.call();
                        //Issue the last request to the idp
                        Ext.Ajax.request({
                            url: execUrl,
                            method: 'POST',
                            params: params,
                            callback: function(opts, success, idpresponse) {
                                /* Parse saml response parameters and send to sp.
                                   This request should be redirected to the actual rest service */
                                me.parseAuthenticationRequest(idpresponse, function() {
                                    resolve(arguments);
                                })
                            }
                        });
                    }
                );
            }
        });
    },

    /**
     * Write session info to local storage and set params accordingly
     */
    writeLocalStorage: function(key, value, params) {
        var success;
        try {
            if (value == null || value.length == 0) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value);
            }
            success = "true";
        } catch (e) {
            success = "false";
            params["shib_idp_ls_exception." + key] = e;
        }
        params["shib_idp_ls_success." + key] = success;
        return params;
    }
});
