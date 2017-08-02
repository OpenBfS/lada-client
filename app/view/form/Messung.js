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
        'Lada.view.widget.base.Datetime'
    ],

    model: 'Lada.model.Messung',
    minWidth: 650,
    margin: 5,
    border: 0,

    recordId: null,

    trackResetOnLoad: true,

    currentStatus: null,

    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            xtype: 'fieldset',
            title: 'Allgemein',
            items: [{
                border: 0,
                margin: '0, 0, 10, 0',
                layout: {
                    type: 'table',
                    columns: 2
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
                        text: i18n.getMsg('audittrail'),
                        qtip: i18n.getMsg('qtip.audit'),
                        icon: 'resources/img/distribute-vertical-center.png',
                        action: 'audit',
                        disabled: this.recordId === null
                    }, {
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
                    xtype: 'tfield',
                    name: 'nebenprobenNr',
                    maxLength: 10,
                    margin: '0, 10, 5, 0',
                    fieldLabel: i18n.getMsg('nebenprobenNr'),
                    width: 300,
                    labelWidth: 100
                }, {
                    xtype: 'messmethode',
                    name: 'mmtId',
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Messmethode',
                    allowBlank: false,
                    width: 300,
                    labelWidth: 100
                }, {
                    xtype: 'datetime',
                    name: 'messzeitpunkt',
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Messzeitpunkt',
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
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Messdauer',
                    width: 300,
                    labelWidth: 100
                }, {
                    xtype: 'chkbox',
                    name: 'fertig',
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Fertig',
                    width: 300,
                    labelWidth: 100
                }, {
                    xtype: 'chkbox',
                    name: 'geplant',
                    readOnly: true,
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Geplant',
                    width: 300,
                    labelWidth: 100
                }, {
                    xtype: 'textfield',
                    name: 'status',
                    readOnly: true,
                    isFormField: false,
                    maxLength: 10,
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Status',
                    width: 300,
                    labelWidth: 100,
                    submitValue: false,
                    preventMark: true, //Do not display error msg.
                    validateValue: function() {
                        return true; //this field is always valid
                    }
                }, {
                    xtype: 'textfield',
                    name: 'stufe',
                    readOnly: true,
                    isFormField: false,
                    maxLength: 10,
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Stufe',
                    width: 300,
                    labelWidth: 100,
                    submitValue: false,
                    isFormField: false,
                    preventMark: true, //Do not display error msg.
                    validateValue: function() {
                        return true; //this field is always valid
                    }
                }]
            }]
        }];
        this.callParent(arguments);
    },

    setRecord: function(record) {
        var form = this.getForm();
        form.loadRecord(record);
        if (record.getId()){
            this.retrieveStatus(record.getId(), record.get('status'));
        }
        else {
            //remove the StatusWert and StatusStufe field from the form
            var sw = this.down('[name=status]');
            var ss = this.down('[name=stufe]');
            ss.hide();
            sw.hide();
        }
    },

    getCurrentStatus: function() {
        return this.currentStatus;
    },

    retrieveStatus: function(messungsId, statusId) {
        var i18n = Lada.getApplication().bundle;
        var msg = i18n.getMsg('load.statuswert');
        var textfield = this.down('[name=status]');
        var messwin = this.up('window');

        if(textfield) {
            textfield.setRawValue(msg);
        }

        var me = this;
        var sStore = Ext.create('Lada.store.Status');
        sStore.load({
            params: {
                messungsId: messungsId
            },
            callback: function(records, operation, success) {
                var sw, ss, se;
                var i18n = Lada.getApplication().bundle;
                if (sStore.getTotalCount() === 0 || !statusId) {
                    sw = 0;
                }
                else {
                    me.currentStatus = sStore.getById(statusId);
                    sk = sStore.getById(statusId).get('statusKombi');
                    se = sStore.getById(statusId).get('mstId');
                    var kombis = Ext.data.StoreManager.get('statuskombi');
                    var rec = kombis.getById(sk);
                    sw = rec.data.statusWert.id;
                    ss = rec.data.statusStufe.id;
                }
                this.setStatusWert(sw);
                this.setStatusStufe(ss);

                // Enable / Disable the statusreset button of the statusgrid of the messungwindow
                if (messwin.record.get('statusEdit') === true &&
                        sw != 0 &&
                        sw != 4 &&
                        Ext.Array.contains(Lada.mst, se)) {

                    messwin.enableStatusReset();
                }
                else {
                    messwin.disableStatusReset();
                }

            },
            scope: this
        });
    },

    /**
     * Updates the Messungform and fills the Statuswert
     */
    setStatusWert: function(value){
        var swStore = Ext.data.StoreManager.get('statuswerte');
        var i18n = Lada.getApplication().bundle;
        var msg = i18n.getMsg('load.statuswert.error');
        var textfield = this.down('[name=status]');

        if (!swStore) {
            //Set the textfield asynchronously
            swStore = Ext.create('Lada.store.StatusWerte');
            swStore.load({
                scope: this,
                callback: function(records, operation, success) {
                    if (success) {
                        var item = swStore.getById(value);
                        if (item) {
                            msg = item.get('wert');
                        }
                    }
                    if (textfield) {
                        textfield.setRawValue(msg);
                    }
                }
            });
        }
        else {
            //Set the textfield
            var item = swStore.getById(value);
            if (item) {
                msg = item.get('wert');
            }
            if (textfield) {
                textfield.setRawValue(msg);
            }
        }

    },

    /**
     * Updates the Messungform and fills the StatusStufe
     */
    setStatusStufe: function(value){
        var ssStore = Ext.data.StoreManager.get('statusstufe')
        var i18n = Lada.getApplication().bundle;
        var msg = i18n.getMsg('load.statusstufe.error');
        var textfield = this.down('[name=stufe]');
        if (!ssStore) {
            //set the value asynchronously
            Ext.create('Lada.store.StatusStufe');
            ssStore.load({
                scope: this,
                callback: function(records, operation, success) {
                    if (success) {
                        var item = ssStore.getById(value);
                        if (item) {
                            msg = item.get('stufe');
                        }
                    }
                    if (textfield) {
                        textfield.setRawValue(msg);
                    }
                }
            });
        }
        else {
            //Set the value.
            var item = ssStore.getById(value);
            if (item) {
                msg = item.get('stufe');
            }
            if (textfield) {
                textfield.setRawValue(msg);
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
