/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to edit a Probe
 */
Ext.define('Lada.view.form.Probenehmer', {
    extend: 'Ext.form.Panel',
    alias: 'widget.probenehmerform',
    requires: [
        'Lada.view.widget.Netzbetreiber',
        'Lada.model.Probenehmer'
    ],

    model: 'Lada.model.Probenehmer',
    minWidth: 400,
    margin: 0,
    border: false,

    record: null,

    trackResetOnLoad: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            border: '0, 1, 1, 1',
            style: {
                borderBottom: '1px solid #b5b8c8 !important',
                borderLeft: '1px solid #b5b8c8 !important',
                borderRight: '1px solid #b5b8c8 !important'
            },
            items: ['->', {
                text: i18n.getMsg('save'),
                qtip: i18n.getMsg('save.qtip'),
                icon: 'resources/img/dialog-ok-apply.png',
                action: 'save',
                disabled: true
            }, {
                text: i18n.getMsg('discard'),
                qtip: i18n.getMsg('discard.qtip'),
                icon: 'resources/img/dialog-cancel.png',
                action: 'discard',
                disabled: true
            }]
        }];
        this.items = [{
            border: false,
            align: 'stretch',
            layout: 'vbox',
            margin: '5, 5, 5, 5',
            defaults: {
                border: false
            },
            items: [{
                layout: 'vbox',
                defaults: {
                    border: false,
                    margin: '5 5 5 5'
                },
                items: [{
                    layout: 'hbox',
                    border: false,
                    width: '100%',
                    items: [{
                        xtype: 'tfield',
                        name: 'prnId',
                        margin: '0 5 0 0',
                        fieldLabel: i18n.getMsg('probenehmerId'),
                        labelWidth: 110,
                        readOnly: true,
                        width: '50%',
                        maxLength: 9
                    }, {
                        xtype: 'netzbetreiber',
                        name: 'netzbetreiberId',
                        editable: false,
                        readOnly: true,
                        isFormField: false,
                        emptyValue: '',
                        width: '50%',
                        fieldLabel: i18n.getMsg('netzbetreiberId'),
                        margin: '0 0 0 5',
                        labelWidth: 110
                    }]
                }, {
                    layout: 'hbox',
                    width: '100%',
                    items: [{
                        xtype: 'tfield',
                        name: 'kurzBezeichnung',
                        fieldLabel: i18n.getMsg('kurzBezeichnung'),
                        labelWidth: 110,
                        readOnly: true,
                        width: '50%',
                        margin: '0 5 0 0',
                        maxLength: 10
                    }, {
                        xtype: 'tfield',
                        name: 'bearbeiter',
                        margin: '0 0 0 5',
                        fieldLabel: i18n.getMsg('bearbeiter'),
                        labelWidth: 110,
                        readOnly: true,
                        width: '50%',
                        maxLength: 25
                    }]
                }, {
                    xtype: 'tfield',
                    name: 'bemerkung',
                    fieldLabel: i18n.getMsg('bemerkung'),
                    margin: '5 5 0 5',
                    labelWidth: 110,
                    readOnly: true,
                    maxLength: 60,
                    width: '100%'
                }, {
                    xtype: 'tarea',
                    name: 'bezeichnung',
                    fieldLabel: i18n.getMsg('bezeichnung'),
                    margin: '5 5 0 5',
                    width: '100%',
                    readOnly: true,
                    labelWidth: 110,
                    maxLength: 80
                }, {
                    layout: 'hbox',
                    margin: '5 5 0 5',
                    border: false,
                    width: '100%',
                    items: [{
                        xtype: 'tfield',
                        name: 'tp',
                        fieldLabel: i18n.getMsg('tp'),
                        margin: '0 5 0 0',
                        width: '50%',
                        readOnly: true,
                        labelWidth: 110,
                        maxLength: 3
                    }, {
                        xtype: 'tfield',
                        name: 'typ',
                        fieldLabel: i18n.getMsg('typ'),
                        margin: '0, 0, 0, 5',
                        width: '50%',
                        readOnly: true,
                        labelWidth: 110,
                        maxLength: 1
                    }]
                }, {
                    xtype: 'fieldset',
                    title: i18n.getMsg('address'),
                    border: true,
                    layout: 'vbox',
                    items: [{
                        xtype: 'tfield',
                        name: 'strasse',
                        fieldLabel: i18n.getMsg('strasse'),
                        labelWidth: 100,
                        margin: '5 10 5 10',
                        readOnly: true,
                        width: '100%',
                        maxLength: 30
                    }, {
                        layout: 'hbox',
                        border: false,
                        margin: '5 10 5 10',
                        items: [{
                            xtype: 'numfield',
                            name: 'plz',
                            fieldLabel: i18n.getMsg('plz'),
                            allowDecimals: false,
                            maxLength: 5,
                            readOnly: true,
                            hideTrigger: true,
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            width: '30%',
                            labelWidth: 100
                        }, {
                            xtype: 'tfield',
                            name: 'ort',
                            margin: '0 0 0 10',
                            fieldLabel: i18n.getMsg('ort'),
                            width: '70%',
                            readOnly: true,
                            labelWidth: 100,
                            maxLength: 20
                        }]
                    }, {
                        xtype: 'tfield',
                        name: 'telefon',
                        margin: '5 10 5 10',
                        fieldLabel: i18n.getMsg('telefon'),
                        labelWidth: 100,
                        readOnly: true,
                        maxLength: 20
                    }]
                }]
            }]
        }];
        this.callParent(arguments);
        this.clearMessages();
        this.loadRecord(this.record);
        this.setReadOnly(this.record.get('readonly'));
    },

    setMessages: function(errors, warnings) {
        var key;
        var element;
        var content;
        var i18n = Lada.getApplication().bundle;
        if (warnings) {
            for (key in warnings) {
                var tmp = key;
                if (tmp.indexOf('#') > 0) {
                    tmp = tmp.split('#')[0];
                }
                element = this.down('component[name=' + tmp + ']');
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
                var tmp = key;
                if (tmp.indexOf('#') > 0) {
                    tmp = tmp.split('#')[0];
                }
                element = this.down('component[name=' + tmp + ']');
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
        this.down('tfield[name=prnId]').clearWarningOrError();
        this.down('netzbetreiber').clearWarningOrError();
        this.down('tfield[name=bearbeiter]').clearWarningOrError();
        this.down('tfield[name=bemerkung]').clearWarningOrError();
        this.down('tarea[name=bezeichnung]').clearWarningOrError();
        this.down('tfield[name=kurzBezeichnung]').clearWarningOrError();
        this.down('tfield[name=ort]').clearWarningOrError();
        this.down('numfield[name=plz]').clearWarningOrError();
        this.down('tfield[name=strasse]').clearWarningOrError();
        this.down('tfield[name=telefon]').clearWarningOrError();
        this.down('tfield[name=tp]').clearWarningOrError();
        this.down('tfield[name=typ]').clearWarningOrError();
    },

    setReadOnly: function(value) {
        this.down('tfield[name=prnId]').setReadOnly(value);
        this.down('netzbetreiber').readOnly = value;
        this.down('tfield[name=bearbeiter]').setReadOnly(value);
        this.down('tfield[name=bemerkung]').setReadOnly(value);
        this.down('tarea[name=bezeichnung]').setReadOnly(value);
        this.down('tfield[name=kurzBezeichnung]').setReadOnly(value);
        this.down('tfield[name=ort]').setReadOnly(value);
        this.down('numfield[name=plz]').setReadOnly(value);
        this.down('tfield[name=strasse]').setReadOnly(value);
        this.down('tfield[name=telefon]').setReadOnly(value);
        this.down('tfield[name=tp]').setReadOnly(value);
        this.down('tfield[name=typ]').setReadOnly(value);
    }
});
