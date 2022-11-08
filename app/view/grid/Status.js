/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Status
 */
Ext.define('Lada.view.grid.Status', {
    extend: 'Lada.view.grid.BaseGrid',
    alias: 'widget.statusgrid',

    requires: [
        'Ext.grid.filters.Filters',
        'Lada.store.Status'],
    plugins: 'gridfilters',

    maxHeight: 350,
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },

    recordId: null,
    readOnly: true,
    allowDeselect: true,
    statusWerteStore: null,
    statusStufeStore: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.statusgrid');

        this.statusWerteStore = Ext.create('Lada.store.StatusWerte');
        this.statusWerteStore.load({
            params: {
                messungsId: this.recordId
            }
        });
        this.statusStufeStore = Ext.create('Lada.store.StatusStufe');
        this.statusStufeStore.load();

        this.columns = [{
            header: i18n.getMsg('header.datum'),
            dataIndex: 'datum',
            xtype: 'datecolumn',
            format: 'd.m.Y H:i',
            width: 110,
            sortable: true,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var format = 'd.m.Y H:i';
                var dt = '';
                if (!isNaN(value)) {
                    dt = Lada.util.Date.formatTimestamp(value, format, true);
                }
                return dt;
            }
        }, {
            header: i18n.getMsg('erzeuger'),
            dataIndex: 'mstId',
            renderer: function(value) {
                var r = '';
                if (!value || value === '') {
                    r = i18n.getMsg('error');
                }
                var mstore = Ext.data.StoreManager.get('messstellen');
                var item = mstore.getById(value);
                if (item) {
                    r = item.get('messStelle');
                }
                return r;
            },
            sortable: false
        }, {
            header: i18n.getMsg('header.statusstufe'),
            dataIndex: 'statusKombi',
            renderer: function(value) {
                var kombi = Ext.data.StoreManager.get('statuskombi');
                var r = '';
                var item = kombi.getById(value);
                if (item) {
                    r = item.data.statusStufe.stufe;
                }
                return r;
            },
            sortable: false
        }, {
            header: i18n.getMsg('header.statuswert'),
            dataIndex: 'statusKombi',
            renderer: function(value) {
                var kombi = Ext.data.StoreManager.get('statuskombi');
                var r = '';
                var item = kombi.getById(value);
                if (item) {
                    r = item.data.statusWert.wert;
                }
                return r;
            },
            sortable: false
        }, {
            header: i18n.getMsg('text'),
            dataIndex: 'text',
            flex: 1,
            sortable: false,
            renderer: function(value) {
                if (value === '' || value === undefined || value === null) {
                    return '';
                }
                return '<div style="white-space: normal !important;">' +
                value + '</div>';
            }
        }];
        this.initData();
        this.callParent(arguments);
    },

    initData: function() {
        if (this.store) {
            this.store.removeAll();
        } else {
            this.store = Ext.create('Lada.store.Status', {
                sorters: [{
                    property: 'id',
                    direction: 'DESC'
                }]
            });
        }

        this.addLoadingFailureHandler(this.store);

        this.store.load({
            params: {
                messungsId: this.recordId
            }
        });
        Ext.on('timezonetoggled', function() {
            var grid = Ext.ComponentQuery.query('statusgrid');
            for (i=0; i<grid.length; i++) {
                grid[i].reload(function() {
                    Ext.ComponentQuery.query(
                        'timezonebutton[action=toggletimezone]')[0]
                        .requestFinished();
                });
            }
        });
    },

    /**
     * Reload this grid
     */
    reload: function() {
        if (!this.store) {
            this.initData();
            return;
        }
        this.hideReloadMask();
        this.store.reload();
    }

});
