/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This Widget extends a Panel to create a Textfield
 */
Ext.define('Lada.view.widget.base.TextArea', {
    extend: 'Lada.view.widget.base.LadaField',
    alias: 'widget.tarea',

    layout: 'hbox',

    border: false,
    margin: '0, 0, 5, 0',

    initComponent: function() {
        this.callParent(arguments);
        this.insert(0, {
            xtype: 'textarea',
            flex: 1,
            name: this.name,
            msgTarget: 'none',
            maxLength: this.maxLength || 1000,
            enforceMaxLength: this.enforceMaxLength || true,
            fieldLabel: this.fieldLabel,
            labelAlign: this.labelAlign,
            labelWidth: this.labelWidth,
            readOnly: this.readOnly || false,
            listeners: this.listeners,
            type: this.type
        });
        if (this.regex) {
            Ext.apply(this.down('textarea'), {regex: this.regex});
        }
        if (this.allowBlank === false) {
            Ext.apply(this.down('textarea'), {allowBlank: this.allowBlank});
        }
    },

    getValue: function() {
        return this.down('textarea').getValue();
    },

    setValue: function(value) {
        this.down('textarea').setValue(value);
    },

    setReadOnly: function(value) {
        this.down('textarea').setReadOnly(value);
    }
});
