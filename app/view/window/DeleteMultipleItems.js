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
            },
            close: function() {
                this.parentWindow.probenWindow = null;
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
            text: 'Fortschritt',
            height: 25,
            width: 340,
            hidden: false,
            margin: '5, 5, 5, 5'
        }];
        var title = '';
        var dialog1 = '';
        var dialog2 = '';
        switch (this.parentGrid.rowtarget.dataType) {
            case 'probeId':
                title = i18n.getMsg('delete.multiple_probe.window.title');
                dialog1 = i18n.getMsg('delete.multiple_probe');
                dialog2 = i18n.getMsg('delete.multiple_probe.warning')
        }
        var me = this;
        this.confWin = Ext.create('Ext.window.Window', {
            title: title,
            zIndex: 1,
            items: [{
                xtype: 'panel',
                border: 0,
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
        var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
        if (parentGrid.length === 1) {
            parentGrid[0].store.reload();
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
        switch(me.parentGrid.rowtarget.dataType) {
            case 'probeId':
                url = 'lada-server/rest/probe/';
                datatype = 'Probe ';
                break;
            case 'mpId':
                url = 'lada-server/rest/messprogramm/';
                datatype = 'Messprogramm ';
                break;
        }
        for (var i = 0; i< me.selection.length; i++) {
            Ext.Ajax.request({
                url: url + me.selection[i],
                method: 'DELETE',
                success: function(resp, opts) {
                    var json = Ext.JSON.decode(resp.responseText);
                    var urlArr = resp.request.url.split('/');
                    var delId = urlArr[urlArr.length - 1];
                    var html = me.down('panel').html;
                    if (json.success && json.message === '200') {
                        html = html + datatype + delId + ' gelöscht<br>';
                        me.down('panel').setHtml(html);
                    } else {
                        html = html + datatype + delId + ' konnte nicht gelöscht werden:<br>'
                        + i18n.getMsg(json.message) + '<br>';
                        me.down('panel').setHtml(html);
                    }
                    me.currentProgress += 1;
                    me.down('progressbar').updateProgress(me.currentProgress/me.maxSteps);
                    if (me.currentProgress == me.maxSteps) {
                        me.refresh();
                        me.down('progressbar').hide();
                        me.add({
                            xtype: 'button',
                            text: 'Schließen',
                            handler: function() {
                                me.close();
                            }
                        });
                    }
                },
                failure: function(resp, opts) {
                    var json = Ext.JSON.decode(resp.responseText);
                    urlArr = resp.request.url.split('/');
                    var delId = urlArr[urlArr.length - 1];
                    var html = me.down('panel').html;
                    me.down('panel').setHtml(html);
                    me.currentProgress += 1;
                    me.down('progressbar').updateProgress(me.currentProgress/me.maxSteps);
                    html = html + datatype + delId + 'konnte nicht gelöscht werden<br>';
                    me.down('panel').setHtml(html);
                    if (me.currentProgress == me.maxSteps) {
                        me.down('progressbar').hide();
                        me.add({
                            xtype: 'button',
                            text: 'Schließen',
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

