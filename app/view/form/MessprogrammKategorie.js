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
    extend: 'Lada.view.form.LadaForm',
    alias: 'widget.mprkatform',
    requires: [
        'Lada.view.widget.Netzbetreiber',
        'Lada.model.MpgCateg'
    ],

    model: 'Lada.model.MpgCateg',
    border: false,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    record: null,

    trackResetOnLoad: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
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
            defaults: {
                margin: '5,5,5,5',
                labelWidth: 80,
                minWidth: 350
            },
            items: [{
                xtype: 'netzbetreiber',
                name: 'networkId',
                editable: true,
                readOnly: true,
                filteredStore: true,
                fieldLabel: i18n.getMsg('netzbetreiberId')
            }, {
                xtype: 'tfield',
                name: 'extId',
                fieldLabel: i18n.getMsg('code'),
                maxLength: 3,
                allowBlank: false
            }, {
                xtype: 'tarea',
                name: 'name',
                fieldLabel: i18n.getMsg('bezeichnung'),
                maxLength: 120
            }]
        }];
        this.callParent(arguments);
        this.clearMessages();
        this.loadRecord(this.record);
        this.setReadOnly(this.record.get('readonly'));
        var netzstore = this.down('netzbetreiber').store;
        if (!this.record.phantom) {
            var current = netzstore.getById(this.record.get('networkId'));
            if (current) {
                this.down('netzbetreiber').setValue(current);
                this.down('netzbetreiber').setReadOnly(true);
            }
        }
    }
});
