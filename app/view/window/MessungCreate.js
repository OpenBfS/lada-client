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
            handler: this.close
        }];
        this.width = 700;

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
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
