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

    requires: [
        'Lada.view.form.OrtInfo',
        'Lada.view.widget.OrtszuordnungTyp',
        'Lada.view.widget.Verwaltungseinheit',
        'Lada.view.widget.Staat'
    ],

    layout: 'fit',
    margin: '5, 5, 0, 5',
    border: 0,

    /**
     * @cfg: the type of the record to be passed. Should be either 'probe' or 'mpr'.
     * Variable naming of these differ slightly (see function initComponent and the
     * two lada.data.model.ortszuordnung* )
     */
    type: null,

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
                overflowY: 'auto',
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
                        qtip: 'Änderungen verwerfen',
                        icon: 'resources/img/dialog-cancel.png',
                        action: 'revert',
                        disabled: true
                    }]
                }],
                items: [{
                    layout: 'hbox',
                    border: 0,
                    margin: '0, 0, 10, 0',
                    items: [{
                        layout: 'vbox',
                        border: 0,
                        flex: 1,
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
                                xtype: 'ortszuordnungtyp',
                                labelWidth: 125,
                                allowBlank: false,
                                editable: true,
                                name: 'ortszuordnungTyp',
                                disableKeyFilter: true,
                                fieldLabel: i18n.getMsg('ortszuordnung.form.field.ortszuordnungtyp'),
                            }, {
                                // this field is hidden because the user doesn't
                                // need to know the internal ortID
                                xtype: 'textfield',
                                allowBlank: false,
                                regex: /^[0-9]{1,45}$/,
                                submitValue: true,
                                hidden: true,
                                name: 'ortId',
                                listeners: {
                                    change: me.changed
                                }
                            }]
                        },
                        Ext.create('Lada.view.form.OrtInfo')
                        ]
                    }]
                }]
            }]
        }];
        this.callParent(arguments);
    },

    setRecord: function(record) {
        this.getForm().loadRecord(record);
        this.record = record;
        if (!record.get('readonly')) {
            this.down('[action=setOrt]').enable();
            this.setReadOnly(false);
        }
        else {
            this.setReadOnly(true);
        }
    },

    /**
     * setOrt can be called from a CallbackFunction, ie select from a grid.
     * it will set the ortId of this record
     */
    setOrt: function(row, selRecord, index, opts) {
        if (selRecord) {
            var newOrtId = selRecord.get('id');
        }
        if (newOrtId) {
            this.getForm().setValues({ortId: newOrtId});
            this.setOrtInfo(selRecord);
        }
    },

    setOrtInfo: function(ortrecord) {
        var verwStore = Ext.StoreManager.get('verwaltungseinheiten');
        var verw = verwStore.getById(ortrecord.get('gemId'));
        var staatStore = Ext.StoreManager.get('staaten');
        var staat = staatStore.getById(ortrecord.get('staatId'));
        var ortinfo = this.down('ortinfo');
        ortinfo.loadRecord(ortrecord);
        if (verw !== null) {
            ortinfo.getForm().setValues({gemeinde: verw.get('bezeichnung')});
        } else {
            ortinfo.getForm().setValues({gemeinde: ''});
        }
        if (staat !== null) {
            ortinfo.getForm().setValues({staat: staat.get('staatIso')});
        } else {
            ortinfo.getForm().setValues({staat: ''});
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
                element.showErrors(errorText);
            }
        }
     },

    clearMessages: function() {
        this.down('tfield[name=ortszusatztext]').clearWarningOrError();
     },

    setReadOnly: function(value) {
        this.down('tfield[name=ortszusatztext]').setReadOnly(value);
        var fieldId = 'textfield[name=ortszuordnungTyp]';
        this.down(fieldId).setReadOnly(value);
    },

    /**
     * Helper to trigger the forms' validity check
     */
    changed: function(newValue, oldValue) {
        var controller = Lada.app.getController(
            'Lada.controller.form.Ortszuordnung');
        var form = this.up('form').getForm();
        controller.validityChange(form, form.isValid());
    }
});

