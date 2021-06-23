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
            'button[action=assigntags]': {
                click: this.assignTags
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
        if (!id || record.phantom) {
            return;
        }
        var win;
        switch (row.grid.rowtarget.dataType) {
            case 'messungId':
                win = Ext.create(
                    'Lada.view.window.MessungEdit', {
                        recordId: id,
                        style: 'z-index: -1;'
                    });
                if (win.show()) {
                    win.loadRecord(
                        id,
                        row,
                        function(newRecord, operation, success) {
                            if (!newRecord || !operation) {
                                Ext.log({
                                    msg: 'Loading messung record failed',
                                    level: 'warn'
                                });
                                return;
                            }
                            if (success) {
                                var messungRecord = newRecord;
                                var probeWin = Ext.create(
                                    'Lada.view.window.ProbeEdit', {
                                        recordId: messungRecord.get('probeId'),
                                        style: 'z-index: -1;'
                                    });
                                if (!probeWin.show()) {
                                    probeWin.destroy();
                                    probeWin = Ext.ComponentQuery.query(
                                        'probenedit[recordId='
                                        + messungRecord.get('probeId')
                                        + ']')[0];
                                }
                                win.parentWindow = probeWin;
                                probeWin.addChild(win);
                                probeWin.setPosition(30);
                                win.setPosition(35 + probeWin.width);
                                /* eslint-disable max-len */
                                probeWin.loadRecord(
                                    messungRecord.get('probeId'),
                                    this,
                                    function(precord, poperation) {
                                        if (
                                            !precord ||
                                            !poperation ||
                                            !poperation.getResponse()
                                        ) {
                                            Ext.log({
                                                msg: 'Loading probe record failed',
                                                level: 'warn'
                                            });
                                            return;
                                        }
                                        /* eslint-enable max-len */
                                        var pjson = poperation ?
                                            Ext.decode(
                                                poperation.getResponse()
                                                    .responseText) :
                                            null;
                                        probeWin.setRecord(precord);
                                        probeWin.initData(precord);
                                        probeWin.setMessages(
                                            pjson.errors,
                                            pjson.warnings,
                                            pjson.notifications);
                                        win.setProbe(precord);
                                        win.setRecord(messungRecord);
                                        win.initData(messungRecord);
                                        var json = operation ?
                                            Ext.decode(
                                                operation.getResponse()
                                                    .responseText) :
                                            null;
                                        win.setMessages(
                                            json.errors,
                                            json.warnings,
                                            json.notifications);
                                    });
                            }
                        });
                }
                break;
            case 'probeId':
                win = Ext.create('Lada.view.window.ProbeEdit', {
                    style: 'z-index: -1;',
                    recordId: id
                });
                if (win.show()) {
                    win.setPosition(30);
                    win.loadRecord(
                        id,
                        row,
                        function(newRecord, operation, success) {
                            if (success) {
                                win.setRecord(newRecord);
                                win.initData(newRecord);
                                var json = operation ?
                                    Ext.decode(
                                        operation.getResponse().responseText) :
                                    null;
                                win.setMessages(
                                    json.errors,
                                    json.warnings,
                                    json.notifications);
                            }
                        });
                }
                break;
            case 'mpId':
                win = Ext.create(
                    'Lada.view.window.Messprogramm', {
                        recordId: id
                    });
                if (win.show()) {
                    win.loadRecord(
                        id,
                        this,
                        function(newRecord, operation, success) {
                            if (success) {
                                win.setRecord(newRecord);
                                win.initData(newRecord);
                            }
                        });
                }

                break;
            case 'ortId':
                win = Ext.create(
                    'Lada.view.window.Ort', {
                        recordId: id});
                if (win.show()) {
                    win.loadRecord(
                        id,
                        this,
                        function(newRecord, operation, success) {
                            if (success) {
                                win.initData(newRecord);
                            }
                        });
                }

                break;
            case 'probenehmer':
                win = Ext.create(
                    'Lada.view.window.Probenehmer', {
                        recordId: id});
                if (win.show()) {
                    win.loadRecord(
                        id,
                        this,
                        function(newRecord, operation, success) {
                            if (success) {
                                win.initData(newRecord);
                            }
                        });
                }
                break;
            case 'dsatzerz':
                win = Ext.create(
                    'Lada.view.window.DatensatzErzeuger', {
                        recordId: id});
                if (win.show()) {
                    win.loadRecord(
                        id,
                        this,
                        function(newRecord, operation, success) {
                            if (success) {
                                win.initData(newRecord);
                            }
                        });
                }

                break;
            case 'mprkat':
                win = Ext.create(
                    'Lada.view.window.MessprogrammKategorie', {
                        recordId: id});
                if (win.show()) {
                    win.loadRecord(
                        id,
                        this,
                        function(newRecord, operation, success) {
                            if (success) {
                                win.initData(newRecord);
                            }
                        });
                }
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
                    win = Ext.create('Lada.view.window.ProbeCreate');
                    win.initData();
                    win.show();
                    win.setPosition(30);
                    break;
                case 'probenehmer':
                    win = Ext.create('Lada.view.window.Probenehmer', {
                        record: Ext.create('Lada.model.Probenehmer')
                    });
                    win.show();
                    break;
                case 'dsatzerz':
                    win = Ext.create('Lada.view.window.DatensatzErzeuger', {
                        record: Ext.create('Lada.model.DatensatzErzeuger',
                            {readonly: false})
                    });
                    win.show();
                    break;
                case 'mprkat':
                    win = Ext.create('Lada.view.window.MessprogrammKategorie', {
                        record: Ext.create('Lada.model.MessprogrammKategorie',
                            {readonly: false})
                    });
                    win.show();
                    break;
                case 'ortId':
                    Ext.create('Lada.view.window.Ort', {
                        record: Ext.create('Lada.model.Ort', {
                            ortTyp: 1,
                            readonly: false,
                            plausibleReferenceCount: 0,
                            referenceCountMp: 0,
                            referenceCount: 0
                        }),
                        parentWindow: grid
                    }).show();
                    break;
            }
        }
    },

    /**
     * Gets the selected probe items and opens the tag assign window
     */
    assignTags: function(button) {
        var grid = button.up('grid');
        var recordType = null;
        switch (grid.rowtarget.dataType) {
            case 'messungId': recordType = 'messung'; break;
            case 'probeId': recordType = 'probe'; break;
            default: break;
        }
        var selection = grid.getView().getSelectionModel().getSelection();
        var i18n = Lada.getApplication().bundle;
        var count = selection.length;
        var win = Ext.create('Lada.view.window.TagEdit', {
            title: i18n.getMsg('tag.assignwindow.title.' + recordType, count),
            recordType: recordType,
            selection: selection
        });
        win.show();

    },

    /**
     * Handle changes of selected grid records
     * @param {*} selModel
     * @param {*} selected
     */
    selectionChanged: function(selModel, selected) {
        var grid = selModel.view.up('grid');
        //If print window is active, set this grid as currently active grid
        var win = Lada.view.window.PrintGrid.getInstance();
        if (win) {
            win.setParentGrid(grid);
        }
        if (selected.length) {
            this.buttonToggle(true, grid);
        } else {
            this.buttonToggle(false, grid);
        }
    }
});
