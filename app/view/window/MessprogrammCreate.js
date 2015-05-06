/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Window to create a Messprogramm
 *
 */
Ext.define('Lada.view.window.MessprogrammCreate', {
    extend: 'Ext.window.Window',
    alias: 'widget.messprogrammcreate',

    requires: [
        'Lada.view.form.Messprogramm'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: true,
    autoScroll: true,
    layout: 'fit',
    constrain: true,

    record: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('messprogramm.window.create.title');
        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }];

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            }
        });

        this.width = 700;
        this.height = Ext.getBody().getViewSize().height - 30;
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "modelId" param to load the correct item.

        this.items = [{
            border: 0,
            autoScroll: true,
            items: [{
                xtype: 'messprogrammform'
            }, {
                //Messmethoden
                xtype: 'fieldset',
                title: i18n.getMsg('mmtmessprogramm.form.fieldset.title'),
                autoScroll: true,
                margin: 5,
                layout: {
                    type: 'hbox',
                },
                items: [{
                    xtype: 'messmethodengrid',
                    flex: 1
                }, {
                    xtype: 'messmethodengrid',
                    flex: 1
                }]
            }]
        }];
        this.callParent(arguments);
    },

    initData: function() {
        var record = Ext.create('Lada.model.Messprogramm');
        this.down('messprogrammform').setRecord(record);
    },

    setMessages: function(errors, warnings) {
        this.down('messprogrammform').setMessages(errors, warnings);
    },

    clearMessages: function() {
        this.down('messprogrammform').clearMessages();
    },

    disableChildren: function(){
        //intentionally!
        return true;
    },

    enableChildren: function(){
        //intentionally!
        return true;
    }
});
