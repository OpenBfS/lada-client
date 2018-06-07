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
    minWidth: 550,
    margin: 5,
    border: 0,

    recordId: null,

    trackResetOnLoad: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [{
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
                items: ['->', {
                    text: 'Speichern',
                    qtip: 'Daten speichern',
                    icon: 'resources/img/dialog-ok-apply.png',
                    action: 'save',
                    disabled: true
                }, {
                    text: 'Verwerfen',
                    qtip: 'Änderungen verwerfen',
                    icon: 'resources/img/dialog-cancel.png',
                    action: 'discard',
                    disabled: true
                }]
            }],
            items: [{
                layout: 'vbox',
                border: 0,
                items: [{
                    xtype:  'netzbetreiber',
                    name: 'netzbetreiberId',
                    editable: false,
                    readOnly: true,
                    isFormField: false,
                    submitValue: false,
                    fieldLabel: i18n.getMsg('netzbetreiberId'),
                    margin: '0, 5, 5, 5',
                    width: '35%',
                    labelWidth: 80
                }, {
                    xtype: 'tfield',
                    name: 'prnId',
                    fieldLabel: i18n.getMsg('probeNehmerId'),
                    margin: '0, 5, 5, 5',
                    width: '35%',
                    labelWidth: 80,
                    maxLength: 9,
                }, {
                    xtype: 'tfield',
                    name: 'bearbeiter',
                    fieldLabel: i18n.getMsg('bearbeiter'),
                    margin: '0, 5, 5, 5',
                    width: '35%',
                    labelWidth: 80,
                    maxLength: 25
                }, {
                    xtype: 'tfield',
                    name: 'bemerkung',
                    fieldLabel: i18n.getMsg('bemerkung'),
                    margin: '0, 5, 5, 5',
                    width: '35%',
                    labelWidth: 80,
                    maxLength: 60
                }, {
                    xtype: 'tfield',
                    name: 'bezeichnung',
                    fieldLabel: i18n.getMsg('bezeichnung'),
                    margin: '0, 5, 5, 5',
                    width: '35%',
                    labelWidth: 80,
                    maxLength: 80
                }, {
                    xtype: 'tfield',
                    name: 'kurzBezeichnung',
                    fieldLabel: i18n.getMsg('kurzBezeichnung'),
                    margin: '0, 5, 5, 5',
                    width: '35%',
                    labelWidth: 80,
                    maxLength: 10
                }, {
                    xtype: 'tfield',
                    name: 'ort',
                    fieldLabel: i18n.getMsg('ort'),
                    margin: '0, 5, 5, 5',
                    width: '35%',
                    labelWidth: 80,
                    maxLength: 20
                }, {
                    xtype: 'numfield',
                    name: 'plz',
                    fieldLabel: i18n.getMsg('plz'),
                    margin: '0, 5, 5, 5',
                    width: '35%',
                    labelWidth: 80
                }, {
                    xtype: 'tfield',
                    name: 'strasse',
                    fieldLabel: i18n.getMsg('strasse'),
                    margin: '0, 5, 5, 5',
                    width: '35%',
                    labelWidth: 80,
                    maxLength: 30
                }, {
                    xtype: 'tfield',
                    name: 'telefon',
                    fieldLabel: i18n.getMsg('telefon'),
                    margin: '0, 5, 5, 5',
                    width: '35%',
                    labelWidth: 80,
                    maxLength: 20
                }, {
                    xtype: 'tfield',
                    name: 'tp',
                    fieldLabel: i18n.getMsg('tp'),
                    margin: '0, 5, 5, 5',
                    width: '35%',
                    labelWidth: 80,
                    maxLength: 3
                }, {
                    xtype: 'tfield',
                    name: 'typ',
                    fieldLabel: i18n.getMsg('typ'),
                    margin: '0, 5, 5, 5',
                    width: '35%',
                    labelWidth: 80,
                    maxLength: 1
                }]
            }]
        }];
        this.callParent(arguments);
        this.clearMessages();
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
        this.down('tfield[name=bezeichnung]').clearWarningOrError();
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
        this.down('netzbetreiber').setReadOnly(value);
        this.down('tfield[name=bearbeiter]').setReadOnly(value);
        this.down('tfield[name=bemerkung]').setReadOnly(value);
        this.down('tfield[name=bezeichnung]').setReadOnly(value);
        this.down('tfield[name=kurzBezeichnung]').setReadOnly(value);
        this.down('tfield[name=ort]').setReadOnly(value);
        this.down('numfield[name=plz]').setReadOnly(value);
        this.down('tfield[name=strasse]').setReadOnly(value);
        this.down('tfield[name=telefon]').setReadOnly(value);
        this.down('tfield[name=tp]').setReadOnly(value);
        this.down('tfield[name=typ]').setReadOnly(value);
    }
});
