/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for Messprogramme items in search result grids
 */
Ext.define('Lada.controller.grid.MessprogrammeList', {
    extend: 'Ext.app.Controller',
    requires: [
        'Lada.view.window.Messprogramm',
        'Lada.view.window.GenProbenFromMessprogramm'
    ],

    /**
     * Initialize the Controller with listeners
     */
    init: function() {
        this.control({
            'dynamicgrid toolbar button[action=addMessprogramm]': {
                click: this.addMessprogrammItem
            },
            'dynamicgrid toolbar button[action=genProbenFromMessprogramm]': {
                click: this.genProbenFromMessprogramm
            },
            'dynamicgrid toolbar button [action=setActiveNo]': {
                click: this.setActiveNo
            },
            'dynamicgrid toolbar button [action=setActiveYes]': {
                click: this.setActiveYes
            }
        });
        this.callParent(arguments);
    },

    /**
     * This function opens a new window to create a Messprogramm
     * {@link Lada.view.window.Messprogramm}
     */
    addMessprogrammItem: function() {
        var win = Ext.create('Lada.view.window.Messprogramm');
        win.initData();
        win.show();
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
        var i18n = Lada.getApplication().bundle;
        var ids = [];
        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        for (var i = 0; i < selection.length; i++) {
            ids.push(selection[i].data[grid.rowtarget.dataIndex]);
        }
        if (ids.length) {
            Ext.Ajax.request({
                url: 'lada-server/rest/messprogramm/aktiv',
                method: 'PUT',
                jsonData: {
                    aktiv: active,
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
                failure: function() {
                    var errorWin = Ext.create('Ext.window.Window', {
                        title: i18n.getMsg('setActiveMp.failure.title'),
                        modal: true,
                        layout: 'vbox',
                        items: [{
                            xtype: 'container',
                            html: i18n.getMsg('export.failednoreason'),
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
            });
        }
    }
});

