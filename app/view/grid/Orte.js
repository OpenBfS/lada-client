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

    warnings: null,
    errors: null,
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
                    Lada.model.Site.load(rec.get('id'), {
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
            header: i18n.getMsg('networkId'),
            renderer: function(value) {
                var r = '';
                if (!value || value === '') {
                    r = 'Error';
                }
                var store = Ext.data.StoreManager.get('netzbetreiber');
                var record = store.getById(value);
                if (record) {
                    r = record.get('name');
                }
                return Ext.htmlEncode(r);
            },
            dataIndex: 'networkId'
        }, {
            header: i18n.getMsg('orte.ortId'),
            width: 60,
            filter: {
                type: 'string'
            },
            dataIndex: 'extId',
            renderer: function(value) {
                return Ext.htmlEncode(value);
            }
        }, {
            header: i18n.getMsg('siteClassId'),
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
                return Ext.htmlEncode(record.get('extId'));
            },
            dataIndex: 'siteClassId'
        }, {
            header: i18n.getMsg('orte.kurztext'),
            filter: {
                type: 'string'
            },
            dataIndex: 'shortText',
            renderer: function(value) {
                return Ext.htmlEncode(value);
            }
        }, {
            header: i18n.getMsg('orte.langtext'),
            width: 200,
            filter: {
                type: 'string'
            },
            dataIndex: 'longText',
            renderer: function(value) {
                return Ext.htmlEncode(value);
            }
        }, {
            header: i18n.getMsg('orte.verwaltungseinheit'),
            dataIndex: 'adminUnitId',
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
                return Ext.htmlEncode(record.get('name'));
            }
        }, {
            header: i18n.getMsg('orte.staatId'),
            dataIndex: 'stateId',
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
                return Ext.htmlEncode(record.get('ctry'));
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
                return Ext.htmlEncode(record.get('name'));
            },
            dataIndex: 'poiId'
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
                return Ext.htmlEncode(record.get('name'));
            },
            dataIndex: 'nuclFacilGrId'
        }, {
            header: i18n.getMsg('orte.mpArt'),
            filter: {
                type: 'string'
            },
            dataIndex: 'reiOprMode'
        }, {
            header: i18n.getMsg('orte.zone'),
            filter: {
                type: 'string'
            },
            dataIndex: 'reiZone'
        }, {
            header: i18n.getMsg('orte.sektor'),
            filter: {
                type: 'string'
            },
            dataIndex: 'reiSector'
        }, {
            header: i18n.getMsg('orte.zustaendigkeit'),
            filter: {
                type: 'string'
            },
            dataIndex: 'reiCompetence'
        }, {
            header: i18n.getMsg('orte.berichtstext'),
            filter: {
                type: 'string'
            },
            dataIndex: 'reiReportText'
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
            dataIndex: 'isFuzzy'
        }, {
            header: i18n.getMsg('spatRefSysId'),
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
                return Ext.htmlEncode(record.get('name'));
            },
            dataIndex: 'spatRefSysId'
        }, {
            header: i18n.getMsg('coordXExt'),
            filter: {
                type: 'string'
            },
            dataIndex: 'coordXExt'
        }, {
            header: i18n.getMsg('coordYExt'),
            filter: {
                type: 'string'
            },
            dataIndex: 'coordYExt'
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
            dataIndex: 'alt'
        }, {
            header: i18n.getMsg('orte.hoeheUeberNn'),
            filter: {
                type: 'numeric'
            },
            dataIndex: 'heightAsl'
        }, {
            header: i18n.getMsg('letzteAenderung'),
            filter: {
                type: 'date'
            },
            xtype: 'datecolumn',
            format: 'd.m.Y H:i',
            dataIndex: 'lastMod'
        }];

        this.setTitle(i18n.getMsg('title.orte'));

        this.callParent(arguments);

        this.down('pagingtoolbar').add('-');
        this.down('pagingtoolbar').add(
            Ext.create('Lada.view.widget.PagingSize'));
    },

    /**
     * This sets the Store of this Grid.
     */
    setStore: function(store) {
        if (store) {
            this.reconfigure(store);
            this.store = store;
            this.addLoadingFailureHandler(store);
            this.store.on('load', function() {
                var i18n = Lada.getApplication().bundle;
                this.setTitle(
                    i18n.getMsg('title.orte')
                        + ' (' + this.store.getTotalCount() + ')');
            }, this);
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
