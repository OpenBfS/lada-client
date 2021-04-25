/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a grid of Orte
 */
Ext.define('Lada.controller.grid.Ortszuordnung', {
    extend: 'Ext.app.Controller',

    requires: [
        'Lada.view.window.Ortszuordnung',
        'Lada.view.window.Ort'
    ],

    searchField: null,
    /*
     * Map of search timers using text field ids as keys
     */
    searchTimers: Ext.create('Ext.util.HashMap'),
    searchTimeout: 500,

    ignoreNextDblClick: false,

    /**
     * Initialize the controller
     * It has 10 listeners
     */
    init: function() {
        this.control({
            'ortszuordnunggrid': {
                itemdblclick: this.open
            },
            'ortszuordnunggrid button[action=add]': {
                click: this.add
            },
            'ortszuordnunggrid button[action=delete]': {
                click: this.remove
            },
            'ortszuordnungwindow toolbar button[action=createort]': {
                click: this.createort
            },
            'ortszuordnungwindow toolbar button[action=frommap]': {
                click: this.frommap
            },
            'ortszuordnungwindow toolbar button[action=allorte]': {
                click: this.allorte
            },
            'ortszuordnungwindow toolbar textfield[name=search]': {
                keyup: function(field, evt, opts) {
                    //Ignore keys like ctrl
                    var key = evt.getKey();
                    if ( (key - 48 < 0 && key - 90 > 0) //0-9 A-Z
                            && key !== 46 //Delete
                            && key !== 8 //Backspace
                            && key !== 32) {
                        return;
                    }
                    var me = this;
                    var searchTimer = me.searchTimers.get(field.getId());
                    if (!searchTimer) {
                        searchTimer = new Ext.util.DelayedTask(function() {
                            me.search(field, evt, opts);
                        });
                        me.searchTimers.add(field.getId(), searchTimer);
                    }
                    try {
                        searchTimer.cancel();
                        searchTimer.delay(me.searchTimeout);
                    } catch (e) {
                        me.search(field, evt, opts);
                    }
                }
            },
            // eslint-disable-next-line max-len
            'ortszuordnungwindow tabpanel ortstammdatengrid pagingtoolbar[name=ortpagingtoolbar]': {
                change: this.ortPageChanged
            },
            'staatengrid': {
                itemdblclick: this.selectedStaat
            },
            'verwaltungseinheitengrid': {
                itemdblclick: this.selectedVerwaltungseinheit
            }
        });
    },

    /**
     * When open is called, a {@link Lada.view.window.Ortszuordnung}
     * is created which allows to edit the Orte. record is an ortszuordnung
     * or ortzuordnungMp
     */
    open: function(grid, record) {
        if (grid.ignoreNextDblClick === true) {
            grid.ignoreNextDblClick = false;
            return;
        }
        var parentWin = grid.up('window');
        var parent = parentWin.record;
        // parent is either probe or messprogramm.
        var parentisMp = false;
        if (parent.data.hauptprobenNr === undefined) {
            parentisMp = true;
        }
        var win = Ext.create('Lada.view.window.Ortszuordnung', {
            parentWindow: parentWin,
            probe: parentisMp ? null: parent,
            messprogramm: parentisMp ? parent: null,
            record: record,
            grid: grid
        });
        parentWin.addChild(win);
        if (win.show()) {
            win.initData();
        }
    },

    /**
     * This function opens the Ortszuordnungwindow with a new Ortszuordnung
     */
    add: function(button) {
        var parent = button.up('window').record;
        var parentisMp = false;
        if (parent.data.hauptprobenNr === undefined) {
            parentisMp = true;
        }
        var win = Ext.create('Lada.view.window.Ortszuordnung', {
            parentWindow: button.up('window'),
            probe: parentisMp ? null: parent,
            messprogramm: parentisMp ? parent: null,
            record: null,
            grid: button.up('ortszuordnunggrid')
        });
        win.initData();
        win.show();
    },

    /**
     * A Ort-row can be removed from the grid with the remove
     * function. It asks the user for confirmation
     * If the removal was confirmed, it reloads the parent window on success,
     * on failure, an error message is shown.
     */
    remove: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection()[0];
        var i18n = Lada.getApplication().bundle;
        Ext.MessageBox.confirm(
            i18n.getMsg('delete'),
            i18n.getMsg('confirmation.question'),
            function(btn) {
                if (btn === 'yes') {
                    selection.erase({
                        success: function() {
                            grid.store.reload();
                        },
                        failure: function(request, response) {
                            if (response.error) {
                            //TODO: check content of html error code
                                Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                                    i18n.getMsg('err.msg.generic.body'));
                            } else {
                                var json = Ext.decode(
                                    response.getResponse().responseText);
                                if (json) {
                                    if (json.message) {
                                        Ext.Msg.alert(i18n.getMsg(
                                            'err.msg.delete.title')
                                    + ' #' + json.message,
                                        i18n.getMsg(json.message));
                                    } else {
                                        Ext.Msg.alert(i18n.getMsg(
                                            'err.msg.delete.title'),
                                        i18n.getMsg('err.msg.generic.body'));
                                    }
                                } else {
                                    Ext.Msg.alert(i18n.getMsg(
                                        'err.msg.delete.title'),
                                    i18n.getMsg('err.msg.response.body'));
                                }
                            }
                        }
                    });
                }
            });
        grid.down('button[action=delete]').disable();
    },

    /**
     * Opens the form for a new Messpunkt
     */
    createort: function(button) {
        var win = button.up('ortszuordnungwindow');
        var ort = Ext.create('Lada.view.window.Ort', {
            record: Ext.create('Lada.model.Ort', {
                ortTyp: 1,
                netzbetreiberId: win.netzbetreiberId}),
            parentWindow: win
        });
        win.childWindows.push(ort);
        ort.show();
    },

    /**
     * Creates a new Ortrecord from map coordinates
     */
    frommap: function(button) {
        var map = button.up('ortszuordnungwindow').down('map');
        var record = Ext.create('Lada.model.Ort');
        map.activateDraw(record);
    },

    /**
     * Search triggered by textfield key event.
     */
    search: function(field, evt) {
        var verwaltungseinheiten = Ext.data.StoreManager.get(
            'verwaltungseinheiten');
        var staaten = Ext.data.StoreManager.get('staaten');

        if (evt.getKey() === 27) {
            verwaltungseinheiten.clearFilter(true);
            staaten.clearFilter(true);
        }
        this.searchField = field;
        if ((evt.getKey() === 13 || evt.getKey() === 8)
                    && field.getValue()
                    && field.getValue().length > 0
                    && field.getValue().length < 3) {
            this.execSearch(field, field.getValue());
        }
        if (field.getValue().length === 0) {
            verwaltungseinheiten.clearFilter(true);
            staaten.clearFilter(true);
            return;
        }
        if (field.getValue().length < 3) {
            return;
        }
        this.execSearch(field, field.getValue());
    },

    /*
     * Execute search in stores (ort, verwaltungseinheit and staat) and
     * display the resultset.
     */
    execSearch: function(requestingCmp, filter) {
        var ozw = requestingCmp.up('ortszuordnungwindow');
        var verwgrid = ozw.down('verwaltungseinheitengrid');
        var staatgrid= ozw.down('staatengrid');
        // Filter stores
        var verwaltungseinheiten = verwgrid.getStore();
        var staaten = staatgrid.getStore();
        staaten.clearFilter(true);
        this.doOrtFilter(ozw, filter);


        verwaltungseinheiten.clearFilter(true);
        verwaltungseinheiten.filter({
            property: 'bezeichnung',
            anyMatch: true,
            value: filter,
            caseSensitive: false
        });
        verwgrid.setStore(verwaltungseinheiten);
        verwgrid.down('pagingtoolbar').doRefresh();


        staaten.filter({
            property: 'staat',
            anyMatch: true,
            value: filter,
            caseSensitive: false
        });
        staatgrid.setStore(staaten);
        staatgrid.down('pagingtoolbar').doRefresh();
    },

    selectedMesspunkt: function(grid, record) {
        var newrecord = grid.store.getById(record.get('id'));
        grid.getView().getSelectionModel().select(newrecord);
        grid.getView().focusRow(newrecord);
        var verwaltungseinheiten = Ext.data.StoreManager.get(
            'verwaltungseinheiten');
        var staaten = Ext.data.StoreManager.get('staaten');
        verwaltungseinheiten.clearFilter(true);
        staaten.clearFilter(true);
    },

    selectedVerwaltungseinheit: function(grid, record) {
        var win = grid.up('ortszuordnungwindow');
        Ext.create('Lada.view.window.Ort', {
            record: Ext.create('Lada.model.Ort', {
                netzbetreiberId: win.netzbetreiberId,
                gemId: record.get('id'),
                ortId: record.get('id'),
                kurztext: record.get('bezeichnung'),
                langtext: record.get('bezeichnung'),
                berichtstext: record.get('bezeichnung'),
                ortTyp: 4
            }),
            parentWindow: win,
            setOzOnComplete: true
        }).show();
        var verwaltungseinheiten = Ext.data.StoreManager.get(
            'verwaltungseinheiten');
        var staaten = Ext.data.StoreManager.get('staaten');
        verwaltungseinheiten.clearFilter(true);
        staaten.clearFilter(true);
    },

    selectedStaat: function(grid, record) {
        var win = grid.up('ortszuordnungwindow');
        Ext.create('Lada.view.window.Ort', {
            record: Ext.create('Lada.model.Ort', {
                netzbetreiberId: win.netzbetreiberId,
                staatId: record.get('id'),
                ortId: 'STAAT_' + record.get('id'),
                kurztext: ((record.get('staatIso') === null) ?
                    'STAAT_' + record.get('id') :
                    'STAAT_' + record.get('staatIso')),
                langtext: record.get('staat'),
                berichtstext: record.get('staat'),
                ortTyp: 5
            }),
            parentWindow: win,
            setOzOnComplete: true
        }).show();
        var verwaltungseinheiten = Ext.data.StoreManager.get(
            'verwaltungseinheiten');
        var staaten = Ext.data.StoreManager.get('staaten');
        verwaltungseinheiten.clearFilter(true);
        staaten.clearFilter(true);
    },

    //button to search
    allorte: function(button) {
        this.execSearch(button, '');
        var ozw = button.up('ortszuordnungwindow');
        var searchfield = button.up('toolbar').down('textfield[name=search]');
        searchfield.setValue('');
        ozw.down('tabpanel').setActiveTab(0);
    },

    /*
     * contains the filter last applied to the ortestore
     */
    ortefilter: null,

    /*
     * Checks if a reload of the ortstore is needed, and reloads, if nessecary
     * @param ozw: The current ortzuordnungwindow
     * @param filterstring (optional): The string to filter
     */
    doOrtFilter: function(ozw, filterstring) {
        var ortgrid= ozw.down('ortstammdatengrid');
        ozw.ortstore.clearFilter();
        var netzfilter = null;
        var mst_store = Ext.data.StoreManager.get('messstellen');
        if (ozw.probe) {
            netzfilter = ozw.probe.get('mstId');

        } else if (ozw.messprogramm) {
            netzfilter = ozw.messprogramm.get('mstId');
        }
        var extraParams = {};
        if (netzfilter !== null) {
            var item_mst = mst_store.findRecord(
                'id', netzfilter, false, false, false, true);
            var nid = item_mst.get('netzbetreiberId');
            if (nid !== null) {
                extraParams.netzbetreiberId = nid;
            }
        }
        if (filterstring) {
            extraParams.search = filterstring;
        }
        ozw.ortstore.proxy.extraParams = extraParams;
        ozw.ortstore.load({
            scope: this,
            callback: function() {
                var toolbar = ozw.down('tabpanel').down(
                    'ortstammdatengrid').down('pagingtoolbar');
                this.ortefilter = filterstring || null;
                ortgrid.setStore(ozw.ortstore);
                ozw.onStoreChanged();
                toolbar.doRefresh();
            }
        });
    },

    /**
     * Calls onStoreChanged at ortzuordnungwindow if the ort toolbar paged
     * changed.
     */
    ortPageChanged: function(toolbar) {
        var ozw = toolbar.up().up().up('ortszuordnungwindow');
        ozw.onStoreChanged();
    }
});
