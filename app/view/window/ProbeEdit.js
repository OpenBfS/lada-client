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
    extend: 'Ext.window.Window',
    alias: 'widget.probenedit',

    requires: [
        'Lada.view.form.Probe',
        'Lada.view.grid.Ortszuordnung',
        'Lada.view.grid.Probenzusatzwert',
        'Lada.view.grid.PKommentar',
        'Lada.view.grid.Messung'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: true,
    layout: 'fit',
    constrain: true,

    record: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        if (this.record === null) {
            Ext.Msg.alert('Keine valide Probe ausgewählt!');
            this.callParent(arguments);
            return;
        }
        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.handleBeforeClose
        }];
        this.width = 700;


        // add listeners to change the window appearence when it becomes inactive
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

        this.height = Ext.getBody().getViewSize().height - 30;
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "modelId" param to load the correct item.
        this.items = [{
            border: 0,
            autoScroll: true,
            items: [{
                xtype: 'probeform',
                recordId: this.record.get('id')
            }, {
                xtype: 'fset',
                name: 'orte',
                title: i18n.getMsg('title.ortsangabe'),
                padding: '5, 5',
                margin: 5,
                items: [{
                    xtype: 'ortszuordnunggrid',
                    recordId: this.record.get('id')
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
                    recordId: this.record.get('id')
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
                    recordId: this.record.get('id')
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
                    recordId: this.record.get('id')
                }]
            }]
        }];
        this.tools = [{
            type: 'help',
            tooltip: 'Hilfe',
            titlePosition: 0,
            callback: function() {
                var imprintWin = Ext.ComponentQuery.query('k-window-imprint')[0];
                if (!imprintWin) {
                    imprintWin = Ext.create('Lada.view.window.HelpprintWindow').show();
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
     * Adds new event handler to the toolbar close button to add a save confirmation dialogue if a dirty form is closed
     */
    customizeToolbar: function() {
        var tools = this.tools;
        for (var i = 0; i < tools.length; i++) {
            if (tools[i].type == 'close') {
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
        this.setLoading(true);
        this.clearMessages();
        me = this;
        Ext.ClassManager.get('Lada.model.Probe').load(this.record.get('id'), {
            failure: function(record, action) {
                me.setLoading(false);
                // TODO
                console.log('An unhandled Failure occured. See following Response and Record');
                console.log(action);
                console.log(record);
            },
            success: function(record, response) {
                this.down('probeform').setRecord(record);
                this.record = record;
                var owner = this.record.get('owner');
                var readonly = this.record.get('readonly');

                var messstelle = Ext.data.StoreManager.get('messstellen')
                    .getById(this.record.get('mstId'));
                var datenbasis = Ext.data.StoreManager.get('datenbasis')
                    .getById(this.record.get('datenbasisId'));
                var title = '';
                if (datenbasis) {
                    title += datenbasis.get('datenbasis');
                    title += ' ';
                }
                title += 'Probe'
                if (this.record.get('hauptprobenNr')) {
                    title += ' - Hauptprobennr.: ';
                    title += this.record.get('hauptprobenNr');
                }
                if (messstelle) {
                    title += ' Mst: ';
                    title += messstelle.get('messStelle');
                }
                this.setTitle(title);

                if (owner) {
                    //Always allow to Add Messungen.
                    me.enableAddMessungen();
                }

                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    this.setMessages(json.errors, json.warnings);
                    //if (!json.warnings.mediaDesk) { // TODO: not sure why this condition was present
                    this.down('probeform').setMediaDesk(record);
                    //}
                }
                // If the Probe is ReadOnly, disable Inputfields and grids
                if (readonly === true || !owner) {
                    this.down('probeform').setReadOnly(true);
                    this.disableChildren();
                } else {
                    this.down('probeform').setReadOnly(false);
                    this.enableChildren();
                }
                me.setLoading(false);
            },
            scope: this
        });
    },

    /**
     * Called before closing the form window. Shows confirmation dialogue window to save the form if dirty
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
                            me.down('probeform').fireEvent('save', me.down('probeform'));
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
     * Enable the Messungengrid
     */
    enableAddMessungen: function() {
        this.down('fset[name=messungen]').down('messunggrid').setReadOnly(false);
    },

    /**
     * Disable the Childelements of this window
     */
    disableChildren: function() {
        if (!this.record.get('owner')) {
            // Disable only when the User is not the owner of the Probe
            // Works in symbiosis with success callback some lines above.
            this.down('fset[name=messungen]').down('messunggrid').setReadOnly(true);
            this.down('fset[name=messungen]').down('messunggrid').readOnly = true;
        }
        this.down('fset[name=orte]').down('ortszuordnunggrid').setReadOnly(true);
        this.down('fset[name=probenzusatzwerte]').down('probenzusatzwertgrid').setReadOnly(true);
        this.down('fset[name=pkommentare]').down('pkommentargrid').setReadOnly(true);
    },

    /**
     * Enable the Childelements of this window
     */
    enableChildren: function() {
        this.down('fset[name=messungen]').down('messunggrid').setReadOnly(false);
        this.down('fset[name=orte]').down('ortszuordnunggrid').setReadOnly(false);
        this.down('fset[name=probenzusatzwerte]').down('probenzusatzwertgrid').setReadOnly(false);
        this.down('fset[name=pkommentare]').down('pkommentargrid').setReadOnly(false);
    },

    /**
     * Instructs the fields / forms listed in this method to set a message.
     * @param errors These Errors shall be shown
     * @param warnings These Warning shall be shown
     */
    setMessages: function(errors, warnings) {
        this.down('probeform').setMessages(errors, warnings);
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
     * Instructs the fields / forms listed in this method to clear their messages.
     */
    clearMessages: function() {
        this.down('probeform').clearMessages();
        this.down('fset[name=orte]').clearMessages();
    }
});
