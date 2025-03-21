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
        'Lada.model.DatasetCreator'
    ],

    model: 'Lada.model.DatasetCreator',
    controller: 'datensatzerzeugerform',
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
                    qtip: i18n.getMsg('copy.qtip', i18n.getMsg('city')),
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
                    name: 'networkId',
                    readOnly: true,
                    allowBlank: false,
                    filteredStore: true,
                    fieldLabel: i18n.getMsg('networkId'),
                    value: this.record.get('networkId')
                }, {
                    xtype: 'cbox',
                    displayField: 'name',
                    readOnly: true,
                    valueField: 'id',
                    allowBlank: false,
                    queryMode: 'local',
                    name: 'measFacilId',
                    matchFieldWidth: false,
                    fieldLabel: i18n.getMsg('meas_facil_id')
                }, {
                    xtype: 'tfield',
                    name: 'extId',
                    readOnly: true,
                    allowBlank: false,
                    fieldLabel: i18n.getMsg('datasetCreatorId'),
                    maxLength: 2
                }, {
                    xtype: 'tarea',
                    name: 'descr',
                    allowBlank: false,
                    readOnly: true,
                    fieldLabel: i18n.getMsg('descr'),
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
            property: 'measFacilType',
            value: 'M',
            exactMatch: true});
        this.down('combobox[name=measFacilId]').setStore(this.mstTypStore);
        if (
            (!this.record.phantom) ||
            (this.record.phantom && this.record.get('networkId'))
        ) {
            var current = netzstore.getById(this.record.get('networkId'));
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
