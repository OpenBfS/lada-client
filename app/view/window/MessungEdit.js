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

    requires: [
      'Lada.view.form.Messung',
      'Lada.view.grid.Messwert',
      'Lada.view.grid.Status',
      'Lada.view.grid.MKommentar'
    ],

    collapsible: true,
    maximizable: true,
    autoshow: true,
    autoscroll: true,
    layout: 'fit',
    constrain: true,

    probe: null,
    parentWindow: null,
    record: null,
    grid: null,

    initComponent: function() {
        if (this.record === null) {
            Ext.Msg.alert('Keine valide Messung ausgewählt!');
            this.callParent(arguments);
            return;
        }
        if (this.probe === null) {
            Ext.Msg.alert('Zu der Messung existiert keine Probe!');
            this.callParent(arguments);
            return;
        }
        this.title = 'Messung ' + this.record.get('nebenprobenNr');
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
        this.height = Ext.getBody().getViewSize().height - 30;

        this.items = [{
            border: 0,
            autoScroll: true,
            items: [{
                xtype: 'messungform',
                margin: 5,
                recordId: this.record.get('id')
           }, {
                xtype: 'fset',
                name: 'messwerte',
                title: 'Messwerte',
                padding: '5, 5',
                margin: 5,
                items: [{
                    xtype: 'messwertgrid',
                    recordId: this.record.get('id')
                }]
            }, {
                xtype: 'fset',
                name: 'messungstatus',
                title: 'Status',
                padding: '5, 5',
                margin: 5,
                items: [{
                    xtype: 'statusgrid',
                    recordId: this.record.get('id')
                }]
           }, {
                xtype: 'fset',
                name: 'messungskommentare',
                title: 'Kommentare',
                padding: '5, 5',
                margin: 5,
                items: [{
                    xtype: 'mkommentargrid',
                    recordId: this.record.get('id')
                }]
           }]
        }];
        this.callParent(arguments);
    },

    initData: function() {
        this.clearMessages();
        var that = this;
        Ext.ClassManager.get('Lada.model.Messung').load(this.record.get('id'), {
            failure: function(record, response) {
                // TODO
                console.log('An unhandled Failure occured. See following Response and Record');
                console.log(response);
                console.log(record);
            },
            success: function(record, response) {
                var me = this;
                if (this.probe.get('treeModified') < record.get('parentModified')) {
                    Ext.Msg.show({
                        title: 'Probe nicht aktuell!',
                        msg: 'Die zugehörige Probe wurde verändert.\n' +
                            'Möchten Sie zu der Probe zurückkehren und neu laden?\n' +
                            'Ohne das erneute Laden der Probe wird das Speichern' +
                            ' der Messung nicht möglich sein.',
                        buttons: Ext.Msg.OKCANCEL,
                        icon: Ext.Msg.WARNING,
                        closable: false,
                        fn: function(button) {
                            if (button === 'ok') {
                                me.close();
                                me.parentWindow.initData();
                            }
                            else {
                                me.record.set('treeModified', me.probe.get('treeModified'));
                                that.disableForm();
                            }
                        }
                    });
                }
                this.down('messungform').setRecord(record);
                this.record = record;
                var json = Ext.decode(response.response.responseText);
                if (json) {
                    this.setMessages(json.errors, json.warnings);
                }
                if (this.record.get('readonly') === true) {
                    this.disableForm();
                }
                else {
                    this.enableForm();
                }
            },
            scope: this
        });
    },

    disableForm: function() {
        this.down('messungform').setReadOnly(true);
        this.disableChildren();
    },

    enableForm: function() {
        this.down('messungform').setReadOnly(false);
        this.enableChildren();
    },

    disableChildren: function() {
            this.down('fset[name=messwerte]').down('messwertgrid').setReadOnly(true);
            this.down('fset[name=messungstatus]').down('statusgrid').setReadOnly(true);
            this.down('fset[name=messungskommentare]').down('mkommentargrid').setReadOnly(true);
    },

    enableChildren: function() {
            this.down('fset[name=messwerte]').down('messwertgrid').setReadOnly(false);
            this.down('fset[name=messungstatus]').down('statusgrid').setReadOnly(false);
            this.down('fset[name=messungskommentare]').down('mkommentargrid').setReadOnly(false);
    },

    setMessages: function(errors, warnings) {
        this.down('messungform').setMessages(errors, warnings);
    },
    clearMessages: function() {
        this.down('messungform').clearMessages();
    }

});
