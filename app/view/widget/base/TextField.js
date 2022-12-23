/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This Widget extends a Panel to create a Textfield
 */
Ext.define('Lada.view.widget.base.TextField', {
    extend: 'Lada.view.widget.base.LadaField',
    alias: 'widget.tfield',

    layout: 'hbox',

    border: false,
    margin: '0, 0, 5, 0',

    textFieldCls: '',
    triggers: null,

    warning: null,

    error: null,

    notification: null,

    initComponent: function() {
        this.callParent(arguments);
        this.insert(0, {
            xtype: 'textfield',
            flex: 1,
            cls: this.textFieldCls,
            name: this.name,
            msgTarget: 'none',
            maxLength: this.maxLength || 1000,
            enforceMaxLength: this.enforceMaxLength || true,
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            isFormField: this.isFormField === undefined
                ? true
                : this.isFormField,
            readOnly: this.readOnly || false,
            editable: this.editable === undefined ? true : this.editable,
            validator: this.validator,
            listeners: this.listeners,
            type: this.type,
            triggers: this.triggers || null,
            value: this.value || null
        });
        if (this.regex) {
            Ext.apply(this.down('textfield'), {regex: this.regex});
        }
        if (this.allowBlank === false) {
            Ext.apply(this.down('textfield'), {allowBlank: this.allowBlank});
        }
    },

    getValue: function() {
        return this.down('textfield').getValue();
    },

    setValue: function(value) {
        this.down('textfield').setValue(value);
    },

    setReadOnly: function(value) {
        this.down('textfield').setReadOnly(value);
    }
});
