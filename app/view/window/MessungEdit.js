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
Ext.define('Lada.view.window.MessungEdit', {
    extend: 'Ext.window.Window',
    alias: 'widget.messungedit',

   // requires: [
   //   'Lada.view.form.Messung',
   //   'Lada.view.grid.Messwert',
   //   'Lada.view.grid.Messstatus',
   //   'Lada.view.grid.MKommentar'
   // ],

    collapsible: true,
    maximizable: true,
    autoshow: true,
    autoscroll: true,
    layout: 'fit',

    record: null,

    initComponent: function(){
        if (this.record === null) {
            Ext.Msg.alert('Keine valide Messung ausgewählt!');
            this.callParent(arguments);
            return;
        }
        this.title = 'Messung ';// + this.record.get('messungId');
        this.buttons = [{
            text: 'Schließen',
            scope: this,
            handler: this.close
        }];
        this.width = 700;
        this.height = Ext.getBody().getViewSize().height - 30;

        this.items = [{
            border: 0,
            autoScroll: true,
            items: [{
         //       xtype: 'messungform',
//                recordId: record.get('id')
            }, {
                xtype: 'fset',
                name: 'messwerte',
                title: 'Messwerte - Stub'
                //todo
            }, {
                xtype: 'fset',
                name: 'messungstatus',
                title: 'Messungstatus - Stub'
                //todo 
           }, {
                xtype: 'fset',
                name: 'messungskommentare',
                title: 'Messungskommentare - Stub'
                //todo
           }]
        }];
        this.callParent(arguments);
    },

    initData: function() {
        this.clearMessages();
        Ext.ClassManager.get('Lada.model.Messung').load(this.record.get('id'), {
            failure: function(record, action){
                // todo
                console.log("failure");
            },
            success: function(record, action){
                console.log("success");
            },
            scope: this
        }
        );
    },

    setMessages: function(errors, warnings) {
        //todo this is a stub
    },
    clearMessages: function() {
        //todo this is a stub
    }

});
