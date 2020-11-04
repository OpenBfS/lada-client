/* Copyrighte(C) 2015 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.override.RestProxy', {
    override: 'Ext.data.proxy.Rest',

    processResponse: function(success, operation, request, response) {
        /*
           SSO will send a 302 if the Client is not authenticated
           unfortunately this seems to be filtered by the browser.
           We assume that a 302 was send when the follwing statement
           is true.
        */
        if (!success && response.status === 0 && response.responseText === '') {
            var i18n = Lada.getApplication().bundle;
            Ext.MessageBox.confirm(
                i18n.getMsg('err.msg.sso.expired.title'),
                i18n.getMsg('err.msg.sso.expired.body'),
                this.reload
            );
        }
        this.callParent(arguments);
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

    reload: function(btn) {
        if (btn === 'yes') {
            location.reload();
        }
    }
});
