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
        'Lada.view.widget.Staat',
        'Lada.view.widget.base.TextArea'
    ],

    layout: 'fit',
    margin: '5, 5, 0, 5',
    border: false,

    /**
     * @cfg: the type of the record to be passed. Should be either 'probe' or 'mpr'.
     * Variable naming of these differ slightly (see function initComponent and the
     * two lada.data.model.ortszuordnung* )
     */
    type: null,

    record: null,

    currentOrt: null, // the record of the currently set Ort

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
                border: false,
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
                    items: ['->', {
                        text: i18n.getMsg('orte.show'),
                        tooltip: i18n.getMsg('save.qtip'),
                        // TODO icon:
                        action: 'showort'
                    }, {
                        text: i18n.getMsg('save'),
                        tooltip: i18n.getMsg('save.qtip'),
                        icon: 'resources/img/dialog-ok-apply.png',
                        action: 'save',
                        disabled: true
                    }, {
                        text: i18n.getMsg('discard'),
                        qtip: i18n.getMsg('discard.qtip'),
                        icon: 'resources/img/dialog-cancel.png',
                        action: 'revert',
                        disabled: true
                    }]
                }],
                items: [{
                    layout: 'hbox',
                    border: false,
                    margin: '0, 0, 5, 0',
                    items: [{
                        layout: 'vbox',
                        border: false,
                        flex: 1,
                        items: [{
                            layout: 'vbox',
                            border: false,
                            margin: '0, 20, 0, 0',
                            items: [{
                                xtype: 'ortszuordnungtyp',
                                labelWidth: 120,
                                allowBlank: false,
                                editable: true,
                                name: 'ortszuordnungTyp',
                                disableKeyFilter: true,
                                fieldLabel: i18n.getMsg('ortszuordnung.form.field.ortszuordnungtyp')
                            },{
                                // empty conttainer for vertical separation
                                xtype: 'container',
                                minHeight: 20
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
                            },
                            Ext.create('Lada.view.form.OrtInfo'),
                            {
                                xtype: 'tarea',
                                labelWidth: 125,
                                maxLength: 100,
                                name: 'ortszusatztext',
                                fieldLabel: i18n.getMsg('ortszuordnung.form.field.ortszusatztext'),
                                flex: 1
                            }]
                        }]
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
            this.setReadOnly(false);
        } else {
            this.setReadOnly(true);
        }
    },

    /**
     * setOrt can be called from a CallbackFunction, ie select from a grid.
     * it will set the ortId of this record
     */
    setOrt: function(row, selRecord) {
        if (selRecord) {
            var newOrtId = selRecord.get('id');
            if (!this.readOnly && newOrtId) {
                this.getForm().setValues({ortId: newOrtId});
                this.setOrtInfo(selRecord);
                this.down('button[action=showort]').setDisabled(false);
            }
        } else {
            this.down('button[action=showort]').setDisabled(true);
        }
    },

    /**
     * sets the ort even if the record is readOnly. Used for initially setting a record
     * on existing entries.
     * */
    setFirstOrt: function(record) {
        if (record) {
            this.getForm().setValues({ortId: record.get('id')});
            this.setOrtInfo(record);
        }
    },

    setOrtInfo: function(ortrecord) {
        this.currentOrt = ortrecord;
        var verwStore = Ext.StoreManager.get('verwaltungseinheiten');
        var verw = verwStore.getById(ortrecord.get('gemId'));
        var staatStore = Ext.StoreManager.get('staaten');
        var staat = staatStore.getById(ortrecord.get('staatId'));
        var kdaStore = Ext.StoreManager.get('koordinatenart');
        var kda = kdaStore.getById(ortrecord.get('kdaId'));
        var ortinfo = this.down('ortinfo');
        ortinfo.loadRecord(ortrecord);
        if (verw !== null) {
            ortinfo.getForm().setValues({gemeinde: verw.get('bezeichnung')});
        } else {
            ortinfo.getForm().setValues({gemeinde: ''});
        }
        if (staat !== null) {
            ortinfo.getForm().setValues({
                staatISO: staat.get('staatIso'),
                staat: staat.get('staat')});
        } else {
            ortinfo.getForm().setValues({staat: '', staatISO: ''});
        }
        if (kda !== null) {
            ortinfo.getForm().setValues({
                koordinatenart: kda.get('koordinatenart')});
        } else {
            ortinfo.getForm().setValues({koordinatenart: ''});
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
                for (var j = 0; j < content.length; j++) {
                    errorText += i18n.getMsg(content[j].toString()) + '\n';
                }
                element.showErrors(errorText);
            }
        }
    },

    clearMessages: function() {
        this.down('tarea[name=ortszusatztext]').clearWarningOrError();
        this.down('ortszuordnungtyp[name=ortszuordnungTyp]').clearWarningOrError();
    },

    setReadOnly: function(value) {
        this.readOnly = value;
        this.down('tarea[name=ortszusatztext]').setReadOnly(value);
        var fieldId = 'textfield[name=ortszuordnungTyp]';
        this.down(fieldId).setReadOnly(value);
        if (value) {
            var button = this.down('button[action=save]');
            button.setDisabled(true);
        }
    },

    /**
     * Helper to trigger the forms' validity check
     */
    changed: function() {
        var controller = Lada.app.getController(
            'Lada.controller.form.Ortszuordnung');
        var form = this.up('form').getForm();
        controller.validityChange(form, form.isValid());
    },

    /**
     * When the form is editable, a Record can be selected.
     * If the Record was selected from a grid this function
     * sets the ortzuordnung.
     */
    chooseLocation: function() {
        var win = this.up('ortszuordnungwindow');
        var osg = win.down('ortstammdatengrid');
        var oForm = win.down('ortszuordnungform');
        if (!this.readOnly) {
            osg.addListener('select',oForm.setOrt, oForm);
            var map = win.down('map');
            if (!map.featureLayer) {
                map.initFeatureLayer();
            }
            map.featureLayer.setVisibility(true);
            osg.addListener('select',oForm.setOrt, oForm);
        } else {
            osg.removeListener('select',oForm.setOrt, oForm);
        }
    }
});

