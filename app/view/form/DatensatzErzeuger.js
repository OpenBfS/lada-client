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
    margin: 0,
    border: false,

    recordId: null,

    trackResetOnLoad: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            border: false,
            margin: 0,
            layout: 'fit',
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
                border: false,
                align: 'stretch',
                margin: 5,
                defaults: {
                    labelWidth: 120,
                    margin: '0 0 5 0',
                    minWidth: 350
                },
                items: [{
                    xtype: 'netzbetreiber',
                    name: 'netzbetreiberId',
                    readOnly: true,
                    allowBlank: false,
                    filteredStore: true,
                    fieldLabel: i18n.getMsg('netzbetreiberId')
                }, {
                    xtype: 'combobox',
                    store: Ext.data.StoreManager.get('messstellenFiltered'),
                    displayField: 'messStelle',
                    readOnly: true,
                    valueField: 'id',
                    allowBlank: false,
                    queryMode: 'local',
                    name: 'mstId',
                    fieldLabel: i18n.getMsg('mst_id')
                }, {
                    xtype: 'tfield',
                    name: 'datensatzErzeugerId',
                    readOnly: true,
                    fieldLabel: i18n.getMsg('daErzeugerId')
                }, {
                    xtype: 'tarea',
                    name: 'bezeichnung',
                    readOnly: true,
                    fieldLabel: i18n.getMsg('bezeichnung'),
                    maxLength: 120
                }]
            }]
        }];
        this.callParent(arguments);
        this.clearMessages();
        this.loadRecord(this.record);
        this.setReadOnly(this.record.get('readonly'));
        var netzstore = this.down('netzbetreiber').store;
        if (!this.record.phantom) {
            var current = netzstore.getById(this.record.get('netzbetreiberId'));
            if (current) {
                this.down('netzbetreiber').setValue(current);
                this.down('netzbetreiber').setReadOnly(true);
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
        this.down('tarea[name=bezeichnung]').clearWarningOrError();
        this.down('tfield[name=datensatzErzeugerId]').clearWarningOrError();
        //TODO: is not a function
        //this.down('combobox[name=mstId]').clearWarningOrError();
    },

    setReadOnly: function(value) {
        this.down('netzbetreiber').setReadOnly(value);
        this.down('tarea[name=bezeichnung]').setReadOnly(value);
        this.down('tfield[name=datensatzErzeugerId]').setReadOnly(value);
        this.down('combobox[name=mstId]').setReadOnly(value);
    }
});
