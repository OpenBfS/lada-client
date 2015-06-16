/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Window to edit a Probe
 */
Ext.define('Lada.view.window.ProbeCreate', {
    extend: 'Ext.window.Window',
    alias: 'widget.probecreate',

    requires: [
        'Lada.view.form.Probe'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: true,
    autoScroll: true,
    layout: 'fit',
    constrain: true,

    record: null,

    initComponent: function() {
        this.title = '§3-Probe';
        this.buttons = [{
            text: 'Schließen',
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
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "modelId" param to load the correct item.

        this.items = [{
            border: 0,
            autoScroll: true,
            layout: 'fit',
            items: [{
                xtype: 'probeform'
            }]
        }];
        this.callParent(arguments);
    },

    initData: function() {
        var record = Ext.create('Lada.model.Probe');
        this.down('probeform').setRecord(record);
    },

    setMessages: function(errors, warnings) {
        this.down('probeform').setMessages(errors, warnings);
    },

    clearMessages: function() {
        this.down('probeform').clearMessages();
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
