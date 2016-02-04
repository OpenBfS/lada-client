/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Orte Stammdaten
 */
Ext.define('Lada.view.grid.Orte', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ortstammdatengrid',

    // minHeight and deferEmptyText are needed to be able to show the
    // emptyText message.
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },

    recordId: null,

    warnings: null,
    errors: null,
    readOnly: true,
    allowDeselect: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('orte.emptyGrid');

        this.columns = [{
            header: i18n.getMsg('orte.ortId'),
            dataIndex: 'ortId'
        }, {
            header: i18n.getMsg('orte.nutsCode'),
            dataIndex: 'nutsCode'
        }, {
            header: i18n.getMsg('orte.anlageId'),
            dataIndex: 'anlageId'
        }, {
            header: i18n.getMsg('orte.gemId'),
            dataIndex: 'gemId',
            width: 120,
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('verwaltungseinheiten');
                var record = store.getById(value);
                return record.get('bezeichnung');
            }
        }, {
            header: i18n.getMsg('orte.staatId'),
            dataIndex: 'staatId',
            width: 70,
            renderer: function(value) {
                var staaten = Ext.data.StoreManager.get('staaten');
                var record = staaten.getById(value);
                return record.get('staatIso');
            }
        }, {
            header: i18n.getMsg('orte.kdaId'),
            dataIndex: 'kdaId'
        }, {
            header: i18n.getMsg('orte.ozId'),
            dataIndex: 'ozId'
        }, {
            header: i18n.getMsg('orte.ortTyp'),
            dataIndex: 'ortTyp'
        }, {
            header: i18n.getMsg('orte.mpArt'),
            dataIndex: 'mpArt'
        }, {
            header: i18n.getMsg('orte.zone'),
            dataIndex: 'zone'
        }, {
            header: i18n.getMsg('orte.sektor'),
            dataIndex: 'sektor'
        }, {
            header: i18n.getMsg('orte.zustaendigkeit'),
            dataIndex: 'zustaendigkeit'
        }, {
            header: i18n.getMsg('orte.berichtstext'),
            dataIndex: 'berichtstext'
        }, {
            header: i18n.getMsg('orte.kurztext'),
            dataIndex: 'kurztext'
        }, {
            header: i18n.getMsg('orte.langtext'),
            dataIndex: 'langtext'
        }, {
            header: i18n.getMsg('orte.beschreibung'),
            dataIndex: 'beschreibung'
        }, {
            header: i18n.getMsg('orte.unscharf'),
            dataIndex: 'unscharf'
        }, {
            header: i18n.getMsg('orte.hoeheLand'),
            dataIndex: 'hoeheLand'
        }, {
            header: i18n.getMsg('orte.koordXExtern'),
            dataIndex: 'koordXExtern'
        }, {
            header: i18n.getMsg('orte.koordYExtern'),
            dataIndex: 'koordYExtern'
        }, {
            header: i18n.getMsg('orte.longitude'),
            dataIndex: 'longitude'
        }, {
            header: i18n.getMsg('orte.latitude'),
            dataIndex: 'latitude'
        }, {
            header: i18n.getMsg('orte.letzteAenderung'),
            dataIndex: 'letzteAenderung'
        }];
        this.callParent(arguments);
    },

    /**
     * This sets the Store of this Grid
     */
    setStore: function(store){
        var i18n = Lada.getApplication().bundle;

        if (store) {
            this.reconfigure(store);

            var ptbar = this.down('pagingtoolbar');
            if (ptbar) {
                this.removeDocked(ptbar);
            }

            if (store.pageSize > 0) {
                this.addDocked([{
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    store: store,
                    displayInfo: true
                }]);
            }
        }
    }
});
