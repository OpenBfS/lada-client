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

    initComponent: function() {
        var me = this;
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
                    fieldLabel: 'Nebenprobennr.',
                    width: 300,
                    labelWidth: 100
                }, {
                    xtype: 'messmethode',
                    name: 'mmtId',
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Messmethode',
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
                    isFormField: false,
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

    retrieveStatus: function(messungsId, statusId) {
        var i18n = Lada.getApplication().bundle;
        var msg = i18n.getMsg('load.statuswert');
        var textfield = this.down('[name=status]');

        if(textfield) {
            textfield.setRawValue(msg);
        }

        var sStore = Ext.create('Lada.store.Status');
        sStore.load({
            params: {
                messungsId: messungsId
            },
            callback: function(records, operation, success) {
                var sw, ss;
                var i18n = Lada.getApplication().bundle;
                if (sStore.getTotalCount() === 0 || !statusId) {
                    sw = 0;
                }
                else {
                    sw = sStore.getById(statusId).get('statusWert');
                    ss = sStore.getById(statusId).get('statusStufe');
                }
                this.setStatusWert(sw);
                this.setStatusStufe(ss);
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
            console.log('loading sw store messungform');
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
                element = this.down('component[name=' + key + ']');
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
                element = this.down('component[name=' + key + ']');
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
        if (!this.getForm().getRecord().get('owner')) {
        //Only set this Field to Readonly when the User is NOT the Owner of the Record.
            this.down('chkbox[name=fertig]').setReadOnly(value);
        }
    }
});
