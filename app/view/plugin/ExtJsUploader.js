/* Copyrighte(C) 2015 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.view.plugin.ExtJsUploader', {
    extend: 'Ext.ux.upload.uploader.ExtJsUploader',

    extraContentType: '',

    initHeaders: function (item) {
        var headers =  this.callParent(arguments);
        headers['Content-Type'] = 'text/plain; charset=' + this.extraContentType;
        return headers;
    }
});
