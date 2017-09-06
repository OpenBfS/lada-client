/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
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

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        this.title = '§3-Probe';
        this.buttons = [{
            text: 'Schließen',
            scope: this,
            handler: this.handleBeforeClose
        }];

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            },
            afterRender: function(){
                this.customizeToolbar();
            }
        });

        this.width = 700;
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "modelId" param to load the correct item.

        this.items = [{
            border: 0,
            autoScroll: true,
            items: [{
                xtype: 'probeform'
            }]
        }];
        this.callParent(arguments);
    },

    handleBeforeClose: function() {
        //TODO: Causes "el is null" error on saving
        var me = this;
        var item = me.down('probeform');
        if (item.isDirty()) {
            var confWin = Ext.create('Ext.window.Window', {
                title: 'Änderungen Speichern',
                modal: true,
                layout: 'vbox',
                items: [{
                    xtype: 'panel',
                    html: 'Änderungen vor dem schließen speichern?'
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [{
                        xtype: 'button',
                        text:   'OK',
                        handler: function() {
                            me.down('probeform').down('button[action=save]').click();
                            confWin.close();
                        }
                    }, {
                        xtype: 'button',
                        text: 'Abbrechen',
                        handler: function() {
                            confWin.close();
                        }
                    }]
                }]
            });
            confWin.on('close', me.close, me);
            confWin.show();
        } else {
            me.close();
        }

    },

    /**
     * Adds new event handler to the toolbar close button to add a save confirmation dialogue if a dirty form is closed
     */
    customizeToolbar: function() {
        var tools = this.tools;
        for (var i = 0; i < tools.length; i++) {
            if (tools[i].type == 'close') {
                var closeButton = tools[i];
                closeButton.handler = null;
                closeButton.callback = this.handleBeforeClose;
            }
        }
    },

     /**
      * Initialise the Data of this Window
      */
    initData: function() {
        var record = Ext.create('Lada.model.Probe');
        record.set('probeentnahmeBeginn', new Date());
        record.set('probeentnahmeEnde', new Date());
        console.log(record);
        this.down('probeform').setRecord(record);
    },

    /**
     * Instructs the fields / forms listed in this method to set a message.
     * @param errors These Errors shall be shown
     * @param warnings These Warning shall be shown
     */
    setMessages: function(errors, warnings) {
        this.down('probeform').setMessages(errors, warnings);
    },

    /**
     * Instructs the fields / forms listed in this method to clear their messages.
     */
    clearMessages: function() {
        this.down('probeform').clearMessages();
    },

    /**
     * Disable the Childelements of this window
     */
    disableChildren: function(){
        //intentionally!
        return true;
    },

    /**
     * Enable the Childelements of this window
     */
    enableChildren: function(){
        //intentionally!
        return true;
    }
});
