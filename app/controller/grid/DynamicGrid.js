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
    requires: [],

    /**
     * Initialize the Controller with listeners
     */
    init: function() {
        this.control({
            'dynamicgrid': {
                // itemdblclick: this.TODO,
                // TODO: Should check if the line contains/is a probe, messung, etc.,
                // TODO and infer  the action from there #1926
                select: this.activateButtons,
                deselect: this.deactivateButtons
            },
            'dynamicgrid pagingtoolbar': {
                change: this.pageChange
            },
            'button[action=print]': {
                click: this.printSelection
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
            url: 'lada-printer/buildreport.pdf',
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
                if (!response.getResponse){
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
    activateButtons: function(rowModel, record) {
        var grid = rowModel.view.up('grid');
        this.buttonToggle(true, grid);
    },

    /**
     * Toggles the generic buttons in the toolbar
     **/
    deactivateButtons: function(rowModel, record) {
        var grid = rowModel.view.up('grid');
        // Only disable buttons when nothing is selected
        if (rowModel.selected.items == 0) {
            this.buttonToggle(false, grid);
        }
    },

    /**
     * Enables/Disables the generic set of buttons
     **/
    buttonToggle: function(enabled, grid) {
        if (!enabled) {
            grid.down('button[action=print]').disable();
            grid.down('button[action=gridexport]').disable();
        } else {
            grid.down('button[action=print]').enable();
            grid.down('button[action=gridexport]').enable();
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
        if (rowExpander && rowExpander.ptype === 'gridrowexpander'){
            var nodes = rowExpander.view.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                var node = Ext.fly(nodes[i]);
                if (node.hasCls(rowExpander.rowCollapsedCls) === false) {
                    rowExpander.toggleRow(i, store.getAt(i));
                }
            }
        }
    }
});
