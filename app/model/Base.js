/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Base class for models
 */
Ext.define('Lada.model.Base', {
    extend: 'Ext.data.Model',
    requires: ['Lada.lib.Helpers'],
    /**
     * Helper function to build an ID which is used in the proxy calls. This
     * function is a workaround for
     * https://roundup-intern.intevation.de/bfs/issue30
     * as some items can not be identified with a singe id.
     */
    getEidi: function() {
        return "/" + this.idProperty;
    },
    /**
     * Helper function to make a AJAX request against the authinfo interface
     * of the server
     * @param callback function(model, readonly, isowner)
     * @private
     */
    getAuthInfo: function(cb) {
        Ext.Ajax.request({
            scope: this,
            url: 'server/rest/authinfo/' + this.data.probeId,
            success: function(response, opts) {
                var obj = Ext.decode(Ext.decode(response.responseText).data);
                cb(this, obj.readonly, obj.isOwner);
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
                cb(this, true, false);
            }
        });
    }
});
