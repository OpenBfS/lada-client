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

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

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
                    url: '/lada-server/probe/messprogramm',
                    method: 'POST',
                    headers: {
                        'X-OPENID-PARAMS': Lada.openIDParams
                    },
                    jsonData: jsondata,
                    success: function(form, action) {
                        Ext.Msg.alert('Success', action.result.msg);
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert('Failed', action.result.msg);
                    }
                });
            }
        }];
        this.width = 400;
        this.height = 300;

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
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
                name: 'start',
                format: 'd.m.Y H:i',
                period: 'start'
            }, {
                xtype: 'datetime',
                fieldLabel: i18n.getMsg('to'),
                labelWidth: 90,
                margin: 5,
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
});
