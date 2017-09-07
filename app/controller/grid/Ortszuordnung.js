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
            'ortszuordnungwindow toolbar button[action=createort]':{
                click: this.createort
            },
            'ortszuordnungwindow toolbar button[action=frommap]':{
                click: this.frommap
            },
            'ortszuordnungwindow toolbar button[action=allorte]': {
                click: this.allorte
            },
            'ortszuordnungwindow toolbar textfield[name=search]': {
                keyup: this.search
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
        var parent = grid.up('window').record;
        // parent is either probe or messprogramm.
        var parentisMp = false;
        if (parent.data.hauptprobenNr === undefined) {
            parentisMp = true;
        }
        var win = Ext.create('Lada.view.window.Ortszuordnung', {
            parentWindow: grid.up('window'),
            probe: parentisMp ? null: parent,
            messprogramm: parentisMp ? parent: null,
            record: record,
            grid: grid
        });
        win.show();
        win.initData();
    },

    /**
     * This function adds a new row to add an Ort
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
            grid: button.up('ortszuordnung')
        });
        win.show();
        win.initData();
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
        Ext.MessageBox.confirm(i18n.getMsg('delete'), i18n.getMsg('confirmation.question'),
                                function(btn) {
                if (btn === 'yes') {
                selection.erase({
                    success: function() {
                        var ozw = button.up('window');
                        ozw.ortstore.reload();
                        ozw.onStoreChanged();
                    },
                    failure: function(request, response) {
                        var i18n = Lada.getApplication().bundle;
                        if (response.error){
                            //TODO: check content of error.status (html error code)
                            Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                                          i18n.getMsg('err.msg.generic.body'));
                        } else {
                            var json = Ext.decode(
                                response.getResponse().responseText);
                            if (json) {
                                if (json.message){
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
        var mstId = win.probe.get('mstId');
        var mst = Ext.data.StoreManager.get('messstellen');
        var ndx = mst.findExact('id', mstId);
        var nId = mst.getAt(ndx).get('netzbetreiberId');
        Ext.create('Lada.view.window.Ort',{
            record: Ext.create('Lada.model.Ort', {
                ortTyp: 1,
                netzbetreiberId: nId}),
            parentWindow: button.up('ortszuordnungwindow')
        }).show();
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
    search: function(field, evt, opts) {
        if (evt.getKey() === 27) {
            verwaltungseinheiten.clearFilter(true);
            staaten.clearFilter(true);
            messpunkte.clearFilter(true);
        }
        this.searchField = field;
        if ((evt.getKey() == 13 || evt.getKey() == 8) && field.getValue() && field.getValue().length > 0) {
            this.execSearch(field, field.getValue());
            //TODO backspace triggers too often (i.e. with empty field)
        }
        if (field.getValue().length === 0) {
            var verwaltungseinheiten = Ext.data.StoreManager.get('verwaltungseinheiten');
            var staaten = Ext.data.StoreManager.get('staaten');
            var messpunkte = Ext.data.StoreManager.get('orte');
            verwaltungseinheiten.clearFilter(true);
            staaten.clearFilter(true);
            messpunkte.clearFilter(true);
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
    execSearch: function(field, filter) {
        // Filter stores
        var messpunkte = Ext.data.StoreManager.get('orte');
        var verwaltungseinheiten = Ext.data.StoreManager.get('verwaltungseinheiten');
        var staaten = Ext.data.StoreManager.get('staaten');
        messpunkte.clearFilter(true);
        staaten.clearFilter(true);
        var ozw = field.up('ortszuordnungwindow');
        this.doOrtFilter(ozw, filter);

        var verwgrid = ozw.down('verwaltungseinheitengrid');
        verwaltungseinheiten.clearFilter(true);
        verwaltungseinheiten.filter({
                property: 'bezeichnung',
                anyMatch: true,
                value: filter
        });
        verwgrid.setStore(verwaltungseinheiten);

        var staatgrid= ozw.down('staatengrid');
        staaten.filter({
                property: 'staat',
                anyMatch: true,
                value: filter
        });
        staatgrid.setStore(staaten);
    },

    selectedMesspunkt: function(grid, record) {
        var win = grid.up('ortzuordnungwindow');
        var newrecord = grid.store.getById(record.get('id'));
        grid.getView().getSelectionModel().select(newrecord);
        grid.getView().focusRow(newrecord);
        var verwaltungseinheiten = Ext.data.StoreManager.get('verwaltungseinheiten');
        var staaten = Ext.data.StoreManager.get('staaten');
        verwaltungseinheiten.clearFilter(true);
        staaten.clearFilter(true);
    },

    selectedVerwaltungseinheit: function(grid, record) {
        var win = grid.up('ortszuordnungwindow');
        var mstId = win.probe.get('mstId');
        var mst = Ext.data.StoreManager.get('messstellen');
        var ndx = mst.findExact('id', mstId);
        var nId = mst.getAt(ndx).get('netzbetreiberId');
        Ext.create('Lada.view.window.Ort', {
            record: Ext.create('Lada.model.Ort', {
                netzbetreiberId: nId,
                gemId: record.get('id'),
                ortId: record.get('id'),
                kurztext: record.get('bezeichnung'),
                langtext: record.get('bezeichnung'),
                berichtstext: record.get('bezeichnung'),
                ortTyp: 4
            }),
            parentWindow: win
        }).show();
        var verwaltungseinheiten = Ext.data.StoreManager.get('verwaltungseinheiten');
        var staaten = Ext.data.StoreManager.get('staaten');
        verwaltungseinheiten.clearFilter(true);
        staaten.clearFilter(true);
    },

    selectedStaat: function(grid, record) {
        var win = grid.up('ortszuordnungwindow');
        var mstId = win.probe.get('mstId');
        var mst = Ext.data.StoreManager.get('messstellen');
        var ndx = mst.findExact('id', mstId);
        var nId = mst.getAt(ndx).get('netzbetreiberId');
        Ext.create('Lada.view.window.Ort', {
            record: Ext.create('Lada.model.Ort', {
                netzbetreiberId: nId,
                staatId: record.get('id'),
                ortId: 'Staat_' + record.get('staatIso'),
                kurztext: record.get('staat'),
                langtext: record.get('staat'),
                berichtstext: record.get('staat'),
                ortTyp: 5
            }),
            parentWindow: win
        }).show();
        var verwaltungseinheiten = Ext.data.StoreManager.get('verwaltungseinheiten');
        var staaten = Ext.data.StoreManager.get('staaten');
        verwaltungseinheiten.clearFilter(true);
        staaten.clearFilter(true);
    },

    //button to search
    allorte: function(button) {
        var ozw = button.up('ortszuordnungwindow');
        this.doOrtFilter(ozw);
        var searchfield = button.up('toolbar').down('textfield[name=search]');
        searchfield.setValue('');
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
    doOrtFilter: function(ozw, filterstring){
        var localfilter = false;
        if (!ozw){return;}
        if (filterstring && this.ortefilter) {
            if (filterstring === this.ortfilter){
                return;
            }
            if (!filterstring.indexOf(this.ortfilter) > -1){
                localFilter = true;
            }
        }
        var ortgrid= ozw.down('ortstammdatengrid');
        ozw.ortstore.clearFilter(true);
        if (filterstring){
            ozw.ortstore.addFilter({
                name: 'ortstringsearch',
                filterFn: function(item) {
                    if (!item.data){return false;}
                    if (item.data.ortId.indexOf(filterstring) > -1) {
                        return true;
                    }
                    if (item.data.kurztext.indexOf(filterstring) > -1) {
                        return true;
                    }
                    if (item.data.langtext.indexOf(filterstring) > -1) {
                        return true;
                    }
                    if (item.data.berichtstext &&
                        item.data.berichtstext.indexOf(filterstring) > -1) {
                        return true;
                    }
                    if (item.data.gemId &&
                        item.data.gemId.indexOf(filterstring) > -1) {
                        return true;
                    }
                }});
        }
        ozw.ortstore.addFilter({
            name: 'netzbetreiberfilter',
            property: 'netzbetreiberId',
            value: Lada.netzbetreiber[0]
        });
        if (localfilter){
            ortgrid.setStore(ozw.ortstore);
            ozw.onStoreChanged();
            //TODO Migration this is a stub. Don't reload store, but apply filter
        } else {
            this.ortefilter = filterstring || null;
            ozw.ortstore.load({
                callback: function(records, operation, success){
                    ortgrid.setStore(ozw.ortstore);
                    ozw.onStoreChanged();
                }
            });
        }
    }
});
