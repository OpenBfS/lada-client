/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to edit a Messprogramm
 */
Ext.define('Lada.view.window.Messprogramm', {
    extend: 'Lada.view.window.RecordWindow',
    alias: 'widget.messprogramm',

    requires: [
        'Lada.view.form.Messprogramm',
        'Lada.view.window.HelpprintWindow',
        'Lada.view.grid.Messmethoden'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: false,
    autoScroll: true,
    layout: 'fit',
    constrain: true,
    probenWindow: null,
    width: 750,

    record: null,
    recordType: 'messprogramm',

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.title = i18n.getMsg('title.loading.messprogramm');
        this.buttons = [{
            text: i18n.getMsg('generateproben'),
            action: 'generateproben',
            scope: this,
            disabled: this.record ? false : true,
            // further disabling/enabling logic in the controller
            handler: function() {
                //Make the Window a "singleton"
                if (! this.probenWindow) {
                    var winname = 'Lada.view.window.GenProbenFromMessprogramm';
                    var win = Ext.create(winname, {
                        ids: [this.record.get('id')],
                        parentWindow: this
                    });
                    win.show();
                    this.probenWindow = win;
                } else {
                    this.probenWindow.focus();
                    this.probenWindow.setActive(true);
                }
                me.close();
            }
        },
        '->',
        {
            text: i18n.getMsg('reload'),
            name: 'reload',
            handler: this.reload,
            scope: this,
            qtip: i18n.getMsg('reload.qtip') + i18n.getMsg('messprogramm'),
            icon: 'resources/img/view-refresh.png'
        }, '->', {
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
                this.toggleGenProben();

            }
        });

        this.height = Ext.getBody().getViewSize().height - 30;
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "Id" param to load the correct item.

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
                        imprintWinController.setTopic('messprogramm');
                    }, imprintWin, {single: true});
                } else {
                    // BasiGX.util.Animate.shake(imprintWin);
                    var imprintWinController = imprintWin.getController();
                    imprintWinController.shake(imprintWin);
                    imprintWinController.setTopic('messprogramm');
                }
            }
        }];
        this.modelClass = Lada.model.Messprogramm;
        this.callParent(arguments);
    },

    /**
     * Init Data is longer than in other windows.
     * If the Window was used to CREATE a Messprogramm,
     * it will load an empty record
     * if it was used to EDIT an existing Messprogramm,
     * it will load this record AND create a grid to
     * enable the editing of Messmethoden
     * which are associated to the Messprogramm
     *
     * @param loadedRecord if given, it is assumed that this is a freshly
      * loaded record, not requiring a reload from server
     */
    initData: function(loadedRecord) {
        this.initializeUi();
        this.clearMessages();
        var me = this;
        var i18n = Lada.getApplication().bundle;

        if (this.record) {
            // If a record was passed to this window, load it for editing
            this.setLoading(true);
            var loadCallback = function(record, response) {
                me.down('messprogrammform').setRecord(record);
                me.record = record;
                var json = response ?
                    Ext.decode(response.getResponse().responseText) :
                    null;
                if (json) {
                    this.setMessages(json.errors, json.warnings);
                    /*
                    if (!json.warnings.mediaDesk) {
                    }
                    */
                }
                me.down('button[action=generateproben]').setDisabled(false);
                me.down('button[name=reload]').setDisabled(false);
                // If Messprogramm is ReadOnly, disable Inputfields and grids
                if (me.record.get('readonly') === true) {
                    me.down('messprogrammform').setReadOnly(true);
                    me.disableChildren();
                } else {
                    me.down('messprogrammform').setReadOnly(false);
                    me.enableChildren();
                    if (record.get('probenintervall') === 'J') {
                        me.down('messprogrammform').down(
                            'dayofyear[name=gueltigBis]').setReadOnly(true);
                        me.down('messprogrammform').down(
                            'dayofyear[name=gueltigVon]').setReadOnly(true);
                    }
                }

                me.down('messprogrammform').setMediaDesk(record);
                me.setLoading(false);
                if (me.record === null) {
                    me.setTitle(
                        i18n.getMsg('messprogramm.window.create.title'));
                } else {
                    me.setTitle(
                        i18n.getMsg(
                            'messprogramm.window.edit.title') +
                            ' <i>(Referenzierte Proben ' +
                            me.record.get('referenceCount') +
                            ')</i>');
                }
            };
            if (!loadedRecord) {
                Ext.ClassManager.get('Lada.model.Messprogramm').load(
                    this.record.get('id'), {
                        failure: function() {
                            me.setLoading(false);
                        },
                        success: loadCallback,
                        scope: this
                    });
            } else {
                loadCallback(loadedRecord);
            }
        } else {
            // Create a new record
            var record = Ext.create('Lada.model.Messprogramm', {
                gueltigVon: 1,
                gueltigBis: 365,
                owner: true,
                mstId: Lada.mst[0],
                laborMstId: Lada.mst[0]
            });
            record.set('id', null);
            this.record = record;

            this.down('messprogrammform').setRecord(record);
            this.down('messprogrammform').setMediaDesk(record);

            this.disableChildren();
            this.down('button[name=reload]').setDisabled(true);
        }
        this.down('messprogrammform').isValid();
    },

    initializeUi: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.removeAll();
        this.add([{
            border: false,
            autoScroll: true,
            items: [{
                xtype: 'messprogrammform',
                recordId: this.record ? this.record.get('id') : null
            }, {
                xtype: 'fset',
                name: 'orte',
                title: i18n.getMsg('title.ortsangabe'),
                padding: '5, 5',
                margin: 5,
                items: [{
                    xtype: 'ortszuordnunggrid',
                    recordId: me.record ? me.record.get('id') : null,
                    isMessprogramm: true
                }]
            }, {
                //Messmethoden
                xtype: 'fieldset',
                padding: '5, 5',
                title: i18n.getMsg('mmtmessprogramm.form.fieldset.title'),
                margin: 5,
                layout: {
                    type: 'fit'
                },
                items: [{
                    xtype: 'messmethodengrid',
                    recordId: this.record ? this.record.get('id') : null,
                    flex: 1
                }]
            }]
        }]);
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
     * window to save the form if dirty*/
    handleBeforeClose: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var item = me.down('messprogrammform');
        if (item && !item.getRecord().get('readonly') && item.isDirty()) {
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
                            me.down('messprogrammform').fireEvent(
                                'save', me.down('messprogrammform'));
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
     * Reload MessprogrammEdit Window
     */
    reload: function() {
        var form = this.down('messprogrammform');
        // TODO: visual feedback on form and button
        var callback = function() {
            form.up('window').initData();
        };
        if (form.isDirty()) {
            var i18n = Lada.getApplication().bundle;
            Ext.MessageBox.alert(
                i18n.getMsg('reloadRecord', i18n.getMsg('messprogramm')),
                i18n.getMsg('confirmation.discardchanges'),
                callback(form));
        } else {
            callback(form);
        }
    },

    disableChildren: function() {
        this.down('fset[name=orte]').down('ortszuordnunggrid').setReadOnly(
            true);
        this.down('messmethodengrid').setReadOnly(true);
    },

    enableChildren: function() {
        this.down('fset[name=orte]').down('ortszuordnunggrid').setReadOnly(
            false);
        this.down('messmethodengrid').setReadOnly(false);
    },

    /**
     * Instructs the fields / forms listed in this method to set a message.
     * @param errors These Errors shall be shown
     * @param warnings These Warning shall be shown
     */
    setMessages: function(errors, warnings) {
        this.down('messprogrammform').setMessages(errors, warnings);
    },

    /**
     * Instructs the fields / forms listed in this method to clear their
     * messages.
     */
    clearMessages: function() {
        this.down('messprogrammform').clearMessages();
    },
    toggleGenProben: function() {
        var button = this.down('button[action=generateproben]');
        if (this.record === null || this.record.phantom) {
            button.setDisabled(true);
            return;
        }
        var mmtgrid = this.down('messmethodengrid');
        if (
            mmtgrid &&
            mmtgrid.rowEditing &&
            mmtgrid.rowEditing.editing === true
        ) {
            button.setDisabled(true);
            return;
        }

        button.setDisabled(false);
        return;
    }
});
