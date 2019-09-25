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
    extend: 'Ext.form.Panel',
    alias: 'widget.messungform',
    requires: [
        'Ext.layout.container.Table',
        'Lada.view.widget.Datenbasis',
        'Lada.view.widget.base.CheckBox',
        'Lada.view.widget.Messmethode',
        'Lada.view.widget.base.TextField',
        'Lada.view.widget.base.Datetime',
        'Lada.view.widget.Statuskombi'
    ],

    model: 'Lada.model.Messung',
    minWidth: 650,
    margin: 5,
    border: false,

    recordId: null,

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
                items: ['->', {
                    text: i18n.getMsg('audittrail'),
                    qtip: i18n.getMsg('qtip.audit'),
                    icon: 'resources/img/distribute-vertical-center.png',
                    action: 'audit',
                    disabled: this.recordId === null
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
                            name: 'externeMessungsId',
                            maxLength: 4,
                            fieldLabel: i18n.getMsg('extMessungsId'),
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
                            xtype: 'numberfield',
                            allowDecimals: false,
                            allowExponential: false,
                            enforceMaxLength: true,
                            maxLength: 10,
                            minValue: 0,
                            name: 'messdauer',
                            fieldLabel: i18n.getMsg('messdauer'),
                            width: 300,
                            labelWidth: 100
                        }, {
                            xtype: 'chkbox',
                            name: 'geplant',
                            readOnly: true,
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
                            name: 'nebenprobenNr',
                            maxLength: 4,
                            fieldLabel: i18n.getMsg('nebenprobenNr'),
                            width: 300,
                            labelWidth: 100
                        }, {
                            xtype: 'datetime',
                            name: 'messzeitpunkt',
                            fieldLabel: i18n.getMsg('messzeitpunkt'),
                            width: 300,
                            labelWidth: 100
                        }, {
                            xtype: 'chkbox',
                            name: 'fertig',
                            fieldLabel: i18n.getMsg('fertig'),
                            width: 300,
                            labelWidth: 100
                        }]
                    }]
                }, {
                    xtype: 'statuskombi',
                    name: 'statuskombi',
                    width: '100%',
                    padding: '0,5,0,5',
                    readOnly: true,
                    isFormField: false,
                    fieldLabel: 'Stufe/Status',
                    buttonListener: {
                        click: {
                            fn: function() {
                                if ((this.probedatenbasis === 'REI-E'
                                            || this.probedatenbasis === 'REI-I')
                                    && (this.probe.get('reiprogpunktgruppe') === null
                                            ||this.probe.get('reiprogpunktgruppe') === '')
                                    && (this.probe.get('ktagruppe') === null
                                            ||this.probe.get('ktagruppe') === '')) {
                                    Ext.Msg.alert(i18n.getMsg('err.msg.status.title'),
                                        i18n.getMsg('err.msg.status.consistency'));
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
        this.record = record;
        var me = this;
        var form = me.getForm();
        form.loadRecord(record);
        if (record.getId()) {
            me.down('statuskombi').setValue(
                    record.get('status'),false, record.get('statusEdit'));
        } else {
            //remove the Statuskombi field from the form
            me.down('statuskombi').hide();
        }
        //Get the connected Probe instance and Datenbasis
        Lada.model.Probe.load(this.record.get('probeId'), {
            success: function(proberecord) {
                me.probe = proberecord;
                var dbid = proberecord.get('datenbasisId');
                if (!dbid) {
                    return;
                }
                Lada.model.Datenbasis.load(dbid, {
                    success: function(dbrecord) {
                        me.probedatenbasis = dbrecord.get('datenbasis');
                    },
                    failure: function() {
                        //TODO: handle failure
                    }
                });
            },
            failure: function(proberecord) {
                //TODO: handle failure
            }
        });
    },


    updateStatusTextAndFertigFlag: function() {
        this.record.load({
            scope: this,
            success: function() {
                this.setRecord(this.record);
                var parentWin = this.up('window').parentWindow;
                if (parentWin) {
                    parentWin.initData();
                    var messunggrid = parentWin.down('messunggrid');
                    if (messunggrid) {
                        messunggrid.getStore().reload();
                    }
                    var ortszuordnunggrid = parentWin.down('ortszuordnunggrid');
                    if (ortszuordnunggrid) {
                        ortszuordnunggrid.getStore().reload();
                    }
                }
            }
        });
    },

    getCurrentStatus: function() {
        return this.currentStatus;
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
        this.down('tfield[name=nebenprobenNr]').clearWarningOrError();
        //this.down('messmethode[name=mmtId]').clearWarningOrError();
        this.down('datetime[name=messzeitpunkt]').clearWarningOrError();
        //this.down('numberfield[name=messdauer]').clearWarningOrError();
        this.down('chkbox[name=fertig]').clearWarningOrError();
        this.down('chkbox[name=geplant]').clearWarningOrError();
    },

    setReadOnly: function(value) {
        this.down('tfield[name=nebenprobenNr]').setReadOnly(value);
        this.down('messmethode[name=mmtId]').setReadOnly(value);
        this.down('datetime[name=messzeitpunkt]').setReadOnly(value);
        this.down('numberfield[name=messdauer]').setReadOnly(value);
        this.down('chkbox[name=fertig]').setReadOnly(value);
    }
});
