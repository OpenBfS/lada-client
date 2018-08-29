/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to show a confirmation dialog to delete a Probe and a progress bar after confirmation
 */
Ext.define('Lada.view.window.DeleteMultipleItems', {
    extend: 'Ext.window.Window',
    alias: 'widget.deleteMultipleItems',

    collapsible: true,
    maximizable: true,
    autoShow: true,
    layout: 'vbox',
    constrain: true,
    selection: null,
    parentWindow: null,
    confWin: null,
    maxSteps: 0,
    currentProgress: 0,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function() {
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function() {
                this.getEl().addCls('window-inactive');
            }
        });
        this.items = [{
            xtype: 'panel',
            height: 150,
            width: 340,
            autoScroll: true,
            overflow: 'auto',
            html: '',
            margin: '5, 5, 5, 5'
        }, {
            xtype: 'progressbar',
            text: i18n.getMsg('progress'),
            height: 25,
            width: 340,
            hidden: false,
            margin: '5, 5, 5, 5'
        }];
        var title = '';
        var dialog1 = '';
        var dialog2 = i18n.getMsg('delete.multiple.warning');

        switch (this.parentGrid.rowtarget.dataType) {
            case 'probeId':
                title = i18n.getMsg('delete.multiple_probe.window.title');
                dialog1 = i18n.getMsg('delete.multiple_probe');
                break;
            case 'mpId':
                title = i18n.getMsg('delete.multiple_mpr.window.title');
                dialog1 = i18n.getMsg('delete.multiple_mpr');
                break;
            case 'probenehmer':
                title = i18n.getMsg('delete.multiple_probenehmer.window.title');
                dialog1 = i18n.getMsg('delete.multiple_probenehmer');
                break;
            case 'dsatzerz':
                title = i18n.getMsg('delete.multiple_datensatzerzeuger.window.title');
                dialog1 = i18n.getMsg('delete.multiple_datensatzerzeuger');
                break;
            case 'mprkat':
                title = i18n.getMsg('delete.multiple_mpr_kat.window.title');
                dialog1 = i18n.getMsg('delete.multiple_mpr_kat');
                break;


        }
        var me = this;
        this.confWin = Ext.create('Ext.window.Window', {
            title: title,
            zIndex: 1,
            items: [{
                xtype: 'panel',
                border: false,
                margin: 5,
                layout: 'fit',
                html: '<p>'
                    + dialog1
                    + '<br/>'
                    + '<br/>'
                    + dialog2
                    + '</p>'
            }, {
                xtype: 'panel',
                layout: 'hbox',
                items: [{
                    xtype: 'button',
                    text: i18n.getMsg('cancel'),
                    scope: me,
                    handler: function() {
                        me.confWin.close();
                        me.close();
                    }
                }, {
                    xtype: 'button',
                    text: i18n.getMsg('delete'),
                    handler: function(btn) {
                        me.confWin.close();
                        me.startDelete(btn);
                    }
                }]
            }]
        });
        this.callParent(arguments);
    },

    /**
     * Refreshes Dynamic grid
     */
    refresh: function() {
        if (this.parentGrid) {
            var qp = Ext.ComponentQuery.query('querypanel')[0];
            var qp_button = Ext.ComponentQuery.query('button', qp)[0];
            var queryController = Lada.app.getController(
                'Lada.controller.Query');
            queryController.search(qp_button);
        }
    },

    /**
     * Shows window
     */
    show: function() {
        this.callParent(arguments);
        this.confWin.show();
        this.confWin.toFront();
    },

    /**
     * Initiates deletion of all selected items
     */
    startDelete: function(btn) {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        me.maxSteps = me.selection.length;
        me.down('progressbar').show();
        var url = '';
        var datatype = '';

        switch (me.parentGrid.rowtarget.dataType) {
            case 'probeId':
                url = 'lada-server/rest/probe/';
                datatype = 'Probe ';
                break;
            case 'messungId':
                url = 'lada-server/rest/messung/';
                datatype = 'Messung ';
                break;
            case 'mpId':
                url = 'lada-server/rest/messprogramm/';
                datatype = i18n.getMsg('messprogramm');
                break;
            case 'probenehmer':
                url = 'lada-server/rest/probenehmer/';
                datatype = i18n.getMsg('probenehmer');
                break;
            case 'dsatzerz':
                url = 'lada-server/rest/datensatzerzeuger/';
                datatype = i18n.getMsg('datensatzerzeuger');
                break;
            case 'mprkat':
                url = 'lada-server/rest/messprogrammkategorie/';
                datatype = i18n.getMsg('messprogrammkategorie');
                break;
        }
        for (var i = 0; i< me.selection.length; i++) {
            var id = me.selection[i].get(me.parentGrid.rowtarget.dataIndex);
            Ext.Ajax.request({
                url: url + id,
                method: 'DELETE',
                success: function(resp, opts) {
                    var json = Ext.JSON.decode(resp.responseText);
                    var urlArr = resp.request.url.split('/');
                    var delId = urlArr[urlArr.length - 1];
                    var html = me.down('panel').html;
                    if (json.success && json.message === '200') {
                        html = html + i18n.getMsg(
                            'deleteItems.callback.success',datatype, delId);
                        me.down('panel').setHtml(html);
                    } else {
                        html = html + i18n.getMsg(
                            'deleteItems.callback.failure', datatype, delId)
                            + i18n.getMsg(json.message) + '<br>';
                        me.down('panel').setHtml(html);
                    }
                    me.currentProgress += 1;
                    me.down('progressbar').updateProgress(me.currentProgress/me.maxSteps);
                    if (me.currentProgress === me.maxSteps) {
                        me.refresh();
                        me.down('progressbar').hide();
                        me.add({
                            xtype: 'button',
                            text: i18n.getMsg('close'),
                            handler: function() {
                                me.close();
                            }
                        });
                    }
                },
                failure: function(resp, opts) {
                    var json = Ext.JSON.decode(resp.responseText);
                    var urlArr = resp.request.url.split('/');
                    var delId = urlArr[urlArr.length - 1];
                    var html = me.down('panel').html;
                    me.down('panel').setHtml(html);
                    me.currentProgress += 1;
                    me.down('progressbar').updateProgress(me.currentProgress/me.maxSteps);
                    html = html + i18n.getMsg(
                        'deleteItems.callback.failure', datatype, delId);
                    me.down('panel').setHtml(html);
                    if (me.currentProgress === me.maxSteps) {
                        me.down('progressbar').hide();
                        me.add({
                            xtype: 'button',
                            text: i18n.getMsg('close'),
                            handler: function() {
                                me.close();
                            }
                        });
                    }
                }
            });
        }
    }
});

