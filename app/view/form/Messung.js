/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to edit a Messung
 */
Ext.define('Lada.view.form.Messung', {
    extend: 'Ext.form.Panel',
    alias: 'widget.messungform',
    requires: [
        'Lada.view.widget.Datenbasis',
        'Lada.view.widget.base.CheckBox',
        'Lada.view.widget.Messmethode',
        'Lada.view.widget.base.TextField',
        'Lada.view.widget.base.Datetime',
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
                    xtype: 'textfield',
                    name: 'nebenprobenNr',
                    maxLength: 10,
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Nebenprobennr.',
                    width: 300,
                    labelWidth: 100,
                }, {
                    xtype: 'messmethode',
                    name: 'mmtId',
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Messmethode',
                    width: 300,
                    labelWidth: 100,
                }, {
                    xtype: 'datetime',
                    name: 'messzeitpunkt',
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Messzeitpunkt',
                    width: 300,
                    labelWidth: 100,
                }, {
                    xtype: 'numberfield',
                    allowDecimals: false,
                    minValue: 0,
                    name: 'messdauer',
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Messdauer',
                    width: 300,
                    labelWidth: 100,
                }, {
                    xtype: 'chkbox',
                    name: 'fertig',
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Fertig',
                    width: 300,
                    labelWidth: 100,
                }, {
                    xtype: 'chkbox',
                    name: 'geplant',
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Geplant',
                    width: 300,
                    labelWidth: 100,
                }]
            }]
        }];
        this.callParent(arguments);
    },

    setRecord: function(record) {
        this.getForm().loadRecord(record);
    },

    setMessages: function() {
        // TODO this is a stub
    },

    clearMessages: function() {
        // TODO this is a stub
    },

    setReadonly: function() {
        // TODO this is a stub
    }
});
