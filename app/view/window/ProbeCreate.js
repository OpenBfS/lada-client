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
        'Lada.view.window.HelpprintWindow',
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
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('probe.new.title');
        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.handleBeforeClose
        }];

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

        this.width = 700;
        this.height = Ext.getBody().getViewSize().height - 30;
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "modelId" param to load the correct item.

        this.items = [{
            border: false,
            autoScroll: true,
            items: [{
                xtype: 'probeform'
            }]
        }];
        this.tools = [{
            type: 'help',
            tooltip: i18n.getMsg('help.qtip'),
            titlePosition: 0,
            callback: function() {
                var imprintWin = Ext.ComponentQuery.query(
                    'k-window-imprint')[0];
                if (!imprintWin) {
                    imprintWin = Ext.create(
                        'Lada.view.window.HelpprintWindow')
                        .show();
                    imprintWin.on('afterlayout', function() {
                        var imprintWinController = this.getController();
                        imprintWinController.setTopic('probe');
                    }, imprintWin, {single: true});
                } else {
                    // BasiGX.util.Animate.shake(imprintWin);
                    var imprintWinController = imprintWin.getController();
                    imprintWinController.shake(imprintWin);
                    imprintWinController.setTopic('probe');
                }
            }
        }];
        this.callParent(arguments);
    },

    /**
     * Called before closing the form window. Shows confirmation dialogue
     * window to save the form if dirty
    */
    handleBeforeClose: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var item = me.items.items[0].items.get(0);
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
                            me.down('probeform').fireEvent(
                                'save', me.down('probeform'));
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
      * Initialise the Data of this Window
      */
    initData: function() {
        var record = Ext.create('Lada.model.Probe');
        var mstLabCb = this.down('probeform').down('messstellelabor').down(
            'combobox');
        var mstLabRecs = mstLabCb.store.getData();
        //Try to preselect messstelle/labor
        if (mstLabRecs.length >= 1) {
            var labRec = mstLabRecs.getAt(0);
            record.set('owner', true);
            record.set('mstId', labRec.get('messStelle'));
            record.set('laborMstId', labRec.get('laborMst'));
        }
        var errors = [];
        var notifications = { hauptprobenNr: [631] };
        var warnings = { probeentnahmeBeginn: [631],
            umwId: [631]
        };
        this.down('probeform').setRecord(record);
        this.down('probeform').setMediaDesk(record);
        this.down('probeform').setMessages(errors, warnings, notifications);
        this.down('probeform').isValid();
    },

    /**
     * Instructs the fields / forms listed in this method to set a message.
     * @param errors These Errors shall be shown
     * @param warnings These Warning shall be shown
     * @param notifications
     */
    setMessages: function(errors, warnings, notifications) {
        this.down('probeform').setMessages(errors, warnings, notifications);
    },

    /**
     * Instructs the fields / forms listed in this method to clear their
     * messages.
     */
    clearMessages: function() {
        this.down('probeform').clearMessages();
    },

    /**
     * Disable the Childelements of this window
     */
    disableChildren: function() {
        //intentionally!
        return true;
    },

    /**
     * Enable the Childelements of this window
     */
    enableChildren: function() {
        //intentionally!
        return true;
    }
});
