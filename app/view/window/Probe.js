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
Ext.define('Lada.view.window.Probe', {
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
            name: 'reload',
            handler: this.reloadWindow,
            scope: this,
            disabled: true,
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
        this.modelClass = Lada.model.Sample;
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
        var params = {};
        if (this.record) {
            var paramKey = 'envMediumId';
            var umwId = this.record.get(paramKey);
            if (umwId) {
                params[paramKey] = umwId;
            }
        }
        var pzStore = Ext.create('Lada.store.Probenzusaetze').load({
            params: params
        });

        this.removeAll();

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
                    action: 'tagedit',
                    margin: '5 5 5 0',
                    text: i18n.getMsg('tag.toolbarbutton.assigntags'),
                    iconCls: 'x-fa fa-tag',
                    disabled: true,
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
                    xtype: 'ortszuordnunggrid'
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
                    xtype: 'messunggrid'
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
                    xtype: 'pkommentargrid'
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

            me.setTitle(me.createTitle());

            // Set messages
            var json = response ?
                Ext.decode(response.getResponse().responseText) :
                null;
            if (json) {
                me.setMessages(json.errors, json.warnings, json.notifications);
            }

            // Set disabled state of sub-components
            var readonly = record.get('readonly') || !record.get('owner');
            me.down('probeform').setReadOnly(readonly);
            me.disableChildren(readonly || record.phantom);
            me.down('button[name=reload]').setDisabled(record.phantom);

            // Initialize Tag widget
            if (me.recordId) {
                me.down('tagwidget').setTagged([me.recordId], 'probe');
                // Only users with associated Messstelle can (un)assign tags
                me.down('button[action=tagedit]').setDisabled(
                    Lada.mst.length === 0);
            }

            // Initialize grids
            me.query('basegrid').forEach(function(grid) {
                grid.initData();
            });

            me.setLoading(false);
            me.down('probeform').isValid();
        };
        if (!loadedRecord && this.record) {
            Ext.ClassManager.get('Lada.model.Sample').load(
                this.record.get('id'), {
                    failure: function() {
                        me.setLoading(false);
                    },
                    success: loadCallBack
                });
        } else if (!loadedRecord) {
            // Create new sample
            var mst = Ext.getStore('messstellenFiltered').getData().getAt(0);
            var record = Ext.create('Lada.model.Sample', {
                readonly: false,
                owner: true,
                measFacilId: mst ? mst.get('messStelle') : null,
                apprLabId: mst ? mst.get('laborMst') : null
            });
            record.set('id', null);
            loadCallBack(record);
            this.down('probeform').setMessages(
                [],
                { sampleStartDate: [631], envMediumId: [631] },
                { mainSampleId: [631] }
            );
        } else {
            loadCallBack(loadedRecord);
        }
    },

    createTitle: function() {
        var i18n = Lada.getApplication().bundle;
        var title = '';
        var datenbasis = Ext.data.StoreManager.get('datenbasis')
            .getById(this.record.get('regulationId'));
        if (datenbasis) {
            title += datenbasis.get('name');
            title += ' ';
        }
        title += i18n.getMsg('probe') + ': ';
        var extId = this.record.get('extId');
        if (extId) {
            title += extId;
        } else {
            title += i18n.getMsg('probe.new.title');
        }
        var mainSampleId = this.record.get('mainSampleId');
        if (mainSampleId) {
            //title += ' - extPID/Hauptprobennr.: ';
            title += ' / ' + mainSampleId;
        }
        var messstelle = Ext.data.StoreManager.get('messstellen')
            .getById(this.record.get('measFacilId'));
        if (messstelle) {
            title += '    -    Mst: ';
            title += messstelle.get('name');
        }
        return title;
    },

    /**
     * Disable or enable grids in fieldsets in this window
     */
    disableChildren: function(disable) {
        var isOwner = this.record.get('owner');
        this.query('fset').forEach(function(fset) {
            var grid = fset.down('basegrid');
            if (grid) {
                //Special handling for measm grid:
                //Disable only if user does not own the sample
                grid.setReadOnly(
                    !(grid.xtype === Lada.view.grid.Messung.xtype && isOwner)
                    && disable);
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
