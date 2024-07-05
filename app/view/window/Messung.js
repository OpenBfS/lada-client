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
Ext.define('Lada.view.window.Messung', {
    extend: 'Lada.view.window.RecordWindow',
    alias: 'widget.messungedit',

    requires: [
        'Lada.view.form.Messung',
        'Lada.view.grid.Messwert',
        'Lada.view.grid.Status',
        'Lada.view.grid.MKommentar',
        'Lada.view.widget.Tag',
        'Lada.view.window.HelpprintWindow',
        'Lada.view.window.SetTags'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: false,
    autoscroll: true,
    layout: 'fit',
    constrain: true,

    probe: null,
    parentWindow: null,
    record: null,
    recordType: 'messung',
    mStore: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        this.title = i18n.getMsg('title.loading.messung');

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

        this.on({
            activate: function() {
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function() {
                this.getEl().addCls('window-inactive');
            }
        });

        this.width = 700;
        this.height = Ext.getBody().getViewSize().height - 30;

        this.tools = [{
            type: 'help',
            tooltip: i18n.getMsg('help.qtip'),
            titlePosition: 0,
            callback: function() {
                var imprintWin = Ext.ComponentQuery.query(
                    'k-window-imprint')[0];
                if (!imprintWin) {
                    imprintWin = Ext.create(
                        'Lada.view.window.HelpprintWindow').show();
                    imprintWin.on('afterlayout', function() {
                        var imprintWinController = this.getController();
                        imprintWinController.setTopic('messung');
                    }, imprintWin, {single: true});
                } else {
                    // BasiGX.util.Animate.shake(imprintWin);
                    var imprintWinController = imprintWin.getController();
                    imprintWinController.shake(imprintWin);
                    imprintWinController.setTopic('messung');
                }
            }
        }];
        this.modelClass = Lada.model.Measm;
        if (this.record) {
            this.recordId = this.record.get('id');
        }
        this.callParent(arguments);
    },

    /**
     * Initialize ui elements and replace placeholder panel
     */
    intializeUI: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;

        if (this.probe === null) {
            Ext.Msg.alert(i18n.getMsg('err.msg.messung.noprobe'));
            return;
        }

        this.mStore = Ext.create('Lada.store.Messgroessen');

        this.removeAll();

        this.add([{
            border: false,
            autoScroll: true,
            items: [{
                xtype: 'messungform',
                margin: 5
            }, {
                // Tags
                xtype: 'fieldset',
                title: i18n.getMsg('title.tagmessungenfieldset'),
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
                                'tag.assignwindow.title.messung', 1),
                            parentWindow: me,
                            recordType: 'messung'
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
                name: 'measVals',
                title: i18n.getMsg('title.messwerte'),
                padding: '5, 5',
                margin: 5,
                items: [{
                    xtype: 'messwertgrid',
                    minHeight: 130,
                    umwId: this.probe.get('envMediumId'),
                    messgroesseStore: this.mStore
                }]
            }, {
                xtype: 'fset',
                name: 'statusProts',
                title: i18n.getMsg('title.status'),
                padding: '5, 5',
                margin: 5,
                items: [{
                    xtype: 'statusgrid'
                }]
            }, {
                xtype: 'fset',
                name: 'commMeasms',
                title: i18n.getMsg('title.kommentare'),
                padding: '5, 5',
                margin: 5,
                items: [{
                    xtype: 'mkommentargrid'
                }]
            }]
        }]);
    },

    /**
     * Initialise the Data of this Window
     * @param loadedRecord if given, it is assumed that this is a freshly
     * loaded record, not requiring a reload from server
     */
    initData: function(loadedRecord) {
        this.clearMessages();
        var me = this;
        var loadCallback = function(record) {
            me.intializeUI();

            const mmtIdKey = 'mmtId';
            var mmtId = record.get(mmtIdKey), params = {};
            if (mmtId) {
                params[mmtIdKey] = mmtId;
            }
            me.mStore.load({
                params: params
            });

            if (
                me.parentWindow &&
                me.parentWindow.record.get('treeMod') <
                    record.get('parentModified')
            ) {
                var i18n = Lada.getApplication().bundle;
                Ext.Msg.show({
                    title: i18n.getMsg('probe.outdated.title'),
                    msg: i18n.getMsg('probe.outdated.msg'),
                    buttons: Ext.Msg.OKCANCEL,
                    icon: Ext.Msg.WARNING,
                    closable: false,
                    fn: function(button) {
                        if (button === 'ok') {
                            me.close();
                            me.parentWindow.initData();
                        } else {
                            me.record.set(
                                'treeMod', me.probe.get('treeMod'));
                            me.down('messungform').setReadOnly(true);
                            me.disableChildren(true);
                        }
                    }
                });
            }
            me.down('messwertgrid').messgroesseStore = me.mStore;
            me.down('messungform').setRecord(record);
            me.record = record;

            me.setTitle(me.createTitle());

            me.setMessages(
                record.get('errors'),
                record.get('warnings'),
                record.get('notifications'));

            // Set disabled state of sub-components
            me.disableChildren(
                me.record.get('readonly') || !me.record.get('owner'));
            me.disableStatusEdit(!me.record.get('statusEdit'));
            me.down('button[name=reload]').setDisabled(record.phantom);

            // Initialize Tag widget
            if (me.recordId) {
                me.down('tagwidget').setTagged([me.recordId], 'messung');
                me.down('button[action=tagedit]').setDisabled(
                    Lada.mst.length === 0);
            }

            // Initialize grids
            me.query('basegrid').forEach(function(grid) {
                grid.initData();
            });

            me.down('messungform').isValid();
            me.setLoading(false);
        };
        if (!loadedRecord && this.record) {
            Ext.ClassManager.get('Lada.model.Measm').load(
                this.record.get('id'), {
                    success: loadCallback,
                    scope: this
                });
        } else if (!loadedRecord) {
            // Create new measm
            var record = Ext.create('Lada.model.Measm', {
                sampleId: this.parentWindow.record.get('id')
            });
            record.set('id', null);
            loadCallback(record);
        } else {
            loadCallback(loadedRecord);
        }
    },

    createTitle: function() {
        var i18n = Lada.getApplication().bundle;
        var title = '';
        var messstelle = Ext.data.StoreManager.get('messstellen')
            .getById(this.probe.get('measFacilId'));
        if (this.record.phantom) {
            title = i18n.getMsg(
                'messung.new.title',
                this.probe.get('extId'),
                this.probe.get('mainSampleId'),
                messstelle.get('name'));
        } else {
            title += i18n.getMsg('messung') + ': ';
            var minSampleId = this.record.get('minSampleId');
            if (minSampleId) {
                title += minSampleId;
            }
            title += ' zu Probe ' + this.probe.get('extId') ;
            var mainSampleId = this.probe.get('mainSampleId');
            if (mainSampleId) {
                title += ' / ' + mainSampleId;
            }
            title += ' -  Mst: ' + messstelle.get('name') +
                ' editieren.';
        }
        return title;
    },

    /**
     * Disable or enable child components
     */
    disableChildren: function(disable) {
        for (var fset of this.query('fset')) {
            var grid = fset.down('basegrid');
            if (grid && grid.setReadOnly) {
                grid.setReadOnly(disable);
            }
        }
        this.disableStatusEdit(disable);
    },

    /**
     * Set disabled state to edit the statusgrid
     */
    disableStatusEdit: function(disable) {
        this.down('statuskombi').setReadOnly(disable);
    },

    /**
     * Set the current ProbeRecord
     * @param {Lada.model.Sample} probeRecord New probe record
     */
    setProbe: function(probeRecord) {
        this.probe = probeRecord;
    }
});
