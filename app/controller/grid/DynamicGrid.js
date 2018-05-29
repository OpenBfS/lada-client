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
    requires: ['Lada.view.window.DeleteMultipleProbe'],

    /**
     * Initialize the Controller with listeners
     */
    init: function() {
        this.control({
            'dynamicgrid': {
                itemdblclick: this.openItem,
                select: this.activateButtons,
                deselect: this.deactivateButtons
            },
            'dynamicgrid pagingtoolbar': {
                change: this.pageChange
            },
            'button[action=print]': {
                click: this.printSelection
            },
            'button[action=genericdelete]': {
                click: this.deleteData
            }// ,
            // 'button[action=genericadd]': {
            //     click: this.addData
            // }
        });
        this.callParent(arguments);
    },

    /**
     * Send the selection to a Printservice
     */
    printSelection: function(button) {

        //disable Button and setLoading...
        button.disable();
        button.setLoading(true);

        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var columns = [];
        var columnNames = [];
        var visibleColumns = [];
        var displayName = '';
        var data = [];

        // Write the columns to an array
        try {
            for (key in selection[0].data) {
                // Do not write owner or readonly or id
                if (['owner', 'readonly', 'id', 'probeId'].indexOf(key) == -1) {
                    columns.push(key);
                }
            }
        } catch (e) {
            console.log(e);
        }

        //Retrieve visible columns' id's and names.
        // and set displayName
        try {
            var grid = button.up('grid');
            var cman = grid.columnManager;
            var cols = cman.getColumns();

            displayName = grid.down('tbtext').text;

            for (key in cols) {
                if (cols[key].dataIndex) {
                    visibleColumns[cols[key].dataIndex] = cols[key].text;
                }
            }
        } catch (e) {
            console.log(e);
        }

        // Retrieve Data from selection
        try {
            for (item in selection) {
                var row = selection[item].data;
                var out = [];
                //Lookup every column and write to data array.
                for (key in columns) {
                    var attr = columns[key];
                    //Only write data to output when the column is not hidden.
                    if (row[attr] != null &&
                        visibleColumns[attr] != null) {
                        out.push(row[attr].toString());
                    } else if (visibleColumns[attr] != null) {
                        out.push('');
                    }
                }
                data.push(out);
            }
        } catch (e) {
            console.log(e);
        }

        //Retrieve the names of the columns.
        try {
            var grid = button.up('grid');
            var cman = grid.columnManager;
            var cols = cman.getColumns();
            //Iterate columns and find column names for the key...
            // This WILL run into bad behaviour when column-keys exist twice.
            for (key in columns) {
                for (k in cols) {
                    if (cols[k].dataIndex == columns[key]) {
                        columnNames.push(cols[k].text);
                        break;
                    }
                }
            }
        } catch (e) {
            console.log(e);
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
                    if (json.errors.totalCount > 0 || json.warnings.totalCount > 0) {
                        formPanel.setMessages(json.errors, json.warnings);
                    }
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
    activateButtons: function(rowModel) {
        var grid = rowModel.view.up('grid');
        this.buttonToggle(true, grid);
    },

    /**
     * Toggles the generic buttons in the toolbar
     **/
    deactivateButtons: function(rowModel) {
        var grid = rowModel.view.up('grid');
        // Only disable buttons when nothing is selected
        if (rowModel.selected.items.length === 0) {
            this.buttonToggle(false, grid);
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
        var rowExpander = grid.plugins[0];
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
                                    callback: function(
                                        precord, poperation, psuccess) {
                                        var win = Ext.create(
                                            'Lada.view.window.MessungEdit', {
                                            probe: precord,
                                            record: record,
                                            style: 'z-index: -1;'
                                        });
                                        win.initData();
                                        win.show();
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
                    }
                });
                break;
            case 'ortId':
                Lada.model.Messprogramm.load(id, {
                    success: function(record) {
                        var win = Ext.create(
                            'Lada.view.window.Messprogramm', {
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
            switch (grid.rowtarget.dataType) {
                case 'probeId':
                    var selection =grid.getView().getSelectionModel().getSelection();
                    var win = Ext.create('Lada.view.window.DeleteMultipleProbe', {
                        selection: selection,
                        parentWindow: grid
                    });
                    win.show();
                    break;
            }
        }
    },

    // TODO: Button to add an item (probe, Messung, messprogramm
    // addData: function(button) {}
});
