/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 *
 */
Ext.define('Lada.controller.FilterManagement', {
    extend: 'Ext.app.Controller',

    /**
     * @private
     * Initialize the controller.
     */
    init: function() {
        var me = this;
        this.control({
            'filtermanagement grid favcolumn': {
                checkchange: me.checkchange
            },
            'filtermanagement': {
                close: me.windowClosed
            }
        });
    },

    checkchange: function(column, ndx, value) {
        var store = column.up('grid').store;
        var record = store.getAt(ndx);
        if (value) {
            Ext.Ajax.request({
                url: 'lada-server/rest/favorite',
                method: 'POST',
                jsonData: {
                    'queryId': record.get('id')
                },
                success: function() {
                    record.set('favorite', true);
                }
            });
        } else {
            Ext.Ajax.request({
                url: 'lada-server/rest/favorite?queryId=' + record.get('id'),
                method: 'DELETE',
                success: function() {
                    record.set('favorite', false);
                }
            });
        }
    },

    windowClosed: function() {
        var combobox = Ext.ComponentQuery.query('combobox[name=filter]')[0];
        this.getController('Lada.controller.Filter').updateFilter(combobox);
    }
});
