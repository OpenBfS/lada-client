/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to add a Ort to a Messprogramm
 */
// TODO: This is >80% identical to Lada.view.form.Ortszuordnung.
// Differences: This has no ortszuordnung record. It only receives and sends
// an ortId

Ext.define('Lada.view.window.MessprogrammOrt', {
    extend: 'Ext.window.Window',
    alias: 'widget.messprogrammort',

    requires: [
        'Lada.view.form.Ortserstellung',
        'Lada.view.panel.Map',
        'Lada.view.grid.Orte'
    ],

    collapsible: true,
    maximizable: true,
    autoshow: true,
    layout: 'fit',
    constrain: true,

    parentWindow: null,

    ortId: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        this.title = i18n.getMsg('messprogrammort.window.title');
        this.buttons = [{
            text: i18n.getMsg('apply'),
            scope: this,
            handler: this.apply
        }, {
            text: i18n.getMsg('cancel'),
            scope: this,
            handler: function() {
                this.close();
                this.parentWindow.down('messprogrammform')
                    .ortWindow = null;
           }
        }];

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            },
            close: function () {
                this.parentWindow.down('messprogrammform')
                    .ortWindow = null;
            }
        });

        this.items = [{
            layout: 'border',
            bodyStyle: {background: '#fff'},
            border: 0,
            items: [{
                xtype: 'map',
                region: 'center',
                layout: 'border',
                margin: '13, 5, 10, 5',
                minHeight: 380,
                externalOrteStore: true
            }, {
                xtype: 'panel',
                layout: 'hbox',
                border: 0,
                margin: '0, 0, 10, 0',
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    border: '0, 1, 1, 1',
                    style: {
                        borderBottom: '1px solid #b5b8c8 !important',
                        borderLeft: '1px solid #b5b8c8 !important',
                        borderRight: '1px solid #b5b8c8 !important'
                    },
                    items: [{
                        text: i18n.getMsg('ortszuordnung.form.setOrt'),
                        tooltip: i18n.getMsg('ortszuordnung.form.setOrt.qtip'),
                        icon: 'resources/img/dialog-ok-apply.png',
                        action: 'setOrt',
                        enableToggle: true,
                        disabled: true
                    }, '->', {
                        text: i18n.getMsg('save'),
                        tooltip: i18n.getMsg('save.qtip'),
                        icon: 'resources/img/dialog-ok-apply.png',
                        action: 'save',
                        disabled: true
                    }, {
                        text: i18n.getMsg('discard'),
                        tooltip: i18n.getMsg('discard.qtip'),
                        icon: 'resources/img/dialog-cancel.png',
                        action: 'discard',
                        disabled: true
                    }]
                }],
                items: [Ext.create('Lada.view.form.OrtInfo')]
            }, {
                region: 'south',
                border: 0,
                layout: 'fit',
                name: 'ortgrid',
                hidden: true,
                maxHeight: 240,
                items: [{
                    xtype: 'ortstammdatengrid'
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    border: '0, 1, 1, 1',
                    style: {
                        borderBottom: '1px solid #b5b8c8 !important',
                        borderLeft: '1px solid #b5b8c8 !important',
                        borderRight: '1px solid #b5b8c8 !important'
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'search',
                        labelWidth: 50,
                        enableKeyEvents: true,
                        fieldLabel: i18n.getMsg('ortszuordnung.ortsuche'),
                    }, '->', {
                        text: i18n.getMsg('orte.new'),
                        action: 'createort'
                    }, {
                        text: i18n.getMsg('orte.frommap'),
                        action: 'frommap'
                    }, {
                        text: i18n.getMsg('orte.clone'),
                        action: 'clone'
                    }]
                }]
            }]
        }];
        this.callParent(arguments);
        //TODO: load the passed OrtId
    },

    selectedFeature: function(context, args) {
    var feature = args[0];
        if (feature.attributes.id &&
            feature.attributes.id !== '') {
            var record = Ext.data.StoreManager.get('orte').getById(feature.attributes.id);
            context.up('window').down('locationform').setRecord(record);
            context.up('window').down('locationform').setReadOnly(true);
            context.up('window').down('location').down('combobox').setValue(record.id);
        }
        else {
            context.up('window').down('locationform').setRecord(this.locationRecord);
            context.up('window').down('locationform').setReadOnly(false);
        }
    },

    /**
     *  updateDetails is used when a value is selected within the location combobox
     *  When this function is called, the map element within the window
     *  which is embedding this form is updated.
     *
     *  Mostly the same as in Lada.controlle.form.Ort
     */
    updateDetails: function(combobox, record) {
        var win = combobox.up('window');
        var details = win.down('locationform');
        //var id = record[0].get('id'); // We are interested in the cbox...
        var id = combobox.getValue();

        if (details) {
            var toLoad = Ext.data.StoreManager.get('orte').getById(id);
            win.down('locationform').setRecord(toLoad);
            win.down('map').selectFeature(id, toLoad);
        }
    },

    /**
     * Write the selected ortId into the record, and update the MessprogrammWindow.
     */
    apply: function(button) {
        var win = button.up('window');
        var ortId = win.down('location').down('combobox').value;
        if (this.parentWindow) {
            this.parentWindow.down('messprogrammform').down('location')
                .down('combobox').setValue(ortId);
        }

        this.parentWindow.down('messprogrammform')
                .ortWindow = null;
        this.close();
    },

    /**
     * Instructs the fields / forms listed in this method to set a message.
     * @param errors These Errors shall be shown
     * @param warnings These Warning shall be shown
     */
    setMessages: function(errors, warnings) {
        //todo this is a stub
    },

    /**
     * Instructs the fields / forms listed in this method to clear their messages.
     */
    clearMessages: function() {
        //todo this is a stub
    }
});

