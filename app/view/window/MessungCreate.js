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
    autoShow: true,
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
        var i18n = Lada.getApplication().bundle;
        this.probe = this.record;
        if (this.probe === null) {
            Ext.Msg.alert(i18n.getMsg('err.msg.messung.noprobe'));
            this.callParent(arguments);
            return;
        }

        var messstelle = Ext.data.StoreManager.get('messstellen')
            .getById(this.probe.get('mstId'));

        this.title = i18n.getMsg('messung.new.title',
            this.probe.get('hauptprobenNr'),
            messstelle.get('messStelle'));
        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.handleBeforeClose
        }];
        this.width = 700;

        this.on({
            activate: function() {
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function() {
                this.getEl().addCls('window-inactive');
            },
            afterRender: function() {
                this.customizeToolbar();
            }
        });

        this.items = [{
            border: false,
            autoScroll: true,
            items: [{
                xtype: 'messungform'
            }]
        }];
        this.tools = [{
            type: 'help',
            tooltip: i18n.getMsg('help.qtip'),
            callback: function() {
                var imprintWin = Ext.ComponentQuery.query(
                    'k-window-imprint')[0];
                if (!imprintWin) {
                    imprintWin = Ext.create(
                        'Lada.view.window.HelpprintWindow')
                        .show();
                    imprintWin.on('afterlayout', function() {
                        var imprintWinController = this.getController();
                        imprintWinController.setTopic('messung');
                    }, imprintWin, {single: true});
                } else {
                    var imprintWinController = imprintWin.getController();
                    imprintWinController.shake(imprintWin);
                    imprintWinController.setTopic('messung');
                }
            }
        }];
        this.callParent(arguments);
        var tagCreateButton = this.down('button[action=createtag]');
        if (tagCreateButton) {
            tagCreateButton.disable();
        }
    },

    /**
     * Adds new event handler to the toolbar close button to add a save
     * confirmation dialogue if a dirty form is closed
     */
    customizeToolbar: function() {
        var tools = this.tools;
        for (var i = 0; i < tools.length; i++) {
            if (tools[i].type === 'close') {
                var closeButton = tools[i];
                closeButton.handler = null;
                closeButton.callback = this.handleBeforeClose;
            }
        }
    },

    /**
     * Called before closing the form window. Shows confirmation dialogue
     * window to save the form if dirty
     */
    handleBeforeClose: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var item = me.down('messungform');
        if (item.isDirty()) {
            var confWin = Ext.create('Ext.window.Window', {
                title: i18n.getMsg('form.saveonclosetitle'),
                modal: true,
                layout: 'vbox',
                items: [{
                    xtype: 'container',
                    html: i18n.getMsg('form.saveonclosequestion'),
                    margin: '10, 5, 5, 5'
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [{
                        xtype: 'button',
                        text: i18n.getMsg('form.yes'),
                        margin: '5, 0, 5, 5',

                        handler: function() {
                            me.down('messungform').fireEvent(
                                'save', me.down('messungform'));
                            confWin.close();
                        }
                    }, {
                        xtype: 'button',
                        text: i18n.getMsg('form.no'),
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
        var warnings = { messdauer: [631],
            nebenprobenNr: [631]};
        var errors = [];
        this.setMessages(errors, warnings);
        this.down('messungform').isValid();
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
     * Instructs the fields / forms listed in this method to clear their
     * messages.
     */
    clearMessages: function() {
        this.down('messungform').clearMessages();
    },

    /**
     * Disable the Childelements of this Window
     */
    disableChildren: function() {
        //intentionally!
        return true;
    },

    /**
     * Enable the Childelements of this Window
     */
    enableChildren: function() {
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
