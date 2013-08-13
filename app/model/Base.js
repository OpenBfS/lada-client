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
        return "/" + idProperty;
    }
});
