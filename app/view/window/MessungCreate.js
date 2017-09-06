/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to create a Messung
 */
Ext.define('Lada.view.window.MessungCreate', {
    extend: 'Ext.window.Window',
    alias: 'widget.messungcreate',

    requires: [
      'Lada.view.form.Messung'
    ],

    collapsible: true,
    maximizable: true,
    autoshow: true,
    autoscroll: true,
    layout: 'fit',
    constrain: true,

    probe: null,
    record: null,
    grid: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        this.probe = this.record;
        if (this.probe === null) {
            Ext.Msg.alert('Zu der Messung existiert keine Probe!');
            this.callParent(arguments);
            return;
        }

        var messstelle = Ext.data.StoreManager.get('messstellen')
            .getById(this.probe.get('mstId'));

        this.title = 'Neue Messung zu Probe - Hauptprobennr.: '
            + this.probe.get('hauptprobenNr')
            + ' Mst: ' + messstelle.get('messStelle')
            + ' hinzufügen.';

        this.buttons = [{
            text: 'Schließen',
            scope: this,
            handler: this.handleBeforeClose
        }];
        this.width = 700;

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            },
            afterRender: function() {
                this.customizeToolbar();
            }
        });

        this.items = [{
            border: 0,
            autoScroll: true,
            items: [{
                xtype: 'messungform'
           }]
        }];
        this.callParent(arguments);
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
     * Called before closing the form window. Shows confirmation dialogue window to save the form if dirty*/
    handleBeforeClose: function() {
        //TODO: Causes "el is null" error on saving
        var me = this;
        var item = me.down('messungform');
        if (item.isDirty()) {
            var confWin = Ext.create('Ext.window.Window', {
                title: 'Änderungen Speichern',
                modal: true,
                layout: 'vbox',
                items: [{
                    xtype: 'container',
                    html: 'Änderungen vor dem Schließen speichern?',
                    margin: '10, 5, 5, 5'
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [{
                        xtype: 'button',
                        text:   'OK',
                        margin: '5, 0, 5, 5',

                        handler: function() {
                            var saveButton = me.down('messungform').down('button[action=save]');
                            saveButton.click();
                            confWin.close();
                        }
                    }, {
                        xtype: 'button',
                        text: 'Abbrechen',
                        margin: '5, 5, 5, 5',

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
     * Initialise the Data of this Window
     */
    initData: function() {
        this.clearMessages();
        var messung = Ext.create('Lada.model.Messung', {
            probeId: this.record.get('id')
        });
        //Delete generated id to prevent sending invalid ids to the server
        messung.set('id', null);
        this.down('messungform').setRecord(messung);
    },

    /**
     * Instructs the fields / forms listed in this method to set a message.
     * @param errors These Errors shall be shown
     * @param warnings These Warning shall be shown
     */
    setMessages: function(errors, warnings) {
        //todo this is a stub
    },

    /**
     * Instructs the fields / forms listed in this method to clear their messages.
     */
    clearMessages: function() {
        //todo this is a stub
    },

    /**
     * Disable the Childelements of this Window
     */
    disableChildren: function(){
        //intentionally!
        return true;
    },

    /**
     * Enable the Childelements of this Window
     */
    enableChildren: function(){
        //intentionally!
        return true;
    },

    /**
     * Enable to reset the statusgrid
     */
     enableStatusReset: function() {
        //intentionally!
        return true;
     },

    /**
     * Disable to reset the statusgrid
     */
     disableStatusReset: function() {
        //intentionally!
        return true;
     },
    /**
     * Enable to edit the statusgrid
     */
     enableStatusEdit: function() {
        //intentionally!
        return true;
     },

    /**
     * Disable to edit the statusgrid
     */
     disableStatusEdit: function() {
        //intentionally!
        return true;
     }
});
