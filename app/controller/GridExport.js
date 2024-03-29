/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for invoking export windows. It controls all buttons with the
 * action 'gridexport', providing generic export options for every grid with
 * such a button in their toolbar
 */
Ext.define('Lada.controller.GridExport', {
    extend: 'Ext.app.Controller',
    requires: ['Lada.view.window.GridExport'],
    init: function() {
        this.control({
            'button[action=gridexport]': {
                click: this.openExportWindow
            }
        });
    },

    openExportWindow: function(button) {
        if (button.isDisabled()) {
            return;
        }
        var grid = button.up('grid');
        var i18n = Lada.getApplication().bundle;
        var failmessage = false;
        if (!grid || !grid.store.getCount()) {
            failmessage = i18n.getMsg('export.nodata');
        } else if (!grid.rowtarget) {
            failmessage = i18n.getMsg('undefined'); // should not happen
        }
        if (failmessage !== false) {
            Ext.create('Ext.window.Window', {
                title: i18n.getMsg('export.failed'),
                modal: true,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'container',
                    html: failmessage,
                    margin: '10, 5, 5, 5'
                }, {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    defaults: {
                        margin: '5,5,5,5'
                    },
                    items: [{
                        xtype: 'button',
                        text: i18n.getMsg('export.continue'),
                        margin: '5, 0, 5, 5',
                        handler: function(btn) {
                            btn.up('window').close();
                        }
                    }]
                }]
            }).show();
        } else {
            var options = {grid: grid};
            if (grid.rowtarget.dataType === 'messungId') {
                options.hasMessung = grid.rowtarget.dataIndex;
            } else if (grid.rowtarget.dataType === 'probeId') {
                options.hasProbe = grid.rowtarget.dataIndex;
            }
            Ext.create('Lada.view.window.GridExport', options).show();
        }
    }
});
