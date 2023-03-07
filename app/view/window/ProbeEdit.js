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
        'Lada.view.window.HelpprintWindow',
        'Lada.view.window.SetTags'
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
            handler: this.close
        }];
        this.width = 700;
        this.height = Ext.getBody().getViewSize().height - 30;

        this.on({
            activate: function() {
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function() {
                this.getEl().addCls('window-inactive');
            }
        });

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

        // Store for probenzusatzwertgrid
        var umwId = this.record.get('umwId');
        var params = {};
        if (umwId) {
            params['umwId'] = umwId;
        }
        var pzStore = Ext.create('Lada.store.Probenzusaetze').load({
            params: params
        });

        this.removeAll();

        if (this.record === null) {
            Ext.Msg.alert(i18n.getMsg('err.msg.invalidprobe'));
            return;
        }

        this.add([{
            border: false,
            autoScroll: true,
            items: [{
                xtype: 'probeform'
            }, {
                // Tags
                xtype: 'fieldset',
                title: i18n.getMsg('title.tagprobenfieldset'),
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
                    // Only users with associated Messstelle can (un)assign tags
                    disabled: Lada.mst.length === 0,
                    handler: function() {
                        var win = Ext.create('Lada.view.window.SetTags', {
                            title: i18n.getMsg(
                                'tag.assignwindow.title.probe', 1),
                            parentWindow: me,
                            recordType: 'probe'
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
                    recordId: this.recordId,
                    pzStore: pzStore
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

            // Set title
            var title = '';
            var datenbasis = Ext.data.StoreManager.get('datenbasis')
                .getById(record.get('datenbasisId'));
            if (datenbasis) {
                title += datenbasis.get('datenbasis');
                title += ' ';
            }
            title += 'Probe: ';
            title += record.get('externeProbeId');
            if (record.get('hauptprobenNr')) {
                //title += ' - extPID/Hauptprobennr.: ';
                title += ' / ' + record.get('hauptprobenNr');
            }
            var messstelle = Ext.data.StoreManager.get('messstellen')
                .getById(record.get('mstId'));
            if (messstelle) {
                title += '    -    Mst: ';
                title += messstelle.get('messStelle');
            }
            me.setTitle(title);

            // Set messages
            var json = response ?
                Ext.decode(response.getResponse().responseText) :
                null;
            if (json) {
                me.setMessages(json.errors, json.warnings, json.notifications);
            }

            // If the Probe is ReadOnly, disable Inputfields and grids
            var readonly = record.get('readonly') || !record.get('owner');
            me.down('probeform').setReadOnly(readonly);
            me.disableChildren(readonly);

            // Initialize Tag widget
            me.down('tagwidget').setTagged([record.get('id')], 'probe');

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
     * Disable or enable grids in fieldsets in this window
     */
    disableChildren: function(disable) {
        this.query('fset').forEach(function(fset) {
            var grid = fset.down('basegrid');
            if (grid) {
                grid.setReadOnly(disable);
            }
        });
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
        var errorPZBText = '';
        var errorPZB = false;
        var warningPZBText = '';
        var warningPZB = false;
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
            if (key && key.indexOf('zusatzwert') > -1) {
                errorPZB = true;
                content = errors[key];
                keyText = i18n.getMsg(key);
                for (i = 0; i < content.length; i++) {
                    errorPZBText += keyText + ': ' +
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
            if (key && key.indexOf('zusatzwert') > -1) {
                warningPZB = true;
                content = warnings[key];
                keyText = i18n.getMsg(key);
                for (i = 0; i < content.length; i++) {
                    warningPZBText += keyText + ': ' +
                        i18n.getMsg(content[i].toString()) + '\n';
                }
            }
        }
        this.down('fset[name=orte]').showWarningOrError(
            warningOrt,
            warningOrtText === '' ? null : warningOrtText,
            errorOrt,
            errorOrtText === '' ? null : errorOrtText);
        this.down('fset[name=probenzusatzwerte]').showWarningOrError(
            warningPZB,
            warningPZBText === '' ? null : warningPZBText,
            errorPZB,
            errorPZBText === '' ? null : errorPZBText);
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
            this.down('fset[name=probenzusatzwerte]').clearMessages();
        }
    }
});
