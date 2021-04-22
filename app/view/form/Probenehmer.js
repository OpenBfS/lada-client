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
            items: [{
                text: i18n.getMsg('copy'),
                action: 'copy',
                qtip: i18n.getMsg('copy.qtip', i18n.getMsg('ort')),
                icon: 'resources/img/dialog-ok-apply.png',
                disabled: !this.record.phantom && !this.record.get('readonly') ?
                    false :
                    true
            },
            '->',
            {
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
                        allowBlank: false,
                        width: '50%',
                        maxLength: 9
                    }, {
                        xtype: 'netzbetreiber',
                        name: 'netzbetreiberId',
                        editable: true,
                        readOnly: true,
                        //submitValue: true,
                        allowBlank: false,
                        width: '50%',
                        filteredStore: true,
                        fieldLabel: i18n.getMsg('netzbetreiberId'),
                        margin: '0 0 0 5',
                        labelWidth: 110,
                        value: this.record.get('netzbetreiberId')
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
                        allowBlank: false,
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
                    allowBlank: false,
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
                        name: 'tourenplan',
                        fieldLabel: i18n.getMsg('tourenplan'),
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
                        name: 'betrieb',
                        fieldLabel: i18n.getMsg('betrieb'),
                        labelWidth: 100,
                        margin: '5 10 5 10',
                        readOnly: true,
                        width: '100%',
                        maxLength: 80
                    }, {
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
                            xtype: 'tfield',
                            name: 'plz',
                            fieldLabel: i18n.getMsg('plz'),
                            maxLength: 5,
                            readOnly: true,
                            width: '30%',
                            regex: /^[0-9]*$/,
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
        var netzstore = this.down('netzbetreiber').store;
        if ( (!this.record.phantom) || (this.record.phantom &&
            this.record.get('netzbetreiberId')) ) {
            var current = netzstore.getById(this.record.get('netzbetreiberId'));
            if (current) {
                this.down('netzbetreiber').setValue(current);
                this.down('netzbetreiber').setReadOnly(true);
            }
        } else {
            this.down('netzbetreiber').setValue(Lada.netzbetreiber[0]);
        }
        this.isValid();
    },

    setRecord: function(probenehmerRecord) {
        this.clearMessages();
        this.getForm().loadRecord(probenehmerRecord);
    },

    setMessages: function(errors, warnings) {
        var key;
        var element;
        var content;
        var tmp;
        var i18n = Lada.getApplication().bundle;
        if (warnings) {
            for (key in warnings) {
                tmp = key;
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
                tmp = key;
                if (tmp.indexOf('#') > 0) {
                    tmp = tmp.split('#')[0];
                }
                element = this.down('component[name=' + tmp + ']');
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
        this.down('tfield[name=prnId]').clearWarningOrError();
        this.down('netzbetreiber').clearWarningOrError();
        this.down('tfield[name=bearbeiter]').clearWarningOrError();
        this.down('tfield[name=bemerkung]').clearWarningOrError();
        this.down('tarea[name=bezeichnung]').clearWarningOrError();
        this.down('tfield[name=kurzBezeichnung]').clearWarningOrError();
        this.down('tfield[name=ort]').clearWarningOrError();
        this.down('tfield[name=betrieb]').clearWarningOrError();
        this.down('tfield[name=plz]').clearWarningOrError();
        this.down('tfield[name=strasse]').clearWarningOrError();
        this.down('tfield[name=telefon]').clearWarningOrError();
        this.down('tfield[name=tourenplan]').clearWarningOrError();
        this.down('tfield[name=typ]').clearWarningOrError();
    },

    setReadOnly: function(value) {
        this.down('tfield[name=prnId]').setReadOnly(value);
        this.down('netzbetreiber').setReadOnly(value);
        this.down('tfield[name=bearbeiter]').setReadOnly(value);
        this.down('tfield[name=bemerkung]').setReadOnly(value);
        this.down('tarea[name=bezeichnung]').setReadOnly(value);
        this.down('tfield[name=kurzBezeichnung]').setReadOnly(value);
        this.down('tfield[name=betrieb]').setReadOnly(value);
        this.down('tfield[name=ort]').setReadOnly(value);
        this.down('tfield[name=plz]').setReadOnly(value);
        this.down('tfield[name=strasse]').setReadOnly(value);
        this.down('tfield[name=telefon]').setReadOnly(value);
        this.down('tfield[name=tourenplan]').setReadOnly(value);
        this.down('tfield[name=typ]').setReadOnly(value);
    }
});
