/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Form to edit the Ortszuordnung of a Probe
 */
Ext.define('Lada.view.form.Ortszuordnung', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ortszuordnungform',

    model: 'Lada.model.Ortszuordnung',

    requires: [
        'Lada.view.form.OrtInfo',
        'Lada.view.widget.Verwaltungseinheit',
        'Lada.view.widget.Staat'
    ],

    layout: 'fit',
    margin: '5, 5, 0, 5',
    border: 0,

    record: null,

    trackResetOnLoad: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.items = [{
            xtype: 'fieldset',
            title: i18n.getMsg('ortszuordnung.form.fset.title'),
            layout: 'fit',
            items: [{
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
                items: [{
                    layout: 'vbox',
                    autoscroll: true,
                    border: 0,
                    items: [{
                        layout: 'vbox',
                        border: 0,
                        margin: '0, 20, 0, 0',
                        items: [{
                            xtype: 'tfield',
                            labelWidth: 125,
                            maxLength: 100,
                            name: 'ortszusatztext',
                            fieldLabel: i18n.getMsg('ortszuordnung.form.field.ortszusatztext')
                        }, {
                            xtype: 'textfield',
                            labelWidth: 125,
                            maxLength: 1,
                            allowBlank: false,
                            regex: /[UEZA]{1}/,
                            activeError: 'U, E, Z oder A eingeben',
                            name: 'ortszuordnungTyp',
                            fieldLabel: i18n.getMsg('ortszuordnung.form.field.ortszuordnungtyp'),

                        }, {
                            // this field is hidden because the user doesn't
                            // need to know the internal ortID
                            xtype: 'textfield',
                            // fieldLabel: i18n.getMsg('orte.ortid'),
                            allowBlank: false,
                            regex: /^[0-9]{1,45}$/,
                            submitValue: true,
                            hidden: true,
                            name: 'ortId',
                            listeners: {
                                change: me.changedOrt
                            }
                        }]
                    },
                    Ext.create('Lada.view.form.OrtInfo', {
                            record: me.record
                    })
                    ]
                }]
            }]
        }];
        this.callParent(arguments);
    },

    setRecord: function(record) {
        this.getForm().loadRecord(record);
        if (!record.get('readonly')) {
            this.down('[action=setOrt]').enable();
            this.setReadOnly(false);
        }
        else {
            this.setReadOnly(true);
        }
        var ortId = this.getRecord().get('ortId');
        this.refreshOrt(ortId);
    },

    refreshOrt: function(ortId) {
        var orteStore = Ext.StoreManager.get('orte');
        var ort = orteStore.getById(ortId);
        if (!ort) {
            return;
        }
        var verwStore = Ext.StoreManager.get('verwaltungseinheiten');
        var verw = verwStore.getById(ort.get('gemId'));
        var staatStore = Ext.StoreManager.get('staaten');
        var staat = staatStore.getById(ort.get('staatId'));
        var ortinfo = this.down('ortinfo')
        ortinfo.loadRecord(ort);
        ortinfo.getForm().setValues({
            gemeinde: verw.get('bezeichnung'),
            staat: staat.get('staatIso'),
            lon: ort.get('longitude'),
            lat: ort.get('latitude')
        });
    },

    /**
     * setOrt can be called from a CallbackFunction, ie select from a grid.
     * it will set the ortId of this record
     */
    setOrt: function(row, selRecord, index, opts) {
        var newOrtId = selRecord.get('id');
        var r = this.getRecord();
        if (newOrtId) {
            if (newOrtId != r.get('ortId')) {
                r.set('ortId', newOrtId);
                this.getForm().setValues({ortId: newOrtId});
                this.refreshOrt(newOrtId);
            }
        }
    },

    setMessages: function(errors, warnings) {
        var key;
        var element;
        var content;
        var i18n = Lada.getApplication().bundle;
        if (warnings) {
            for (key in warnings) {
                element = this.down('component[name=' + key + ']');
                if (!element) {
                    continue;
                }
                content = warnings[key];
                var warnText = '';
                for (var i = 0; i < content.length; i++) {
                    warnText += i18n.getMsg(content[i].toString()) + '\n';
                }
                element.showWarnings(warnText);
            }
        }
        if (errors) {
            for (key in errors) {
                element = this.down('component[name=' + key + ']');
                if (!element) {
                    continue;
                }
                content = errors[key];
                var errorText = '';
                for (var i = 0; i < content.length; i++) {
                    errorText += i18n.getMsg(content[i].toString()) + '\n';
                }
                element.markInvalid(errorText);
            }
        }
     },

    clearMessages: function() {
        this.down('tfield[name=ortszusatztext]').clearWarningOrError();
     },

    setReadOnly: function(value) {
        this.down('tfield[name=ortszusatztext]').setReadOnly(value);
        this.down('textfield[name=ortszuordnungTyp]').setReadOnly(value);
    },

    /**
     * Helper to trigger the forms' validity check on change of ortID
     */
    changedOrt: function() {
        var controller = Lada.app.getController(
            'Lada.controller.form.Ortszuordnung');
        var form = this.up('form').getForm();
        controller.validityChange(form, form.isValid());

    }
});

