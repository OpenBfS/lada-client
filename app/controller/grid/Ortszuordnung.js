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
        'Lada.view.window.Ortserstellung',
        'Lada.view.window.OrtFilter'
    ],

    resultPanel: null,
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
            'ortszuordnungwindow toolbar button[action=clone]':{
                click: this.cloneort
            },
            'ortszuordnungwindow toolbar textfield[name=search]': {
                keyup: this.search
            },
            'ortfilterwindow grid[name=messpunkte]': {
                itemclick: this.selectedMesspunkt
            },
            'ortfilterwindow grid[name=verwaltungseinheiten]': {
                itemclick: this.selectedVerwaltungseinheit
            },
            'ortfilterwindow grid[name=staaten]': {
                itemclick: this.selectedStaat
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
                selection.destroy({
                    success: function() {
                        button.up('window').initData();
                    },
                    failure: function(request, response) {
                        var i18n = Lada.getApplication().bundle;
                        var json = response.request.scope.reader.jsonData;
                        if (json) {
                            if (json.message){
                                Ext.Msg.alert(i18n.getMsg('err.msg.delete.title')
                                    +' #'+json.message,
                                    i18n.getMsg(json.message));
                            } else {
                                Ext.Msg.alert(i18n.getMsg('err.msg.delete.title'),
                                    i18n.getMsg('err.msg.generic.body'));
                            }
                        } else {
                            Ext.Msg.alert(i18n.getMsg('err.msg.delete.title'),
                                i18n.getMsg('err.msg.response.body'));
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
        Ext.create('Lada.view.window.Ortserstellung',{
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
     * Opens the form for a new Messpunkt, with all values prefilled from the currently
     * selected item
     */
    cloneort: function(button) {
        var grid = button.up('ortszuordnungwindow').down('ortstammdatengrid').getView();
        var selected = grid.getSelectionModel().getSelection()[0];
        var newRecord = Ext.create('Lada.model.Ort', selected.data);
        newRecord.set('ortId', null);
        newRecord.set('id', null);
        Ext.create('Lada.view.window.Ortserstellung', {
             record: newRecord,
             parentWindow: button.up('ortszuordnungwindow')
        }).show();
    },

    /**
     * Search triggered by textfield key event.
     */
    search: function(field, evt, opts) {
        if (evt.getKey() === 27) {
            if (this.resultPanel.isVisible()) {
                this.resultPanel.close();
                verwaltungseinheiten.clearFilter(true);
                staaten.clearFilter(true);
                return;
            }
            else {
                field.up('window').close();
                return;
            }
        }
        this.searchField = field;
        if ((evt.getKey() == 13 || evt.getKey() == 8) && field.getValue() && field.getValue().length > 0) {
            this.execSearch(field, field.getValue());
        }
        if (field.getValue().length === 0) {
            this.resultPanel.hide();
            var verwaltungseinheiten = Ext.data.StoreManager.get('verwaltungseinheiten');
            var staaten = Ext.data.StoreManager.get('staaten');
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
    execSearch: function(field, filter) {
        // Filter stores
        var messpunkte = Ext.data.StoreManager.get('orte');
        var cloneRecords = [];
        messpunkte.each(function(r) {
            cloneRecords.push(r.copy());
        });
        var filterMesspunkte = Ext.create('Lada.store.Orte',{
            autoLoad: false
        });
        filterMesspunkte.add(cloneRecords);
        var verwaltungseinheiten = Ext.data.StoreManager.get('verwaltungseinheiten');
        var staaten = Ext.data.StoreManager.get('staaten');
        verwaltungseinheiten.clearFilter(true);
        staaten.clearFilter(true);
        filterMesspunkte.filter({filterFn: function(item) {
                if (item.get('ortId').indexOf(filter) > -1) {
                    return true;
                }
                if (item.get('kurztext').indexOf(filter) > -1) {
                    return true;
                }
                if (item.get('langtext').indexOf(filter) > -1) {
                    return true;
                }
                if (item.get('berichtstext') &&
                    item.get('berichtstext').indexOf(filter) > -1) {
                    return true;
                }
                if (item.get('gemId') &&
                    item.get('gemId').indexOf(filter) > -1) {
                    return true;
                }
            }});
        verwaltungseinheiten.filter('bezeichnung', filter);
        staaten.filter('staat', filter);

        if (!this.resultPanel) {
            this.resultPanel = Ext.create('Lada.view.window.OrtFilter', {
                x: 500,
                y: 500,
                alwaysOnTop: true,
                parentWindow: this
            });
        }
        this.resultPanel.show();
        this.resultPanel.updateGrids(filterMesspunkte, verwaltungseinheiten, staaten);
        this.resultPanel.reposition(field.getX() + field.getLabelWidth(), field.getY());
        field.focus();
    },

    selectedMesspunkt: function(grid, record) {
        var win = grid.up('window');
        win.hide();
        this.searchField.reset();
        var grid = this.searchField.up('panel').down('ortstammdatengrid');
        var newrecord = grid.store.getById(record.get('id'));
        grid.getView().getSelectionModel().select(newrecord);
        grid.getView().focusRow(record);
        var verwaltungseinheiten = Ext.data.StoreManager.get('verwaltungseinheiten');
        var staaten = Ext.data.StoreManager.get('staaten');
        verwaltungseinheiten.clearFilter(true);
        staaten.clearFilter(true);
    },

    selectedVerwaltungseinheit: function(grid, record) {
        var win = grid.up('window');
        var panel = this.searchField.up('panel').up('window');
        win.hide();
        this.searchField.reset();
        Ext.create('Lada.view.window.Ortserstellung', {
            record: Ext.create('Lada.model.Ort', {
                gemId: record.get('id'),
                ortId: record.get('id'),
                kurztext: record.get('bezeichnung'),
                langtext: record.get('bezeichnung'),
                berichtstext: record.get('bezeichnung'),
                ortTyp: 4
            }),
            parentWindow: panel
        }).show();
        var verwaltungseinheiten = Ext.data.StoreManager.get('verwaltungseinheiten');
        var staaten = Ext.data.StoreManager.get('staaten');
        verwaltungseinheiten.clearFilter(true);
        staaten.clearFilter(true);
    },

    selectedStaat: function(grid, record) {
        var win = grid.up('window');
        var panel = this.searchField.up('panel').up('window');
        win.hide();
        this.searchField.reset();
        Ext.create('Lada.view.window.Ortserstellung', {
            record: Ext.create('Lada.model.Ort', {
                staatId: record.get('id'),
                ortId: 'Staat_' + record.get('staatIso'),
                kurztext: record.get('staat'),
                langtext: record.get('staat'),
                berichtstext: record.get('staat'),
                ortTyp: 5
            }),
            parentWindow: panel
        }).show();
        var verwaltungseinheiten = Ext.data.StoreManager.get('verwaltungseinheiten');
        var staaten = Ext.data.StoreManager.get('staaten');
        verwaltungseinheiten.clearFilter(true);
        staaten.clearFilter(true);
    }
});
