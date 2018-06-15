/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to edit a MessprogrammKategorie
 */
Ext.define('Lada.view.form.MessprogrammKategorie', {
    extend: 'Ext.form.Panel',
    alias: 'widget.mprkatform',
    requires: [
        'Lada.view.widget.Netzbetreiber',
        'Lada.model.MessprogrammKategorie'
    ],

    model: 'Lada.model.MessporgrammKategorie',
    minWidth: 550,
    margin: 5,
    border: 0,

    record: null,

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
            }],
            items: [{
                layout: 'vbox',
                border: 0,
                items: [{
                    xtype: 'netzbetreiber',
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
                    name: 'code',
                    fieldLabel: i18n.getMsg('code'),
                    margin: '0, 5, 5, 5',
                    width: '35%',
                    labelWidth: 80,
                    maxLength: 120
                }, {
                    xtype: 'tfield',
                    name: 'bezeichnung',
                    fieldLabel: i18n.getMsg('bezeichnung'),
                    margin: '0, 5, 5, 5',
                    width: '35%',
                    labelWidth: 80,
                    maxLength: 120
                }]
            }]
        }];
        this.callParent(arguments);
        this.clearMessages();
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
        this.down('netzbetreiber').clearWarningOrError();
        this.down('tfield[name=bezeichnung]').clearWarningOrError();
        this.down('tfield[name=code]').clearWarningOrError();
    },

    setReadOnly: function(value) {
        this.down('netzbetreiber').setReadOnly(value);
        this.down('tfield[name=bezeichnung]').setReadOnly(value);
        this.down('tfield[name=code]').setReadOnly(value);
    }
});