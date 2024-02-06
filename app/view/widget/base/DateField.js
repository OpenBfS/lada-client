/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This Widget extends a Panel in order to create a custom Datefield
 */
Ext.define('Lada.view.widget.base.DateField', {
    extend: 'Lada.view.widget.base.LadaField',
    alias: 'widget.datef',

    requires: [
        'Ext.form.field.Date'
    ],

    layout: 'hbox',

    border: false,

    margin: '0, 0, 5, 0',

    initComponent: function() {
        this.callParent(arguments);
        this.insert(0, {
            xtype: 'datefield',
            flex: 1,
            name: this.name,
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            listeners: this.listeners,
            triggerAction: this.triggerAction,
            emptyText: this.emptyText,
            format: this.format,
            formatText: this.formatText,
            msgTarget: 'none',
            tpl: this.tpl,
            triggers: this.triggers || null
        });
    },

    getValue: function() {
        return this.down('datefield').getValue();
    },

    setValue: function(value) {
        if (value !== null) {
            this.down('datefield').setValue(new Date(value));
        } else {
            this.down('datefield').setValue(null);
        }
    },

    clearValue: function() {
        this.down('datefield').clearValue();
    },

    getName: function() {
        return this.name;
    },

    setReadOnly: function(value) {
        this.down('datefield').setReadOnly(value);
    }
});
