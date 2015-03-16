/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for filter result grid.
 */
Ext.define('Lada.controller.FilterResult', {
    extend: 'Ext.app.Controller',
    requires: [
        'Lada.view.window.ProbeEdit'
    ],

    init: function() {
        this.control({
            'filterresultgrid': {
                itemdblclick: this.editItem
            },
            'filterresultgrid toolbar button[action=add]': {
                click: this.addItem
            },
            'filterresultgrid toolbar button[action=import]': {
                click: this.uploadFile
            },
            'filterresultgrid toolbar button[action=export]': {
                click: this.downloadFile
            }
        });
        this.callParent(arguments);
    },

    editItem: function(grid, record) {
        var win = Ext.create('Lada.view.window.ProbeEdit', {
            record: record
        });
        win.show();
        win.initData();
    },

    addItem: function(button) {
        var win = Ext.create('Lada.view.window.ProbeCreate');
        win.show();
        win.initData();

    },

    uploadFile: function(button) {

    },

    downloadFile: function(button) {

    }
});
