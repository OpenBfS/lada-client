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

    addItem: function() {
        var win = Ext.create('Lada.view.window.ProbeCreate');
        win.show();
        win.initData();
    },

    uploadFile: function() {
        var win = Ext.create('Lada.view.window.FileUpload', {
            title: 'Datenimport',
            modal: true
        });

        win.show();
    },

    downloadFile: function(button) {
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        var proben = [];
        for (var i = 0; i < selection.length; i++) {
            proben.push(selection[i].get('id'));
        }

        Ext.Ajax.request({
            method: 'POST',
            url: '/lada-server/export/laf',
            jsonData: {'proben': proben},
            headers: {'X-OPENID-PARAMS': Lada.openIDParams},
            success: function(response) {
                var content = response.responseText;
                var blob = new Blob([content],{type: 'text/plain'});
                saveAs(blob, 'export.laf');
            },
            failure: function() {
                Ext.Msg.alert('Fehler', 'Failed to create LAF-File!');
            }
        });
    }
});
