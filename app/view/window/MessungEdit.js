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
    extend: 'Lada.view.window.RecordWindow',
    alias: 'widget.messungedit',

    requires: [
        'Lada.view.form.Messung',
        'Lada.view.grid.Messwert',
        'Lada.view.grid.Status',
        'Lada.view.grid.MKommentar'
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
    grid: null,
    mStore: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        this.title = i18n.getMsg('title.loading.messung');

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
        this.modelClass = Lada.model.Messung;
        if (this.record) {
            this.recordId = this.record.get('id');
        }
        this.callParent(arguments);
    },

    /**
     * Initialize ui elements and replace placeholder panel
     */
    intializeUI: function() {
        var i18n = Lada.getApplication().bundle;

        if (this.record === null) {
            Ext.Msg.alert(i18n.getMsg('err.msg.messung.noselect'));
            return;
        }
        if (this.probe === null) {
            Ext.Msg.alert(i18n.getMsg('err.msg.messung.noprobe'));
            return;
        }

        //Clone proxy instance as it seems to be shared between store instances
        var store = Ext.create('Lada.store.Messgroessen');
        var proxy = Ext.clone(store.getProxy());
        proxy.extraParams = {};
        store.setProxy(proxy);
        this.mStore = store;
        this.mStore.proxy.extraParams = {mmtId: this.record.get('mmtId')};
        this.mStore.load();

        this.removeAll();
        this.add([{
            border: false,
            autoScroll: true,
            items: [{
                xtype: 'messungform',
                margin: 5,
                recordId: this.record.get('id')
            }, {
                xtype: 'fset',
                name: 'messwerte',
                title: i18n.getMsg('title.messwerte'),
                padding: '5, 5',
                margin: 5,
                items: [{
                    xtype: 'messwertgrid',
                    minHeight: 130,
                    recordId: this.record.get('id'),
                    umwId: this.probe.get('umwId'),
                    messgroesseStore: this.mStore
                }]
            }, {
                xtype: 'fset',
                name: 'messungstatus',
                title: i18n.getMsg('title.status'),
                padding: '5, 5',
                margin: 5,
                items: [{
                    xtype: 'statusgrid',
                    recordId: this.record.get('id')
                }]
            }, {
                xtype: 'fset',
                name: 'messungskommentare',
                title: i18n.getMsg('title.kommentare'),
                padding: '5, 5',
                margin: 5,
                items: [{
                    xtype: 'mkommentargrid',
                    recordId: this.record.get('id')
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
        var loadCallback = function(record, response) {
            me.intializeUI();
            me.mStore.proxy.extraParams = {mmtId: record.get('mmtId')};
            me.mStore.load();
            if (
                me.parentWindow &&
                me.parentWindow.record.get('treeModified') <
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
                                'treeModified', me.probe.get('treeModified'));
                            me.disableForm();
                        }
                    }
                });
            }
            me.down('messwertgrid').messgroesseStore = me.mStore;
            me.down('messungform').setRecord(record);
            me.record = record;
            var messstelle = Ext.data.StoreManager.get('messstellen')
                .getById(me.probe.get('mstId'));
            me.setTitle('Messung: ' +
                me.record.get('nebenprobenNr') +
                '   zu Probe - Hauptprobennr.: ' +
                me.probe.get('hauptprobenNr') +
                ' Mst: ' +
                messstelle.get('messStelle') +
                ' editieren.');
            var json = null;
            if (response.getResponse().responseText) {
                json = Ext.decode(response.getResponse().responseText);
            }
            if (json) {
                me.setMessages(json.errors, json.warnings);
            }
            if (me.record.get('readonly') === true ||
                me.record.get('owner') === false
            ) {
                me.disableForm();
            } else {
                me.enableForm();
            }
            //Check if it is allowed to edit Status
            if (me.record.get('statusEdit') === true) {
                me.enableStatusEdit();
            } else {
                me.disableStatusEdit();
            }
        };
        if (!loadedRecord) {
            Ext.ClassManager.get('Lada.model.Messung').load(
                this.record.get('id'), {
                    success: loadCallback,
                    scope: this
                });
        } else {
            loadCallback(loadedRecord);
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
        this.down('fset[name=messwerte]').down('messwertgrid')
            .setReadOnly(true);
        this.down('fset[name=messwerte]').down('messwertgrid').readOnly = true;
        this.down('fset[name=messungskommentare]').down('mkommentargrid')
            .setReadOnly(true);
        this.down('fset[name=messungskommentare]').down('mkommentargrid')
            .readOnly = true;
        this.disableStatusEdit();
    },

    /**
     * Enable the Childelements of this window
     */
    enableChildren: function() {
        this.down('fset[name=messwerte]').down('messwertgrid')
            .setReadOnly(false);
        this.down('fset[name=messwerte]').down('messwertgrid').readOnly = false;
        this.down('fset[name=messungskommentare]').down('mkommentargrid')
            .setReadOnly(false);
        this.down('fset[name=messungskommentare]').down('mkommentargrid')
            .readOnly = false;
        this.enableStatusEdit();
    },


    /**
     * Enable to edit the statusgrid
     */
    enableStatusEdit: function() {
        this.down('statuskombi').setReadOnly(false);
    },

    /**
     * Disable to edit the statusgrid
     */
    disableStatusEdit: function() {
        this.down('statuskombi').setReadOnly(true);
    },

    /**
     * Called before closing the form window. Shows confirmation dialogue
     * window to save the form if dirty*/
    handleBeforeClose: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var item;
        try {
            item = me.down('messungform');
        } catch (e) {
            Ext.log({
                msg: 'Closing uninitialized messung window: ' + e,
                level: 'warn'});
            return;
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
     * Set the current ProbeRecord
     * @param {Lada.model.Probe} probeRecord New probe record
     */
    setProbe: function(probeRecord) {
        this.probe = probeRecord;
    },

    /**
     * Instructs the fields / forms listed in this method to set a message.
     * @param errors These Errors shall be shown
     * @param warnings These Warning shall be shown
     */
    setMessages: function(errors, warnings) {
        this.down('messungform').setMessages(errors, warnings);
        var errorMesswertText = '';
        var errorMesswert = false;
        var warningMesswertText = '';
        var warningMesswert = false;
        var key;
        var content;
        var i;
        var keyText;
        var i18n = Lada.getApplication().bundle;
        for (key in errors) {
            if (key && key.indexOf('messwert') > -1) {
                errorMesswert = true;
                content = errors[key];
                keyText = i18n.getMsg(key);
                for (i = 0; i < content.length; i++) {
                    errorMesswertText += keyText + ': ' +
                        i18n.getMsg(content[i].toString()) + '\n';
                }
            }
        }
        for (key in warnings) {
            if (key && key.indexOf('messwert') > -1) {
                warningMesswert = true;
                content = warnings[key];
                keyText = i18n.getMsg(key);
                for (i = 0; i < content.length; i++) {
                    warningMesswertText += keyText + ': ' +
                        i18n.getMsg(content[i].toString()) + '\n';
                }
            }
        }
        this.down('fset[name=messwerte]').showWarningOrError(
            warningMesswert,
            warningMesswertText === '' ? null : warningMesswertText,
            errorMesswert,
            errorMesswertText === '' ? null : errorMesswertText);
    },

    /**
     * Instructs the fields / forms listed in this method to clear their
     * messages.
     */
    clearMessages: function() {
        var messungform = this.down('messungform');
        var messwerteSet = this.down('fset[name=messwerte]');
        if (messungform && messwerteSet) {
            messungform.clearMessages();
            messwerteSet.clearMessages();
        }
    }

});
