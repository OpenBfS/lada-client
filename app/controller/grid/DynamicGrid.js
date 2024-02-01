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
    extend: 'Lada.controller.BaseController',
    alias: 'controller.dynamicgridcontroller',
    requires: [
        'Lada.view.window.DeleteMultipleItems',
        'Lada.view.window.GenProbenFromMessprogramm',
        'Lada.view.window.Probe',
        'Lada.view.window.SetTags',
        'Lada.view.window.TagManagement'
    ],

    /**
     * Initialize the Controller with listeners
     */
    init: function() {
        this.control({
            'dynamicgrid': {
                itemdblclick: this.openItem,
                select: this.handleSelect,
                selectall: this.handleSelectAll,
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
            },
            'dynamicgrid toolbar button[action=genProbenFromMessprogramm]': {
                click: this.genProbenFromMessprogramm
            },
            'dynamicgrid toolbar button [action=setActiveNo]': {
                click: this.setActiveNo
            },
            'dynamicgrid toolbar button [action=setActiveYes]': {
                click: this.setActiveYes
            },
            'dynamicgrid toolbar button[action=setstatus]': {
                click: this.setStatus
            },
            'button[action=addMap]': {
                click: this.activateDraw
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
            map.fireEvent('selectfeature', null, record, true);
        }
        this.buttonToggle(true, grid);
    },

    /**
     * Handle selection of all records at once.
     * @param {*} records List of selected records
     */
    handleSelectAll: function(grid, records) {
        var map = Ext.ComponentQuery.query('map')[0];
        if (map) {
            map.fireEvent('selectmultiplefeatures', records);
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
        for (var i = 0; i < buttons.items.length; i++) {
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
        //Fire gridreload event to update map after page change
        Ext.getCmp('querypanelid').fireEvent('gridreload');
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
                    'Lada.view.window.Messung', {
                        recordId: id,
                        style: 'z-index: -1;'
                    });
                if (win.show()) {
                    win.loadRecord(
                        id,
                        row,
                        function(newRecord, operation, success) {
                            win.setLoading(true);
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
                                    'Lada.view.window.Probe', {
                                        recordId: messungRecord.get('sampleId'),
                                        style: 'z-index: -1;'
                                    });
                                if (!probeWin.show()) {
                                    probeWin.destroy();
                                    probeWin = Ext.ComponentQuery.query(
                                        'probenedit[recordId='
                                        + messungRecord.get('sampleId')
                                        + ']')[0];
                                }
                                win.parentWindow = probeWin;
                                probeWin.addChild(win);
                                probeWin.setPosition(30);
                                win.setPosition(35 + probeWin.width);
                                /* eslint-disable max-len */
                                probeWin.loadRecord(
                                    messungRecord.get('sampleId'),
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
                                        probeWin.setRecord(precord);
                                        probeWin.initData(precord);
                                        win.setProbe(precord);
                                        win.setRecord(messungRecord);
                                        win.initData(messungRecord);
                                        win.setLoading(false);
                                    });
                            }
                        });
                }
                break;
            case 'probeId':
                win = Ext.create('Lada.view.window.Probe', {
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
            case 'tagId':
                win = Ext.create('Lada.view.window.TagManagement', {
                    recordId: id,
                    parentGrid: row.grid
                }).show();
                break;
        }
    },

    deleteData: function(button) {
        var grid = button.up('dynamicgrid');
        if (grid.rowtarget.hasOwnProperty('dataType')) {
            var selection = grid.getView().getSelectionModel().getSelection();
            var ids = [];
            for (var i = 0; i < selection.length; i++) {
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
                    win = Ext.create('Lada.view.window.Probe');
                    win.initData();
                    win.show();
                    win.setPosition(30);
                    break;
                case 'probenehmer':
                    win = Ext.create('Lada.view.window.Probenehmer', {
                        record: Ext.create('Lada.model.Sampler')
                    });
                    win.show();
                    break;
                case 'dsatzerz':
                    win = Ext.create('Lada.view.window.DatensatzErzeuger', {
                        record: Ext.create('Lada.model.DatasetCreator',
                            {readonly: false})
                    });
                    win.show();
                    break;
                case 'mprkat':
                    win = Ext.create('Lada.view.window.MessprogrammKategorie', {
                        record: Ext.create('Lada.model.MpgCateg',
                            {readonly: false})
                    });
                    win.show();
                    break;
                case 'ortId':
                    Ext.create('Lada.view.window.Ort', {
                        record: Ext.create('Lada.model.Site', {
                            siteClassId: 1,
                            readonly: false,
                            plausibleReferenceCount: 0,
                            referenceCountMp: 0,
                            referenceCount: 0
                        }),
                        parentWindow: grid
                    }).show();
                    break;
                case 'tagId':
                    Ext.create('Lada.view.window.TagManagement', {
                        parentGrid: grid }
                    ).show();
            }
        }
    },

    /**
     * This button creates a window to generate Proben
     * from a selected messprogramm.
     */
    genProbenFromMessprogramm: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        var ids = [];
        for (var i = 0; i < selection.length; i++) {
            ids.push(selection[i].data[grid.rowtarget.dataIndex]);
        }
        var win = Ext.create('Lada.view.window.GenProbenFromMessprogramm', {
            ids: ids,
            parentWindow: grid
        });
        win.show();
    },

    setActiveNo: function(button) {
        this.doSetActive(false, button);
    },
    setActiveYes: function(button) {
        this.doSetActive(true, button);
    },
    doSetActive: function(active, button) {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var ids = [];
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        for (var i = 0; i < selection.length; i++) {
            ids.push(selection[i].data[grid.rowtarget.dataIndex]);
        }
        if (ids.length) {
            Ext.Ajax.request({
                url: 'lada-server/rest/mpg/active',
                method: 'PUT',
                jsonData: {
                    active: active,
                    ids: ids
                },
                success: function(response) {
                    var json = Ext.JSON.decode(response.responseText);
                    var resultMessage = '';
                    for (var j = 0; j < json.data.length; j++) {
                        if (json.data[j].success !== 200) {
                            resultMessage += '<strong>'
                                + i18n.getMsg('messprogramm') + ': '
                                + json.data[j].id
                                + '</strong><br><dd>'
                                + i18n.getMsg(json.data[j].success)
                                + '</dd><br>';
                        }
                    }
                    if (resultMessage) {
                        var errorWin = Ext.create('Ext.window.Window', {
                            title: i18n.getMsg('setActiveMp.failure.title'),
                            modal: true,
                            layout: 'vbox',
                            width: 340,
                            height: 165,
                            autoScroll: true,
                            items: [{
                                xtype: 'container',
                                html: resultMessage,
                                margin: '10, 5, 5, 5'
                            }, {
                                xtype: 'container',
                                layout: 'hbox',
                                items: [{
                                    xtype: 'button',
                                    text: i18n.getMsg('close'),
                                    margin: '5, 0, 5, 5',
                                    handler: function() {
                                        errorWin.close();
                                    }
                                }]
                            }]
                        });
                        errorWin.show();
                    }
                    var grids = Ext.ComponentQuery.query('dynamicgrid');
                    if (grids.length) {
                        grids[0].reload();
                    }
                },
                failure: function(response) {
                    me.handleRequestFailure(
                        response, 'setActiveMp.failure.title');
                }
            });
        }
    },

    /**
     * Sets the Status on Bulk
     **/
    setStatus: function(button) {
        var i18n = Lada.getApplication().bundle;
        var grid = button.up('grid');
        var win = Ext.create('Lada.view.window.SetStatus', {
            title: i18n.getMsg('statusSetzen.win.title'),
            grid: grid,
            modal: true,
            selection: grid.getView().getSelectionModel().getSelection()
        });
        win.show();
    },

    activateDraw: function(button) {
        var map = button.up('dynamicgrid').down('map');
        var record = Ext.create('Lada.model.Site');
        map.activateDraw(record);
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
        var selection = [];
        grid.getView().getSelectionModel().getSelection().forEach(
            function(item, i) {
                selection[i] = item.get(grid.rowtarget.dataIndex);
            });
        var i18n = Lada.getApplication().bundle;
        var count = selection.length;
        var win = Ext.create('Lada.view.window.SetTags', {
            title: i18n.getMsg('tag.assignwindow.title.' + recordType, count),
            recordType: recordType,
            parentGrid: grid
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
