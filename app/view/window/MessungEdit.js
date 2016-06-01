/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
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

    /**
     * This function initialises the Window
     */
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

        var mStore = Ext.data.StoreManager.get('messgroessen');
        mStore.proxy.extraParams = {mmtId: this.record.get('mmtId')};
        mStore.load();

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
                    recordId: this.record.get('id'),
                    messgroesseStore: mStore
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

    /**
     * Initialise the Data of this Window
     */
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
                if (this.parentWindow.record.get('treeModified') < record.get('parentModified')) {
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

                var messstelle = Ext.data.StoreManager.get('messstellen')
                    .getById(this.probe.get('mstId'));
                this.setTitle('Messung: ' + this.record.get('nebenprobenNr')
                              + '   zu Probe: ' + this.probe.get('probeIdAlt')
                              + ' Mst: ' + messstelle.get('messStelle')
                              + ' editieren.');

                var json = Ext.decode(response.response.responseText);
                if (json) {
                    this.setMessages(json.errors, json.warnings);
                }
                if (this.record.get('readonly') === true ||
                    this.record.get('owner') === false) {
                    this.disableForm();
                }
                else {
                    this.enableForm();
                }
                //Check if it is allowed to edit Status
                if (this.record.get('statusEdit') === true) {
                    this.enableStatusEdit();
                }
                else {
                    this.disableStatusEdit();
                }
                //Check if it is allowed to reset Status: done in Messungform
            },
            scope: this
        });
    },

    /**
     * Disable the Forms in this Window.
     * Also disable this Windows Children
     */
    disableForm: function() {
        this.down('messungform').setReadOnly(true);
        this.disableChildren();
    },

    /**
     * Enable the Forms in this Window.
     * Also enble this Windows Children
     */
    enableForm: function() {
        this.down('messungform').setReadOnly(false);
        this.enableChildren();
    },

    /**
     * Disable the Chilelements of this window
     */
    disableChildren: function() {
            this.down('fset[name=messwerte]').down('messwertgrid').setReadOnly(true);
            this.down('fset[name=messwerte]').down('messwertgrid').readOnly = true;
            this.down('fset[name=messungskommentare]').down('mkommentargrid').setReadOnly(true);
            this.down('fset[name=messungskommentare]').down('mkommentargrid').readOnly = true;
            //this.disableStatusEdit();
            //this.disableStatusReset();
    },

    /**
     * Enable the Childelements of this window
     */
    enableChildren: function() {
            this.down('fset[name=messwerte]').down('messwertgrid').setReadOnly(false);
            this.down('fset[name=messwerte]').down('messwertgrid').readOnly = false;
            this.down('fset[name=messungskommentare]').down('mkommentargrid').setReadOnly(false);
            this.down('fset[name=messungskommentare]').down('mkommentargrid').readOnly = false;
            //this.enableStatusEdit();
            //this.enableStatusReset();
    },

    /**
     * Enable to reset the statusgrid
     */
     enableStatusReset: function() {
            this.down('fset[name=messungstatus]').down('statusgrid').setResetable(true);
     },

    /**
     * Disable to reset the statusgrid
     */
     disableStatusReset: function() {
            this.down('fset[name=messungstatus]').down('statusgrid').setResetable(false);
     },
    /**
     * Enable to edit the statusgrid
     */
     enableStatusEdit: function() {
            this.down('fset[name=messungstatus]').down('statusgrid').setReadOnly(false);
            this.down('fset[name=messungstatus]').down('statusgrid').readOnly = false;
     },

    /**
     * Disable to edit the statusgrid
     */
     disableStatusEdit: function() {
            this.down('fset[name=messungstatus]').down('statusgrid').setReadOnly(true);
            this.down('fset[name=messungstatus]').down('statusgrid').readOnly = true;
     },

    /**
     * Instructs the fields / forms listed in this method to set a message.
     * @param errors These Errors shall be shown
     * @param warnings These Warning shall be shown
     */
    setMessages: function(errors, warnings) {
        this.down('messungform').setMessages(errors, warnings);
    },

    /**
     * Instructs the fields / forms listed in this method to clear their messages.
     */
    clearMessages: function() {
        this.down('messungform').clearMessages();
    }

});
