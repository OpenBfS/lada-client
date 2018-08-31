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
            'button[action=print]': {
                click: this.printSelection
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
     * Send the selection to a Printservice
     */
    printSelection: function(button) {

        //disable Button and setLoading...
        button.disable();

        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        var i18n = Lada.getApplication().bundle;
        var columns = [];
        var columnNames = [];
        var visibleColumns = {};
        var displayName = '';
        var data = [];

        // Write the columns to an array
        try {
            for (var key in selection[0].data) {
                // Do not write owner or readonly or id
                if (['owner', 'readonly', 'id', 'probeId'].indexOf(key) === -1) {
                    columns.push(key);
                }
            }
        } catch (e) {
            console.log(e);
        }

        //Retrieve visible columns' id's and names.
        // and set displayName
        var cols = grid.visibleColumnManager.columns;
        displayName = i18n.getMsg('rowtarget.title.'+ grid.rowtarget.dataType);
        for (key in cols) {
            if (cols[key].dataIndex) {
                var d_i = cols[key].dataIndex;
                visibleColumns[d_i] = {text: cols[key].text};
                if (cols[key].dataType) {
                    visibleColumns[d_i].dataType = cols[key].dataType.name;
                    visibleColumns[d_i].format = cols[key].dataType.format;
                }
            }
        }

        // Retrieve Data from selection
        for (var item in selection) {
            var row = selection[item].data;
            var out = [];
            //Lookup every column and write to data array.
            for (key in columns) {
                var attr = columns[key];
                //Only write data to output when the column is not hidden.
                if (row[attr] !== null && visibleColumns[attr].text !== null) {
                    if (visibleColumns[attr].dataType === 'date') {
                        out.push(
                            Ext.Date.format(
                                new Date(row[attr]),
                                visibleColumns[attr].format
                            )
                        );
                    } else {
                        out.push(row[attr].toString());
                    }
                } else if (visibleColumns[attr].text !== null) {
                    out.push('');
                }
            }
            data.push(out);
        }

        //Retrieve the names of the columns.
        for (key in columns) {
            for (var k in cols) {
                if (cols[k].dataIndex === columns[key]) {
                    columnNames.push(cols[k].text);
                    break;
                }
            }
        }

        var printData = {
            'layout': 'A4 landscape',
            'outputFormat': 'pdf',
            'attributes': {
                'title': 'Auszug aus LADA',
                'displayName': displayName,
                'table': {
                    'columns': columnNames,
                    'data': data
                }
            }
        };

        Ext.Ajax.request({
            url: 'lada-printer/print/lada_print/buildreport.pdf',
            //configure a proxy in apache conf!
            jsonData: printData,
            binary: true,
            success: function(response) {
                var content = response.responseBytes;
                var filetype = response.getResponseHeader('Content-Type');
                var blob = new Blob([content],{type: filetype});
                saveAs(blob, 'lada-print.pdf');
                button.enable();
                button.setLoading(false);
            },
            failure: function(response) {
                button.enable();
                button.setLoading(false);
                if (!response.getResponse) {
                    Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                        i18n.getMsg('err.msg.print.noContact'));
                    return;
                }
                if (response.getResponse().responseText) {
                    try {
                        var json = Ext.JSON.decode(response.getResponse().responseText);
                    } catch (e) {
                        console.log(e);
                    }
                }
                if (json) {
                    if (json.message) {
                        Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.generic.title')
                            +' #'+json.message,
                        Lada.getApplication().bundle.getMsg(json.message));
                    } else {
                        Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                            i18n.getMsg('err.msg.print.noContact'));
                    }
                } else {
                    Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                        i18n.getMsg('err.msg.print.noContact'));
                }
            }
        });
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
                                        probeWin.setPosition(30);
                                        probeWin.show();
                                        probeWin.initData();
                                        var win = Ext.create(
                                            'Lada.view.window.MessungEdit', {
                                                parentWindow: probeWin,
                                                probe: precord,
                                                record: record,
                                                style: 'z-index: -1;'
                                            });
                                        win.initData();
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
                            win.setPosition(30);
                            win.show();
                            win.initData();
                        }
                    }
                });
                break;
            case 'mpId':
                Lada.model.Messprogramm.load(id, {
                    success: function(record) {
                        var win = Ext.create(
                            'Lada.view.window.Messprogramm', {
                                record: record});
                        win.show();
                        win.initData();
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
                    win.show();
                    win.initData();
                    break;
                case 'probeId':
                    var win = Ext.create('Lada.view.window.ProbeCreate');
                    win.setPosition(30);
                    win.show();
                    win.initData();
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
