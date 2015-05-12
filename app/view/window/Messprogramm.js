/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Window to edit a Messprogramm
 */
Ext.define('Lada.view.window.Messprogramm', {
    extend: 'Ext.window.Window',
    alias: 'widget.messprogramm',

    requires: [
        'Lada.view.form.Messprogramm',
        'Lada.view.grid.Messmethoden',
        'Lada.view.grid.Nuklide'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: true,
    autoScroll: true,
    layout: 'fit',
    constrain: true,

    record: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        if (this.record == null) {
            this.title = i18n.getMsg('messprogramm.window.create.title');
        }
        else {
            this.title = i18n.getMsg('messprogramm.window.edit.title');
        }

        this.buttons = [{
            text: i18n.getMsg('generateproben'),
            scope: this,
            disabled: this.record? false : true, //disable button if no record is set.
            handler: function() {
                var winname = 'Lada.view.window.GenProbenFromMessprogramm';
                var win = Ext.create(winname, {
                    record: this.record
                });
                win.show();
                win.initData();
            }
        },
        '->',
        {
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }];
        this.width = 700;

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            }
        });

        this.height = Ext.getBody().getViewSize().height - 30;
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "Id" param to load the correct item.
        this.items = [{
            border: 0,
            autoScroll: true,
            items: [{
                xtype: 'messprogrammform',
                recordId: this.record ? this.record.get('id') : null
            }, {
                //Messmethoden
                xtype: 'fieldset',
                padding: '5, 5',
                title: i18n.getMsg('mmtmessprogramm.form.fieldset.title'),
                margin: 5,
                layout: {
                    type: 'column'
                },
                items: [{
                    xtype: 'messmethodengrid',
                    columnWidth: 0.5,
                    recordId: this.record ? this.record.get('id') : null,
                    flex: 1
                }, {
                    xtype: 'nuklidegrid',
                    columnWidth: 0.5,
                    recordId: this.record ? this.record.get('id') : null,
                    flex: 1
                }]
            }]
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
     */
    initData: function() {
        var i18n = Lada.getApplication().bundle;
        this.clearMessages();
        me = this;

        // If a record was passed to this window,
        // create a Edit window
        if (this.record) {
            this.setLoading(true);
            this.down('messmethodengrid').setReadOnly(false);
            Ext.ClassManager.get('Lada.model.Messprogramm').load(this.record.get('id'), {
                failure: function(record, action) {
                    me.setLoading(false);
                    // TODO
                    console.log('An unhandled Failure occured. See following Response and Record');
                    console.log(action);
                    console.log(record);
                    },
                success: function(record, response) {
                    this.down('messprogrammform').setRecord(record);
                    this.record = record;

                    var json = Ext.decode(response.response.responseText);
                    if (json) {
                        this.setMessages(json.errors, json.warnings);
                    }
                    // If the Messprogramm is ReadOnly, disable Inputfields and grids
                    if (this.record.get('readonly') === true) {
                        this.down('messprogrammform').setReadOnly(true);
                        this.disableChildren();
                    }
                    else {
                        this.down('messprogrammform').setReadOnly(false);
                        this.enableChildren();
                    }
                    me.setLoading(false);
                },
                scope: this
            });
        }
        // Create a Create Window
        else {
            var record = Ext.create('Lada.model.Messprogramm');
            this.down('messmethodengrid').setReadOnly(true);
            this.down('messprogrammform').setRecord(record);
        }
    },

    //This was used in a Probewindow, I left it here for reference...
    /*
    enableAddMessungen: function() {
        this.down('fset[name=messungen]').down('messunggrid').setReadOnly(false);
    },
    */

    disableChildren: function() {
        // there are no children....
    },

    enableChildren: function() {
        // there are no children....
    },

    setMessages: function(errors, warnings) {
        this.down('messprogrammform').setMessages(errors, warnings);
    },

    clearMessages: function() {
        this.down('messprogrammform').clearMessages();
    }
});
