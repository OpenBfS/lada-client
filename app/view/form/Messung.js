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
        'Lada.view.widget.base.TextField',
        'Lada.view.widget.base.Datetime',
        'Lada.view.widget.base.FieldSet',
        'Lada.model.Messung'
    ],

    model: 'Lada.model.Messung',
    minWidth: 650,
    margin: 5,
    border: 0,

    recordId: null,

    trackResetOnLoad: true,

    initComponent: function() {
        this.items = [{
            xtype: 'fieldset',
            title: 'Allgemein'
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
