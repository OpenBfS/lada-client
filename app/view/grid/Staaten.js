/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Stammdaten for Countries
 */
Ext.define('Lada.view.grid.Staaten', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.staatengrid',

    // minHeight and deferEmptyText are needed to be able to show the
    // emptyText message.
    minHeight: 110,
    store: Ext.data.StoreManager.get('staaten'),
    allowDeselect: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('grid.emptyGrid');
        var me = this;
        this.columns = [{
            header: 'ISO-Code', // i18n.getMsg(TODO)
            renderer: function(value) {
                if (!value || value === '') {
                    return '--';
                }
                return value;
            },
            dataIndex: 'staatIso'
        }, {
            header: 'Name (Kurzform)', //i18n.getMsg(TODO)
            width: 80,
            dataIndex: 'StaatKurz'
        }, {
            header: 'Name', //i18n.getMsg(TODO)
           dataIndex: 'staat'
        }];
        this.callParent(arguments);
    },

    /**
     * This sets the Store of this Grid
     */
    setStore: function(store){
        if (store) {
            this.reconfigure(store);
        }
    }
});
