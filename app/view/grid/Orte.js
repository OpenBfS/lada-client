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
    extend: 'Lada.view.grid.BaseGrid',
    alias: 'widget.ortstammdatengrid',

    requires: [
        'Lada.store.Netzbetreiber',
        'Lada.store.KoordinatenArt',
        'Lada.store.OrtTyp',
        'Lada.view.widget.KoordinatenArt',
        'Lada.view.widget.OrtsZusatz',
        'Lada.view.widget.OrtTyp',
        'Lada.view.window.Ort',
        'Ext.grid.filters.Filters'
    ],
    // minHeight and deferEmptyText are needed to be able to show the
    // emptyText message.
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true,
        name: 'ortpagingtoolbar'
    },

    recordId: null,

    warnings: null,
    errors: null,
    readOnly: true,
    allowDeselect: true,
    plugins: 'gridfilters',

    /**
     * TODO: currently does not use DynamicGrid behaviour, although it is
     * defined as Dynamic Grid
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.ortegrid');
        var netzbetreiberstore = Ext.data.StoreManager.get('netzbetreiber');
        if (!netzbetreiberstore) {
            Ext.create('Lada.store.Netzbetreiber', {
                storeId: 'netzbetreiber'
            });
        }
        var koordinatenstore = Ext.data.StoreManager.get('koordinatenart');
        if (!koordinatenstore) {
            Ext.create('Lada.store.KoordinatenArt', {
                storeId: 'koordinatenart'
            });
        }
        var orttypstore = Ext.data.StoreManager.get('orttyp');
        if (!orttypstore) {
            Ext.create('Lada.store.OrtTyp', {
                storeId: 'orttyp'
            });
        }
        this.columns = [{
            xtype: 'actioncolumn',
            text: 'RW',
            dataIndex: 'readonly',
            sortable: false,
            width: 30,
            getClass: function(val, meta, rec) {
                if (rec.get('readonly') === false) {
                    return 'edit';
                }
                return 'noedit';
            },
            handler: function(grid, rowIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                if (rec.get('readonly') === false) {
                    Lada.model.Ort.load(rec.get('id'), {
                        success: function(record) {
                            Ext.create('Lada.view.window.Ort', {
                                record: record,
                                parentWindow: grid.up('panel')
                            }).show();
                        }
                    });
                }
            }
        }, {
            header: i18n.getMsg('netzbetreiberId'),
            renderer: function(value) {
                var r = '';
                if (!value || value === '') {
                    r = 'Error';
                }
                var store = Ext.data.StoreManager.get('netzbetreiber');
                var record = store.getById(value);
                if (record) {
                    r = record.get('netzbetreiber');
                }
                return r;
            },
            dataIndex: 'netzbetreiberId'
        }, {
            header: i18n.getMsg('orte.ortId'),
            width: 60,
            filter: {
                type: 'string'
            },
            dataIndex: 'ortId'
        }, {
            header: i18n.getMsg('orte.ortTyp'),
            width: 40,
            filter: {
                type: 'list'
            },
            renderer: function(value) {
                if (value === undefined ||
                    value === null ||
                    value === ''
                ) {
                    return '';
                }
                var ot = Ext.data.StoreManager.get('orttyp');
                var record = ot.getById(value);
                if (!record) {
                    return value;
                }
                return record.get('code');
            },
            dataIndex: 'ortTyp'
        }, {
            header: i18n.getMsg('orte.kurztext'),
            filter: {
                type: 'string'
            },
            dataIndex: 'kurztext'
        }, {
            header: i18n.getMsg('orte.langtext'),
            width: 200,
            filter: {
                type: 'string'
            },
            dataIndex: 'langtext'
        }, {
            header: i18n.getMsg('orte.verwaltungseinheit'),
            dataIndex: 'gemId',
            width: 200,
            filter: {
                type: 'string',
                dataIndex: 'verwaltungseinheit'
            },
            renderer: function(value, metadata, record) {
                if (value === undefined ||
                    value === null ||
                    value === ''
                ) {
                    // Check if filter changed the response field into
                    // verwaltungseinheiten
                    if (record.get('verwaltungseinheit')) {
                        return record.get('verwaltungseinheit');
                    } else {
                        return '';
                    }
                }
                var store = Ext.data.StoreManager.get('verwaltungseinheiten');
                record = store.getById(value);
                if (!record) {
                    return value;
                }
                return record.get('bezeichnung');
            }
        }, {
            header: i18n.getMsg('orte.staatId'),
            dataIndex: 'staatId',
            width: 80,
            filter: {
                type: 'string',
                dataIndex: 'staat'
            },
            renderer: function(value, meta, record) {
                if (value === undefined ||
                    value === null ||
                    value === ''
                ) {
                    //Check if filter changed the response field into staat
                    if (record.get('staat')) {
                        return record.get('staat');
                    } else {
                        return '';
                    }
                }
                var staaten = Ext.data.StoreManager.get('staaten');
                record = staaten.getById(value);
                if (!record) {
                    return value;
                }
                return record.get('staat');
            }
        }, {
            header: i18n.getMsg('orte.ozIdS'),
            filter: {
                type: 'string'
            },
            renderer: function(value) {
                if (value === undefined ||
                    value === null ||
                    value === ''
                ) {
                    return '';
                }
                var oz = Ext.data.StoreManager.get('ortszusatz');
                var record = oz.getById(value);
                if (!record) {
                    return value;
                }
                return record.get('ozsId');
            },
            dataIndex: 'ozId'
        }, {
            header: i18n.getMsg('orte.anlageId'),
            renderer: function(value) {
                if (value === undefined ||
                    value === null ||
                    value === ''
                ) {
                    return '';
                }
                var store = Ext.data.StoreManager.get('ktaGruppe');
                var record = store.getById(value);
                if (!record) {
                    return value;
                }
                return record.get('ktaGruppe');
            },
            dataIndex: 'ktaGruppeId'
        }, {
            header: i18n.getMsg('orte.mpArt'),
            filter: {
                type: 'string'
            },
            dataIndex: 'mpArt'
        }, {
            header: i18n.getMsg('orte.zone'),
            filter: {
                type: 'string'
            },
            dataIndex: 'zone'
        }, {
            header: i18n.getMsg('orte.sektor'),
            filter: {
                type: 'string'
            },
            dataIndex: 'sektor'
        }, {
            header: i18n.getMsg('orte.zustaendigkeit'),
            filter: {
                type: 'string'
            },
            dataIndex: 'zustaendigkeit'
        }, {
            header: i18n.getMsg('orte.berichtstext'),
            filter: {
                type: 'string'
            },
            dataIndex: 'berichtstext'
        }, {
            header: i18n.getMsg('orte.unscharf'),
            filter: {
                type: 'string'
            },
            renderer: function(value) {
                if (value === true) {
                    return 'ja';
                } else {
                    return 'nein';
                }
            },
            dataIndex: 'unscharf'
        }, {
            header: i18n.getMsg('orte.kdaId'),
            filter: {
                type: 'string'
            },
            renderer: function(value) {
                if (value === undefined ||
                    value === null ||
                    value === ''
                ) {
                    return '';
                }
                var kda = Ext.data.StoreManager.get('koordinatenart');
                var record = kda.getById(value);
                if (!record) {
                    return value;
                }
                return record.get('koordinatenart');
            },
            dataIndex: 'kdaId'
        }, {
            header: i18n.getMsg('orte.koordXExtern'),
            filter: {
                type: 'string'
            },
            dataIndex: 'koordXExtern'
        }, {
            header: i18n.getMsg('orte.koordYExtern'),
            filter: {
                type: 'string'
            },
            dataIndex: 'koordYExtern'
        }, {
            header: i18n.getMsg('orte.longitude'),
            filter: {
                type: 'numeric'
            },
            dataIndex: 'longitude'
        }, {
            header: i18n.getMsg('orte.latitude'),
            filter: {
                type: 'numeric'
            },
            dataIndex: 'latitude'
        }, {
            header: i18n.getMsg('orte.hoeheLand'),
            filter: {
                type: 'numeric'
            },
            dataIndex: 'hoeheLand'
        }, {
            header: i18n.getMsg('orte.hoeheUeberNn'),
            filter: {
                type: 'numeric'
            },
            dataIndex: 'hoeheUeberNn'
        }, {
            header: i18n.getMsg('letzteAenderung'),
            filter: {
                type: 'date'
            },
            xtype: 'datecolumn',
            format: 'd.m.Y H:i',
            dataIndex: 'letzteAenderung'
        }];
        this.callParent(arguments);
        var cbox = Ext.create('Lada.view.widget.PagingSize');
        this.down('pagingtoolbar').add('-');
        this.down('pagingtoolbar').add(cbox);
        if (this.up('tabpanel')) {
            this.setTitle('Orte(0)');
        }
    },

    /**
     * This sets the Store of this Grid.
     */
    setStore: function(store) {
        var me = this;
        if (store) {
            this.reconfigure(store);
            this.store = store;
            this.addLoadingFailureHandler(store);
            this.store.on('load', function() {
                if (me.up('tabpanel')) {
                    me.setTitle('Orte(' + me.store.getCount() + ')');
                }
            });
        }
    },

    /**
     * Reload the grid
     */
    reload: function() {
        if (!this.store) {
            Ext.log({msg: 'Orte store is null', level: 'warn'});
            return;
        }
        this.hideReloadMask();
        this.store.reload();
    },

    /*
     * callback for a feature selected on the map. Selects the corresponding Ort
     * on the grid and the ortszuordnung form, if present
     */
    selectOrt: function(map, feature) {
        if (feature) {
            var id = Array.isArray(feature) ?
                feature[0].get('id') : feature.get('id');
            var record = this.store.getById(id);
            if (record) {
                //TODO paging: jump to page
                this.getSelectionModel().select(record);
                var rowIndex = this.store.find('id', id);
                this.getView().focusRow(rowIndex);
                var win = this.up('ortszuordnungwindow');
                if (win) {
                    win.down('ortszuordnungform').setOrt(null, record);
                    this.up('window').down('map').zoomToSelectedFeatures();
                }
            }
        }
    }
});
