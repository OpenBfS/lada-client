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
Ext.define('Lada.view.form.DatensatzErzeuger', {
    extend: 'Ext.form.Panel',
    alias: 'widget.datensatzerzeugerform',
    requires: [
        'Lada.view.widget.Netzbetreiber',
        'Lada.model.DatensatzErzeuger'
    ],

    model: 'Lada.model.DatensatzErzeuger',
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
                    layout: 'hbox',
                    border: 0,
                    margin: '0 5 5 5',
                    items: [{
                        xtype: 'netzbetreiber',
                        name: 'netzbetreiberId',
                        editable: false,
                        readOnly: true,
                        isFormField: false,
                        submitValue: false,
                        fieldLabel: i18n.getMsg('netzbetreiberId'),
                        labelWidth: 120,
                        margin: '0, 5, 5, 5',
                        width: '35%'
                    }, {
                        xtype: 'combobox',
                        store: Ext.data.StoreManager.get('messstellenFiltered'),
                        displayField: 'messStelle',
                        valueField: 'id',
                        allowBlank: false,
                        queryMode: 'local',
                        editable: false,
                        width: 300,
                        labelWidth: 80,
                        name: 'mstId',
                        fieldLabel: i18n.getMsg('mst_id'),
                        margin: '0, 5, 5, 5'
                    }]
                }, {
                    layout: 'hbox',
                    border: 0,
                    margin: '0 5 5 5',
                    items: [{
                        xtype: 'tfield',
                        name: 'datensatzerzeugerId',
                        fieldLabel: i18n.getMsg('daErzeugerId'),
                        margin: '0, 5, 5, 5',
                        width: '35%',
                        labelWidth: 120
                    
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
        this.down('tfield[name=datensatzerzeugerId]').clearWarningOrError();
        //TODO: is not a function
        //this.down('combobox[name=mstId]').clearWarningOrError();
    },

    setReadOnly: function(value) {
        this.down('netzbetreiber').readOnly = value;
        this.down('tfield[name=bezeichnung]').setReadOnly(value);
        this.down('tfield[name=datensatzerzeugerId]').setReadOnly(value);
        this.down('combobox[name=mstId]').setReadOnly(value);
    }
});
