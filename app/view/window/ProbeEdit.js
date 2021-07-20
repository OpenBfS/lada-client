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
Ext.define('Lada.view.window.ProbeEdit', {
    extend: 'Lada.view.window.RecordWindow',
    alias: 'widget.probenedit',

    requires: [
        'Lada.view.form.Probe',
        'Lada.view.grid.Ortszuordnung',
        'Lada.view.grid.Probenzusatzwert',
        'Lada.view.grid.PKommentar',
        'Lada.view.grid.Messung',
        'Lada.view.widget.Tag',
        'Lada.view.window.TagEdit'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: false,
    layout: 'fit',
    constrain: true,
    recordType: 'probe',
    record: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('title.loading.probe');
        this.buttons = [{
            text: i18n.getMsg('reload'),
            handler: this.reload,
            scope: this,
            icon: 'resources/img/view-refresh.png'
        }, '->', {
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.handleBeforeClose
        }];
        this.width = 700;
        this.height = Ext.getBody().getViewSize().height - 30;

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

        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "modelId" param to load the correct item.

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
        this.modelClass = Lada.model.Probe;
        if (this.record) {
            this.recordId = this.record.get('id');
        }
        this.callParent(arguments);
    },

    /**
     * Initialize ui elements and replace placeholder panel
     */
    initializeUI: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        this.removeAll();

        if (this.record === null) {
            Ext.Msg.alert(i18n.getMsg('err.msg.invalidprobe'));
            return;
        }

        this.add([{
            border: false,
            autoScroll: true,
            items: [{
                xtype: 'probeform',
                recordId: this.recordId
            }, {
                // Tags
                xtype: 'fieldset',
                title: i18n.getMsg('title.tagfieldset'),
                name: 'tagfieldset',
                padding: '5, 5',
                margin: 5,
                layout: {
                    type: 'hbox',
                    align: 'stretchmax'
                },
                items: [{
                    flex: 1,
                    xtype: 'tagwidget',
                    readOnly: true,
                    emptyText: i18n.getMsg('emptytext.tag'),
                    parentWindow: this,
                    maskTargetComponentType: 'fieldset',
                    maskTargetComponentName: 'tagfieldset',
                    margin: '5 5 5 5'
                }, {
                    width: 150,
                    height: 25,
                    xtype: 'button',
                    margin: '5 5 5 0',
                    text: i18n.getMsg('tag.toolbarbutton.assigntags'),
                    iconCls: 'x-fa fa-tag',
                    handler: function() {
                        var win = Ext.create('Lada.view.window.TagEdit', {
                            title: i18n.getMsg(
                                'tag.assignwindow.title.probe', 1),
                            parentWindow: me,
                            recordType: 'probe',
                            selection: [me.record.get('id')]
                        });
                        //Close window if parent window is closed
                        me.on('close', function() {
                            win.close();
                        });
                        win.show();
                    }
                }]
            }, {
                xtype: 'fset',
                name: 'orte',
                title: i18n.getMsg('title.ortsangabe'),
                padding: '5, 5',
                margin: 5,
                items: [{
                    xtype: 'ortszuordnunggrid',
                    recordId: this.recordId
                }]
            }, {
                xtype: 'fset',
                name: 'messungen',
                title: i18n.getMsg('title.messungen'),
                padding: '5, 5',
                margin: 5,
                collapsible: false,
                collapsed: false,
                items: [{
                    xtype: 'messunggrid',
                    recordId: this.recordId
                }]
            }, {
                xtype: 'fset',
                name: 'probenzusatzwerte',
                title: i18n.getMsg('title.zusatzwerte'),
                padding: '5, 5',
                margin: 5,
                collapsible: true,
                collapsed: false,
                items: [{
                    xtype: 'probenzusatzwertgrid',
                    recordId: this.recordId
                }]
            }, {
                xtype: 'fset',
                name: 'pkommentare',
                title: i18n.getMsg('title.kommentare'),
                padding: '5, 5',
                margin: 5,
                collapsible: true,
                collapsed: false,
                items: [{
                    xtype: 'pkommentargrid',
                    recordId: this.recordId
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
      * Initialise the Data of this Window
      * @param {Object}loadedRecord if given, it is assumed that this is a
      * freshly loaded record, not requiring a reload from server
      */
    initData: function(loadedRecord) {
        this.clearMessages();
        var me = this;
        var loadCallBack = function(record, response) {
            me.initializeUI();
            me.record = record;
            me.recordId = record.get('id');
            me.down('probeform').setRecord(record);
            var owner = record.get('owner');
            var readonly = record.get('readonly');
            var messstelle = Ext.data.StoreManager.get('messstellen')
                .getById(record.get('mstId'));
            var datenbasis = Ext.data.StoreManager.get('datenbasis')
                .getById(record.get('datenbasisId'));
            var title = '';
            if (datenbasis) {
                title += datenbasis.get('datenbasis');
                title += ' ';
            }
            title += 'Probe: ';
            title += record.get('externeProbeId');
            if (record.get('hauptprobenNr')) {
                //title += ' - extPID/Hauptprobennr.: ';
                title += ' / '+ record.get('hauptprobenNr');
            }
            if (messstelle) {
                title += '    -    Mst: ';
                title += messstelle.get('messStelle');
            }
            me.setTitle(title);

            if (owner) {
                //Always allow to Add Messungen.
                me.enableAddMessungen();
            }

            var json = response ?
                Ext.decode(response.getResponse().responseText) :
                null;
            if (json) {
                me.setMessages(json.errors, json.warnings, json.notifications);
            }
            me.down('probeform').setMediaDesk(record);
            // If the Probe is ReadOnly, disable Inputfields and grids
            if (readonly === true || !owner) {
                me.down('probeform').setReadOnly(true);
                me.disableChildren();
            } else {
                me.down('probeform').setReadOnly(false);
                me.enableChildren();
            }

            // Initialize Tag widget
            me.down('tagwidget').setTagged(record.get('id'), 'probe');

            me.setLoading(false);
            me.down('probeform').isValid();
        };
        if (!loadedRecord) {
            Ext.ClassManager.get('Lada.model.Probe').load(
                this.record.get('id'), {
                    failure: function() {
                        me.setLoading(false);
                    },
                    success: loadCallBack
                });
        } else {
            loadCallBack(loadedRecord);
        }
    },

    /**
     * Called before closing the form window. Shows confirmation dialogue
     * window to save the form if dirty
     */
    handleBeforeClose: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var item;
        try {
            item = me.items.items[0].items.get(0);
        } catch (e) {
            Ext.log({
                msg: 'Closing uninitialized messung window: ' + e,
                level: 'warn'});
            item = null;
        }
        if (!item) {
            //Form may not be initialized yet
            me.close();
            return;
        }
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
     * Reload ProbeEdit Window
     */
    reload: function() {
        this.setLoading(true);
        var form = this.down('probeform');
        var callback = function() {
            form.up('window').reloadRecord();
        };
        if (form.isDirty()) {
            var i18n = Lada.getApplication().bundle;
            Ext.MessageBox.alert(
                i18n.getMsg('reloadRecord', i18n.getMsg('probe')),
                i18n.getMsg('confirmation.discardchanges'),
                callback(form));
        } else {
            callback(form);
        }
    },

    /**
     * Enable the Messungengrid
     */
    enableAddMessungen: function() {
        this.down('fset[name=messungen]').down('messunggrid').setReadOnly(
            false);
    },

    /**
     * Disable the Childelements of this window
     */
    disableChildren: function() {
        if (!this.record.get('owner')) {
            // Disable only when the User is not the owner of the Probe
            // Works in symbiosis with success callback some lines above.
            this.down('fset[name=messungen]').down('messunggrid').setReadOnly(
                true);
            this.down('fset[name=messungen]').down(
                'messunggrid').readOnly = true;
        }
        this.down('fset[name=orte]').down('ortszuordnunggrid').setReadOnly(
            true);
        this.down('fset[name=probenzusatzwerte]').down(
            'probenzusatzwertgrid').setReadOnly(true);
        this.down('fset[name=pkommentare]').down(
            'pkommentargrid').setReadOnly(true);
    },

    /**
     * Enable the Childelements of this window
     */
    enableChildren: function() {
        this.down('fset[name=messungen]').down('messunggrid').setReadOnly(
            false);
        this.down('fset[name=orte]').down('ortszuordnunggrid').setReadOnly(
            false);
        this.down('fset[name=probenzusatzwerte]').down(
            'probenzusatzwertgrid').setReadOnly(false);
        this.down('fset[name=pkommentare]').down('pkommentargrid').setReadOnly(
            false);
    },

    /**
     * Instructs the fields / forms listed in this method to set a message.
     * @param errors These Errors shall be shown
     * @param warnings These Warning shall be shown
     */
    setMessages: function(errors, warnings, notifications) {
        this.down('probeform').setMessages(errors, warnings, notifications);
        var errorOrtText = '';
        var errorOrt = false;
        var warningOrtText = '';
        var warningOrt = false;
        var key;
        var content;
        var i;
        var keyText;
        var i18n = Lada.getApplication().bundle;
        for (key in errors) {
            if (key && key.indexOf('Ort') > -1) {
                errorOrt = true;
                content = errors[key];
                keyText = i18n.getMsg(key);
                for (i = 0; i < content.length; i++) {
                    errorOrtText += keyText + ': ' +
                        i18n.getMsg(content[i].toString()) + '\n';
                }
            }
        }
        for (key in warnings) {
            if (key && key.indexOf('Ort') > -1) {
                warningOrt = true;
                content = warnings[key];
                keyText = i18n.getMsg(key);
                for (i = 0; i < content.length; i++) {
                    warningOrtText += keyText + ': ' +
                        i18n.getMsg(content[i].toString()) + '\n';
                }
            }
        }
        this.down('fset[name=orte]').showWarningOrError(
            warningOrt,
            warningOrtText === '' ? null : warningOrtText,
            errorOrt,
            errorOrtText === '' ? null : errorOrtText);
    },

    /**
     * Instructs the fields / forms listed in this method to clear their
     * messages.
     */
    clearMessages: function() {
        var probeform = this.down('probeform');
        var orteset = this.down('fset[name=orte]');
        if (probeform && orteset) {
            this.down('probeform').clearMessages();
            this.down('fset[name=orte]').clearMessages();
        }
    }
});
