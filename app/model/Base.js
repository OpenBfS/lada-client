/**
 * Base class for models
 */
Ext.define('Lada.model.Base', {
    extend: 'Ext.data.Model',
    requires: ['Lada.lib.Helpers'],
    /**
     * Define fields in the model
     */
    fields: [],
    /**
     * Define the property which is used as unique attribute in the model.
     * This might cause problems whith combined PK in the database. See
     * https://roundup-intern.intevation.de/bfs/issue30
     */
    idProperty: null,
    /**
     * Define the URL of the (REST) ressource where to query for this model
     */
    proxyUrl: null,
    /**
     * The Proxy used for this model. Defaults to a REST proxy which returns
     * JSON. The payload is expected to be in a "data" node. The url of the
     * proxy is configured in the proxyUrl attribute.
     */
    proxy: {
        type: 'rest',
        appendId: true, //default
        url: this.proxyUrl,
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    /**
     * Helper function to build an ID which is used in the proxy calls. This
     * function is a workaround for
     * https://roundup-intern.intevation.de/bfs/issue30
     * as some items can not be identified with a singe id.
     */
    getEidi: function() {
        var kid =  this.get('kId');
        var probeId = this.get('probeId');
        return "/" + kid + "/" + probeId;
    }
});
