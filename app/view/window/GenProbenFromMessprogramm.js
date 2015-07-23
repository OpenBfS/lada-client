/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Window to generate Proben from a Messprogramm
 */
Ext.define('Lada.view.window.GenProbenFromMessprogramm', {
    extend: 'Ext.window.Window',
    alias: 'widget.genpfm',

    collapsible: true,
    maximizable: true,
    autoShow: true,
    autoScroll: true,
    layout: 'fit',
    constrain: true,

    record: null,
    parentWindow: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            }
        });

        this.title = i18n.getMsg('gpfm.window.title');
        var me = this;
        this.buttons = [{
            text: i18n.getMsg('cancel'),
            scope: this,
            handler: this.close
        }, {
            text: i18n.getMsg('generateproben'),
            handler: function() {
                var jsondata = {
                    id: me.record.id,
                    start: new Date(me.down('datetime [name=start]').getValue()).valueOf(),
                    end: new Date(me.down('datetime [name=end]').getValue()).valueOf()
                };


                Ext.Ajax.request({
                    url: 'lada-server/probe/messprogramm',
                    method: 'POST',
                    headers: {
                        'X-OPENID-PARAMS': Lada.openIDParams
                    },
                    jsonData: jsondata,
                    success: function(response) {
                        var json = Ext.JSON.decode(response.responseText);
                        Ext.Msg.show({
                            title: i18n.getMsg('success'),
                            autoScroll: true,
                            msg: me.evalResponse(json),
                            buttons: Ext.Msg.OK
                        });
                        me.close();
                    },
                    failure: function(response) {
                        var json = null;
                        try {
                            json = Ext.JSON.decode(response.responseText);
                        }
                        catch(err){
                            Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.generic.title'),
                                Lada.getApplication().bundle.getMsg('err.msg.response.body'));
                        }
                        if (json) {
                            if(json.errors.totalCount > 0 || json.warnings.totalCount > 0){
                                formPanel.setMessages(json.errors, json.warnings);
                            }
                            // TODO Move this handling of 699 and 698 to a more central place!
                            // TODO i18n
                            if (json.message === "699" || json.message === "698") {
                                /* This is the unauthorized message with the authentication
                                    * redirect in the data */

                                /* We decided to handle this with a redirect to the identity
                                    * provider. In which case we have no other option then to
                                    * handle it here with relaunch. */
                                Ext.MessageBox.confirm('Erneutes Login erforderlich',
                                    'Der Server konnte die Anfrage nicht authentifizieren.<br/>'+
                                    'Für ein erneutes Login muss die Anwendung neu geladen werden.<br/>' +
                                    'Alle ungesicherten Daten gehen dabei verloren.<br/>' +
                                    'Soll die Anwendung jetzt neu geladen werden?', me.reload);
                            }
                            else if(json.message){
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
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            },
            close: function () {
                if (this.parentWindow) {
                    this.parentWindow.probenWindow = null;
                }
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
                    + i18n.getMsg('nameofmessprogramm')
                    + '<br/>'
                    + this.record.get('name')
                    + '</p>'
            }, {
                xtype: 'panel',
                border: 0,
                margin: 5,
                layout: 'fit',
                html: '<p>' + i18n.getMsg('messprogtimeperiod') + '</p>'
            }, {
                xtype: 'datetime',
                fieldLabel: i18n.getMsg('from'),
                labelWidth: 90,
                margin: 5,
                width: 300,
                name: 'start',
                format: 'd.m.Y H:i',
                period: 'start'
            }, {
                xtype: 'datetime',
                fieldLabel: i18n.getMsg('to'),
                labelWidth: 90,
                margin: 5,
                width: 300,
                name: 'end',
                format: 'd.m.Y H:i',
                period: 'end'
            }]
        }];
        this.callParent(arguments);
    },

    /**
     * Init
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
            r += ' ' + i18n.getMsg('probecreated');
            r += '<br/>';
            r += i18n.getMsg('probeids');
        var i;
            for (i in response.data){
                r += '<br/>';
                r += response.data[i].probeIdAlt
            }
        return r;
    },

    reload: function(btn) {
        if (btn === 'yes') {
            location.reload();
        }
    }
});
