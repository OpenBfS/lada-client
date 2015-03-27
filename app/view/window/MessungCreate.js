/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Window to edit a Messung
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

    record: null,
    grid: null,

    initComponent: function() {
        this.title = 'Messung';
        this.buttons = [{
            text: 'Schließen',
            scope: this,
            handler: this.close
        }];
        this.width = 700;

        this.items = [{
            border: 0,
            autoScroll: true,
            items: [{
                xtype: 'messungform'
           }]
        }];
        this.callParent(arguments);
    },

    initData: function() {
        this.clearMessages();
        var messung = Ext.create('Lada.model.Messung', {
            probeId: this.record.get('id')
        });
        this.down('messungform').setRecord(messung);
    },

    setMessages: function(errors, warnings) {
        //todo this is a stub
    },
    clearMessages: function() {
        //todo this is a stub
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
