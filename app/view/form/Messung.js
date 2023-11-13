/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Form to edit a Messung
 */
Ext.define('Lada.view.form.Messung', {
    extend: 'Lada.view.form.LadaForm',
    alias: 'widget.messungform',
    requires: [
        'Ext.layout.container.Table',
        'Lada.controller.form.Messung',
        'Lada.view.widget.Datenbasis',
        'Lada.view.widget.base.CheckBox',
        'Lada.view.widget.Messmethode',
        'Lada.view.widget.base.TextField',
        'Lada.view.widget.base.Datetime',
        'Lada.view.widget.base.DisplayCheckbox',
        'Lada.view.widget.base.NumberField',
        'Lada.view.widget.base.SelectableDisplayField',
        'Lada.view.widget.Statuskombi'
    ],

    model: 'Lada.model.Measm',
    controller: 'messungform',
    minWidth: 650,
    margin: 5,
    border: false,

    record: null,
    //The probe model instance connected to this messung
    probe: null,
    //The probes datenbasis connected to this messung
    probedatenbasis: null,

    trackResetOnLoad: true,

    currentStatus: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            layout: 'fit',
            border: false,
            margin: '0, 0, 10, 0',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                border: false,
                items: [ '->', {
                    text: i18n.getMsg('audittrail'),
                    qtip: i18n.getMsg('qtip.audit'),
                    icon: 'resources/img/distribute-vertical-center.png',
                    action: 'audit',
                    disabled: true
                }, {
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
                xtype: 'fieldset',
                title: i18n.getMsg('title.general'),
                margin: '0, 0, 0, 0',
                layout: {
                    type: 'vbox',
                    border: false,
                    align: 'stretch'
                },
                items: [{
                    layout: 'hbox',
                    border: false,
                    align: 'stretchmax',
                    defaults: {
                        border: false,
                        width: '50%',
                        layout: 'vbox'
                    },
                    items: [{
                        defaults: {
                            margin: '0 5 5 0'
                        },
                        items: [{
                            xtype: 'selectabledisplayfield',
                            name: 'extId',
                            maxLength: 4,
                            fieldLabel: i18n.getMsg('measm.ext_id'),
                            width: 300,
                            labelWidth: 100
                        }, {
                            xtype: 'messmethode',
                            name: 'mmtId',
                            fieldLabel: i18n.getMsg('mmt_id'),
                            allowBlank: false,
                            width: 300,
                            labelWidth: 100
                        }, {
                            xtype: 'numfield',
                            allowDecimals: false,
                            allowExponential: false,
                            enforceMaxLength: true,
                            maxLength: 10,
                            minValue: 0,
                            name: 'measPd',
                            fieldLabel: i18n.getMsg('measPd'),
                            width: 300,
                            labelWidth: 100
                        }, {
                            xtype: 'displaycheckbox',
                            name: 'isScheduled',
                            fieldLabel: i18n.getMsg('geplant'),
                            width: 300,
                            labelWidth: 100
                        }]
                    }, {
                        defaults: {
                            margin: '0 0 5 10'
                        },
                        items: [{
                            xtype: 'tfield',
                            name: 'minSampleId',
                            maxLength: 4,
                            fieldLabel: i18n.getMsg('minSampleId'),
                            width: 300,
                            labelWidth: 100
                        }, {
                            xtype: 'datetime',
                            name: 'measmStartDate',
                            fieldLabel: i18n.getMsg('measm_start_date'),
                            width: 300,
                            format: 'd.m.Y H:i',
                            labelWidth: 100
                        }, {
                            xtype: 'chkbox',
                            name: 'isCompleted',
                            fieldLabel: i18n.getMsg('isCompleted'),
                            width: 300,
                            labelWidth: 100
                        }]
                    }]
                }, {
                    xtype: 'statuskombi',
                    name: 'statuskombi',
                    width: '100%',
                    padding: '0,5,0,5',
                    isFormField: false,
                    fieldLabel: i18n.getMsg('header.statuskombi'),
                    buttonListener: {
                        click: {
                            fn: function() {
                                if ((this.probedatenbasis === 'REI-E' ||
                                        this.probedatenbasis === 'REI-I') &&
                                    (this.probe.get(
                                        'reiAgGrId') === null ||
                                        this.probe.get(
                                            'reiAgGrId') === '') &&
                                    (this.probe.get('nuclFacilGrId') === null ||
                                        this.probe.get('nuclFacilGrId') === '')
                                ) {
                                    Ext.Msg.alert(
                                        i18n.getMsg('err.msg.status.title'),
                                        i18n.getMsg(
                                            'err.msg.status.consistency')
                                    );
                                    return false;
                                }
                            },
                            scope: this,
                            options: {
                                priority: 999
                            }
                        }
                    }
                }]
            }]
        }];
        this.callParent(arguments);
    },

    setRecord: function(record) {
        this.clearMessages();
        this.record = record;
        var me = this;
        var form = me.getForm();
        form.loadRecord(record);
        if (record.getId()) {
            me.down('statuskombi').setValue(
                record.get('status'), false, record.get('statusEdit'));
        }

        this.down('button[action=audit]').setDisabled(record.phantom);

        //Get the connected Probe instance and Datenbasis
        Lada.model.Sample.load(this.record.get('sampleId'), {
            success: function(proberecord) {
                me.probe = proberecord;
                var dbid = proberecord.get('regulationId');
                if (!dbid) {
                    return;
                }
                Lada.model.Regulation.load(dbid, {
                    success: function(dbrecord) {
                        me.probedatenbasis = dbrecord.get('name');
                    },
                    failure: function() {
                        //TODO: handle failure
                    }
                });
            },
            failure: function() {
                //TODO: handle failure
            }
        });
    },

    getCurrentStatus: function() {
        return this.currentStatus;
    }
});
