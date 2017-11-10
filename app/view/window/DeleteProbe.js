/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to show a confirmation dialog to delete a Probe
 */
Ext.define('Lada.view.window.DeleteProbe', {
    extend: 'Ext.window.Window',
    alias: 'widget.deleteProbe',

    collapsible: true,
    maximizable: true,
    autoShow: true,
    autoScroll: true,
    layout: 'fit',
    constrain: true,

    record: null,
    parentWindow: null,

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

        this.title = i18n.getMsg('delete.probe.window.title');
        var me = this;
        this.buttons = [{
            text: i18n.getMsg('cancel'),
            scope: this,
            handler: this.close
        }, {
            text: i18n.getMsg('delete'),
            handler: function() {

                Ext.Ajax.request({
                    url: 'lada-server/rest/probe/'+me.record.get('id'),
                    method: 'DELETE',
                    success: function(response) {
                        var json = Ext.JSON.decode(response.responseText);
                        if (json.success && json.message === '200') {
                            Ext.Msg.show({
                                title: i18n.getMsg('success'),
                                autoScroll: true,
                                msg: 'Probe gelöscht!',
                                buttons: Ext.Msg.OK
                            });
                            var parentGrid = Ext.ComponentQuery.query('probelistgrid');
                            if (parentGrid.length == 1) {
                                parentGrid[0].store.reload();
                            }
                        } else {
                            Ext.Msg.show({
                                title: 'Fehler!',
                                msg: i18n.getMsg(json.message),
                                buttons: Ext.Msg.OK
                            });
                        }
                        me.close();
                    },
                    failure: function(response) {
                        var json = null;
                        try {
                            json = Ext.JSON.decode(response.responseText);
                        } catch (err) {
                            Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.generic.title'),
                                Lada.getApplication().bundle.getMsg('err.msg.response.body'));
                        }
                        if (json) {
                            if (json.errors.totalCount > 0 || json.warnings.totalCount > 0) {
                                formPanel.setMessages(json.errors, json.warnings);
                            }
                            /*
                            SSO will send a 302 if the Client is not authenticated
                            unfortunately this seems to be filtered by the browser.
                            We assume that a 302 was send when the follwing statement
                            is true.
                            */
                            if (response.status == 0 && response.responseText === '') {
                                Ext.MessageBox.confirm('Erneutes Login erforderlich',
                                    'Ihre Session ist abgelaufen.<br/>'+
                                    'Für ein erneutes Login muss die Anwendung neu geladen werden.<br/>' +
                                    'Alle ungesicherten Daten gehen dabei verloren.<br/>' +
                                    'Soll die Anwendung jetzt neu geladen werden?', this.reload);
                            }
                            // further error handling
                            if (json.message) {
                                Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.generic.title')
                                    +' #'+json.message,
                                Lada.getApplication().bundle.getMsg(json.message));
                            } else {
                                Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.generic.title'),
                                    Lada.getApplication().bundle.getMsg('err.msg.generic.body'));
                            }
                        } else {
                            Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.generic.title'),
                                Lada.getApplication().bundle.getMsg('err.msg.response.body'));
                        }
                    }
                });
            }
        }];
        this.width = 350;
        this.height = 250;

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

        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "Id" param to load the correct item.
        this.items = [{
            border: 0,
            autoScroll: true,
            items: [{
                xtype: 'panel',
                border: 0,
                margin: 5,
                layout: 'fit',
                html: '<p>'
                    + i18n.getMsg('delete.probe')
                    + '<br/>'
                    + '<br/>'
                    + this.record.get('probeId')
                    + '<br/>'
                    + '<br/>'
                    + i18n.getMsg('delete.probe.warning')
                    + '</p>'
            }]
        }];
        this.callParent(arguments);
    },

    /**
     * Inititalise Data
     */
    initData: function() {
        var i18n = Lada.getApplication().bundle;
        me = this;
    },

    /**
     * Parse ServerResponse when Proben have been generated
     */
    evalResponse: function(response) {
        var i18n = Lada.getApplication().bundle;
        var r = '';
        r += response.data.length;
        r += ' ' + i18n.getMsg('probedeleted');
        return r;
    },

    /**
     * Reload the Application
     */
    reload: function(btn) {
        if (btn === 'yes') {
            location.reload();
        }
    }
});

