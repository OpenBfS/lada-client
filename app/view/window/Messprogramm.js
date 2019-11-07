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
    extend: 'Lada.view.window.TrackedWindow',
    alias: 'widget.messprogramm',

    requires: [
        'Lada.view.form.Messprogramm',
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

        if (this.record === null) {
            this.title = i18n.getMsg('messprogramm.window.create.title');
        } else {
            this.title = i18n.getMsg('messprogramm.window.edit.title');
        }
        this.buttons = [{
            text: i18n.getMsg('generateproben'),
            action: 'generateproben',
            scope: this,
            disabled: this.record? false : true, // disable button if no record is set.
            // further disabling/enabling logic in the controller
            handler: function() {
                //Make the Window a "singleton"
                if (! this.probenWindow) {
                    var winname = 'Lada.view.window.GenProbenFromMessprogramm';
                    var win = Ext.create(winname, {
                        ids: [this.record.get('id')],
                        parentWindow: this
                    });
                    win.initData();
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
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.handleBeforeClose
        }];

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
                this.toggleGenProben();

            }
        });

        this.height = Ext.getBody().getViewSize().height - 30;
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "Id" param to load the correct item.
        this.items = [{
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
        }];
        this.tools = [{
            type: 'help',
            tooltip: i18n.getMsg('help.qtip'),
            titlePosition: 0,
            callback: function() {
                var imprintWin = Ext.ComponentQuery.query('k-window-imprint')[0];
                if (!imprintWin) {
                    imprintWin = Ext.create('Lada.view.window.HelpprintWindow').show();
                    imprintWin.on('afterlayout', function() {
                        var imprintWinController = this.getController();
                        console.log(imprintWinController);
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
        this.clearMessages();
        var me = this;

        // If a record was passed to this window,
        // create a Edit window
        if (this.record) {
            this.setLoading(true);
            var loadCallback = function(record, response) {
                me.down('messprogrammform').setRecord(record);
                me.record = record;
                var json = response ? Ext.decode(response.getResponse().responseText) : null;
                if (json) {
                    this.setMessages(json.errors, json.warnings);
                    /*
                    if (!json.warnings.mediaDesk) {
                    }
                    */
                }
                var mstLaborKombiStore = Ext.data.StoreManager.get('messstellelaborkombi');
                var recordIndex = mstLaborKombiStore.findExact('messStelle', record.get('mstId'));
                // If the Messprogramm is ReadOnly, disable Inputfields and grids
                if ( (me.record.get('readonly') === true) || (recordIndex === -1) ) {
                    me.down('messprogrammform').setReadOnly(true);
                    me.disableChildren();
                } else {
                    me.down('messprogrammform').setReadOnly(false);
                    me.enableChildren();
                    if (record.get('probenintervall') === 'J') {
                        me.down('messprogrammform').down('dayofyear[name=gueltigBis]').setReadOnly(true);
                        me.down('messprogrammform').down('dayofyear[name=gueltigVon]').setReadOnly(true);
                    }
                }

                me.down('messprogrammform').setMediaDesk(record);
                me.setLoading(false);
            };
            if (!loadedRecord) {
                Ext.ClassManager.get('Lada.model.Messprogramm').load(this.record.get('id'), {
                    failure: function(record, action) {
                        me.setLoading(false);
                        // TODO
                        console.log('An unhandled Failure occured. See following Response and Record');
                        console.log(action);
                        console.log(record);
                    },
                    success: loadCallback,
                    scope: this
                });
            } else {
                loadCallback(loadedRecord);
            }
        } else {
            // Create a Create Window
            var record = Ext.create('Lada.model.Messprogramm',{
                gueltigVon: 1,
                gueltigBis: 365});
            this.record = record;
            this.disableChildren();
            var mstLaborKombiStore = Ext.data.StoreManager.get('messstellelaborkombi');
            mstLaborKombiStore.clearFilter(true);
            var items = mstLaborKombiStore.queryBy(function(record) {
            if ( (Lada.mst.indexOf(record.get('messStelle')) > -1) &&
                   (Lada.mst.indexOf(record.get('laborMst')) > -1)) {
                    return true;
                }
            });
            record.set('owner', true);
            record.set('id', null);
            var defaultentry = items.items[0];
            if (defaultentry) {
                record.set('mstId', defaultentry.get('messStelle'));
                record.set('laborMstId', defaultentry.get('laborMst'));
                var mstStore = Ext.data.StoreManager.get('messstellen');
                var netzbetreiber = mstStore.getById(defaultentry.get('messStelle')).get('netzbetreiberId');
                if (Ext.data.StoreManager.get('netzbetreiberFiltered').getCount() > 1) {
                    this.down('messprogrammform').down('netzbetreiber');
                } else {
                    this.down('messprogrammform').down('netzbetreiber').setValue(netzbetreiber);
                }
            }
            this.down('messprogrammform').setRecord(record);
            this.down('messprogrammform').setMediaDesk(record);
            this.down('messprogrammform').down('messstellelaborkombi').down('combobox');
        }
        this.down('messprogrammform').isValid();
    },

    /**
     * Adds new event handler to the toolbar close button to add a save confirmation dialogue if a dirty form is closed
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
     * Called before closing the form window. Shows confirmation dialogue window to save the form if dirty*/
    handleBeforeClose: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var item = me.down('messprogrammform');
        if (!item.getRecord().get('readonly') && item.isDirty()) {
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
                            me.down('messprogrammform').fireEvent('save', me.down('messprogrammform'));
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


    //This was used in a Probewindow, I left it here for reference...
    /*
    enableAddMessungen: function() {
        this.down('fset[name=messungen]').down('messunggrid').setReadOnly(false);
    },
    */

    disableChildren: function() {
        this.down('fset[name=orte]').down('ortszuordnunggrid').setReadOnly(true);
        this.down('messmethodengrid').setReadOnly(true);
    },

    enableChildren: function() {
        this.down('fset[name=orte]').down('ortszuordnunggrid').setReadOnly(false);
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
     * Instructs the fields / forms listed in this method to clear their messages.
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
        if (mmtgrid && mmtgrid.rowEditing && mmtgrid.rowEditing.editing === true) {
            button.setDisabled(true);
            return;
        }

        button.setDisabled(false);
        return;
    }
});
