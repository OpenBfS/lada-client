/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for dynamic grids.
 */
Ext.define('Lada.controller.grid.DynamicGrid', {
    extend: 'Ext.app.Controller',
    requires: ['Lada.view.window.DeleteMultipleItems'],

    /**
     * Initialize the Controller with listeners
     */
    init: function() {
        this.control({
            'dynamicgrid': {
                itemdblclick: this.openItem,
                select: this.handleSelect,
                deselect: this.handleDeselect,
                selectionchange: this.selectionChanged
            },
            'dynamicgrid pagingtoolbar': {
                change: this.pageChange
            },
            'button[action=genericdelete]': {
                click: this.deleteData
            },
            'button[action=genericadd]': {
                click: this.addData
            }
        });
        this.callParent(arguments);
    },


    /**
     * Toggles the generic buttons in the toolbar
     **/
    handleSelect: function(rowModel, record) {
        var grid = rowModel.view.up('grid');
        var map = Ext.ComponentQuery.query('map')[0];
        if (map) {
            map.fireEvent('selectfeature', null, record);
        }
        this.buttonToggle(true, grid);
    },

    /**
     * Toggles the generic buttons in the toolbar
     **/
    handleDeselect: function(rowModel, record) {
        var grid = rowModel.view.up('grid');
        // Only disable buttons when nothing is selected
        if (rowModel.selected.items.length === 0) {
            this.buttonToggle(false, grid);
        }
        var map = Ext.ComponentQuery.query('map')[0];
        if (map) {
            map.fireEvent('deselectfeature', record);
        }
    },

    /**
     * Enables/Disables the generic set of buttons
     **/
    buttonToggle: function(enabled, grid) {
        var buttons = grid.down('toolbar').items;
        for (var i=0; i < buttons.items.length; i++) {
            if (buttons.items[i].config.needsSelection === true) {
                if (enabled === true) {
                    buttons.items[i].enable();
                } else {
                    buttons.items[i].disable();
                }
            }
        }
    },

    reload: function(btn) {
        if (btn === 'yes') {
            location.reload();
        }
    },

    pageChange: function(toolbar) {
        var grid = toolbar.up('grid');
        var store = grid.getStore();
        var rowExpander = null;
        if (grid.plugins && grid.plugins.length) {
            rowExpander = grid.plugins[0];
        }
        if (rowExpander && rowExpander.ptype === 'gridrowexpander') {
            var nodes = rowExpander.view.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                var node = Ext.fly(nodes[i]);
                if (node.hasCls(rowExpander.rowCollapsedCls) === false) {
                    rowExpander.toggleRow(i, store.getAt(i));
                }
            }
            rowExpander.expandedAll = false;
            var tbar = grid.getDockedItems('toolbar[dock="top"]');
            if (tbar && tbar[0].down('button[action=expand]')) {
                tbar[0].down('button[action=expand]').setText(
                    grid.i18n.getMsg('grid.expandDetails'));
            }
        }
    },


    openItem: function(row, record) {
        if (!row.grid.rowtarget.hasOwnProperty('dataType')) {
            return false;
        }
        var id = record.get(row.grid.rowtarget.dataIndex);
        switch (row.grid.rowtarget.dataType) {
            case 'messungId':
                Lada.model.Messung.load(id, {
                    scope: row,
                    callback: function(record, operation, success) {
                        if (success) {
                            var messungRecord = record;
                            Lada.model.Probe.load(
                                messungRecord.get('probeId'), {
                                    scope: this,
                                    callback: function(precord, poperation, psuccess) {
                                        var probeWin = Ext.create(
                                            'Lada.view.window.ProbeEdit', {
                                                record: precord,
                                                style: 'z-index: -1;'
                                            });
                                        if (probeWin.show()) {
                                            probeWin.initData(precord);
                                            probeWin.setPosition(30);
                                        }
                                        var win = Ext.create(
                                            'Lada.view.window.MessungEdit', {
                                                parentWindow: probeWin,
                                                probe: precord,
                                                record: record,
                                                style: 'z-index: -1;'
                                            });
                                        win.initData(record);
                                        win.show();
                                        win.setPosition(35 + probeWin.width);
                                    }
                                });
                        }
                    }
                });
                break;
            case 'probeId':
                Lada.model.Probe.load(id, {
                    scope: row,
                    callback: function(record, operation, success) {
                        if (success) {
                            var win = Ext.create('Lada.view.window.ProbeEdit', {
                                record: record,
                                style: 'z-index: -1;'
                            });
                            win.initData(record);
                            win.show();
                            win.setPosition(30);
                        }
                    }
                });
                break;
            case 'mpId':
                Lada.model.Messprogramm.load(id, {
                    success: function(record) {
                        var win = Ext.create(
                            'Lada.view.window.Messprogramm', { record: record });
                        win.initData(record);
                        win.show();
                    }
                });
                break;
            case 'ortId':
                Lada.model.Ort.load(id, {
                    success: function(record) {
                        var win = Ext.create(
                            'Lada.view.window.Ort', {
                                record: record});
                        win.show();
                    }
                });
                break;
            case 'probenehmer':
                Lada.model.Probenehmer.load(id, {
                    success: function(record) {
                        var win = Ext.create(
                            'Lada.view.window.Probenehmer', {
                                record: record});
                        win.show();
                    }
                });
                break;
            case 'dsatzerz':
                Lada.model.DatensatzErzeuger.load(id, {
                    success: function(record) {
                        var win = Ext.create(
                            'Lada.view.window.DatensatzErzeuger', {
                                record: record});
                        win.show();
                    }
                });
                break;
            case 'mprkat':
                Lada.model.MessprogrammKategorie.load(id, {
                    success: function(record) {
                        var win = Ext.create(
                            'Lada.view.window.MessprogrammKategorie', {
                                record: record});
                        win.show();
                    }
                });
                break;
        }
    },

    deleteData: function(button) {
        var grid = button.up('dynamicgrid');
        if (grid.rowtarget.hasOwnProperty('dataType')) {
            var selection =grid.getView().getSelectionModel().getSelection();
            var ids = [];
            for (var i=0; i < selection.length; i++) {
                ids.push(selection[i].get(grid.rowtarget.dataIndex));
            }
            var win = Ext.create('Lada.view.window.DeleteMultipleItems', {
                selection: selection,
                parentGrid: grid
            });
            win.show();
        }
    },

    addData: function(button) {
        var grid = button.up('dynamicgrid');
        if (grid.rowtarget.hasOwnProperty('dataType')) {
            switch (grid.rowtarget.dataType) {
                case 'mpId':
                    var win = Ext.create(
                        'Lada.view.window.Messprogramm', {record: null});
                    win.initData();
                    win.show();
                    break;
                case 'probeId':
                    var win = Ext.create('Lada.view.window.ProbeCreate');
                    win.initData();
                    win.show();
                    win.setPosition(30);
                    break;
                case 'probenehmer':
                    var win = Ext.create('Lada.view.window.Probenehmer', {
                        record: Ext.create('Lada.model.Probenehmer')
                    });
                    win.show();
                    break;
                case 'dsatzerz':
                    var win = Ext.create('Lada.view.window.DatensatzErzeuger', {
                        record: Ext.create('Lada.model.DatensatzErzeuger',
                            {readonly: false})
                    });
                    win.show();
                    break;
                case 'mprkat':
                    var win = Ext.create('Lada.view.window.MessprogrammKategorie', {
                        record: Ext.create('Lada.model.MessprogrammKategorie',
                            {readonly: false})
                    });
                    win.show();
                    break;
                case 'ortId':
                    Ext.create('Lada.view.window.Ort',{
                        record: Ext.create('Lada.model.Ort', {
                            ortTyp: 1,
                            readonly: false
                        }),
                        parentWindow: grid
                    }).show();
                    break;
            }
        }
    },

    selectionChanged: function(selModel, selected) {
        var grid = selModel.view.up('grid');
        if (selected.length) {
            this.buttonToggle(true, grid);
        } else {
            this.buttonToggle(false, grid);
        }
    }
});
