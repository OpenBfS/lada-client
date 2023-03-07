/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to edit a DatensatzErzeuger
 */
Ext.define('Lada.view.form.DatensatzErzeuger', {
    extend: 'Lada.view.form.LadaForm',
    alias: 'widget.datensatzerzeugerform',
    requires: [
        'Lada.controller.form.DatensatzErzeuger',
        'Lada.view.widget.Netzbetreiber',
        'Lada.model.DatensatzErzeuger'
    ],

    controller: 'datensatzerzeugerform',
    model: 'Lada.model.DatensatzErzeuger',
    margin: 0,
    border: false,

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
                items: [{
                    text: i18n.getMsg('copy'),
                    action: 'copy',
                    qtip: i18n.getMsg('copy.qtip', i18n.getMsg('ort')),
                    icon: 'resources/img/dialog-ok-apply.png',
                    disabled: !this.record.phantom &&
                        !this.record.get('readonly') ?
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
            }],
            items: [{
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
                margin: 5,
                defaults: {
                    labelWidth: 135,
                    margin: '0 0 5 0',
                    minWidth: 350
                },
                items: [{
                    xtype: 'netzbetreiber',
                    name: 'netzbetreiberId',
                    readOnly: true,
                    allowBlank: false,
                    filteredStore: true,
                    fieldLabel: i18n.getMsg('netzbetreiberId'),
                    value: this.record.get('netzbetreiberId')
                }, {
                    xtype: 'combobox',
                    displayField: 'messStelle',
                    readOnly: true,
                    valueField: 'id',
                    allowBlank: false,
                    queryMode: 'local',
                    name: 'mstId',
                    matchFieldWidth: false,
                    fieldLabel: i18n.getMsg('mst_id')
                }, {
                    xtype: 'tfield',
                    name: 'datensatzErzeugerId',
                    readOnly: true,
                    allowBlank: false,
                    fieldLabel: i18n.getMsg('daErzeugerId'),
                    maxLength: 2
                }, {
                    xtype: 'tarea',
                    name: 'bezeichnung',
                    allowBlank: false,
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
        this.mstTypStore = Ext.data.StoreManager.get('messstellen');
        this.mstTypStore.filter({
            property: 'mstTyp',
            value: 'M',
            exactMatch: true});
        this.down('combobox[name=mstId]').setStore(this.mstTypStore);
        if (
            (!this.record.phantom) ||
            (this.record.phantom && this.record.get('netzbetreiberId'))
        ) {
            var current = netzstore.getById(this.record.get('netzbetreiberId'));
            if (current) {
                this.down('netzbetreiber').setValue(current);
            }
        } else {
            this.down('netzbetreiber').setValue(Lada.netzbetreiber[0]);
        }
        this.isValid();
    },

    setRecord: function(datensatzerzeugerRecord) {
        this.clearMessages();
        this.getForm().loadRecord(datensatzerzeugerRecord);
    }
});
