/**
 * Store for Info
 */
Ext.define('Lada.store.Info', {
    extend: 'Ext.data.Store',
    fields: ['user', 'groups', 'version'],
    proxy: {
         type: 'rest',
         url: 'server/rest/info',
         reader: {
             type: 'json',
             root: 'data'
         }
     }
});

