/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for the MessungList result grid.
 */
Ext.define('Lada.controller.grid.MessungList', {
    extend: 'Ext.app.Controller',
    requires: [
        'Lada.view.window.SetStatus',
        'Lada.view.window.ProbeEdit'
    ],

    /**
     * Initialize the Controller with listeners
     */
    init: function() {
        this.control({
            'messunglistgrid': {
                itemdblclick: this.editItem,
                select: this.activateButtons,
                deselect: this.deactivateButtons
            },
            'messunglistgrid toolbar button[action=setstatus]': {
                click: this.setStatus
            },
            'messunglistgrid toolbar button[action=print]':{
                click: this.printSelection
            },
            'messunglistgrid pagingtoolbar': {
                change: this.pageChange
            }
        });
        this.callParent(arguments);
    },

    /**
     * Sets the Status on Bulk
     **/
    setStatus: function(button) {
        //disable Button and setLoading...

        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        var i18n = Lada.getApplication().bundle;

        var win = Ext.create('Lada.view.window.SetStatus', {
            title: i18n.getMsg('statusSetzen.win.title'),
            grid: grid,
            modal: true,
            selection: selection
        });

        win.show();

    },


    /**
     * This function is called after a Row in the
     * {@link Lada.view.grid.ProbeList}
     * was double-clicked.
     * The function opens a {@link Lada.view.window.ProbeEdit}
     * or a {@link Lada.view.window.Messprogramm}.
     * To determine which window has to be opened, the function
     * analyse the records modelname.
     */
    editItem: function(grid, record) {
        var probeRecord = Ext.create('Lada.model.ProbeList');
        probeRecord.setId(record.get('probeId'));
        probeRecord.set('owner', record.get('owner'));
        probeRecord.set('readonly', record.get('readonly'));

        var probeWin = Ext.create('Lada.view.window.ProbeEdit', {
            record: probeRecord,
            style: 'z-index: -1;' //Fixes an Issue where windows could not be created in IE8
        });

        probeWin.setPosition(30);
        probeWin.show();
        probeWin.initData();

        Ext.ClassManager.get('Lada.model.Probe').load(record.get('probeId'), {
            failure: function(record, action) {
                me.setLoading(false);
                // TODO
                console.log('An unhandled Failure occured. See following Response and Record');
                console.log(action);
                console.log(record);
            },
            success: function(precord, response) {
                var messungWin = Ext.create('Lada.view.window.MessungEdit', {
                    parentWindow: probeWin,
                    probe: precord,
                    record: record,
                    grid: grid
                });
                messungWin.show();
                messungWin.setPosition(window.innerWidth - 30 - messungWin.width);
                messungWin.initData();
            }
        });
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
        var endpoint = 'lada_print';

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
            url: 'lada-printer/print/' + endpoint + '/buildreport.pdf',
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
     * Toggles the buttons in the toolbar
     **/
    activateButtons: function(rowModel, record) {
        var grid = rowModel.view.up('grid');
        this.buttonToggle(true, grid);
    },

    /**
     * Toggles the buttons in the toolbar
     **/
    deactivateButtons: function(rowModel, record) {
        var grid = rowModel.view.up('grid');
        // Only disable buttons when nothing is selected
        if (rowModel.selected.items == 0) {
            this.buttonToggle(false, grid);
        }
    },

    /**
     * Enables/Disables a set of buttons
     **/
    buttonToggle: function(enabled, grid) {
        if (!enabled) {
            grid.down('button[action=print]').disable();
            grid.down('button[action=setstatus]').disable();
        } else {
            grid.down('button[action=print]').enable();
            // TODO: enable button only on messungen with owner == true and
            // readonly == false
            grid.down('button[action=setstatus]').enable();
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
        var nodes = rowExpander.view.getNodes();
        for (var i = 0; i < nodes.length; i++) {
            var node = Ext.fly(nodes[i]);
            if (node.hasCls(rowExpander.rowCollapsedCls) === false) {
                rowExpander.toggleRow(i, store.getAt(i));
            }
        }
    }
});
