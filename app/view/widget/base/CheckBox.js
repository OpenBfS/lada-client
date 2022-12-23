/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This Widget extends a Panel to create a custom Checkbox
 */
Ext.define('Lada.view.widget.base.CheckBox', {
    extend: 'Lada.view.widget.base.LadaField',
    alias: 'widget.chkbox',

    layout: 'hbox',

    border: false,

    margin: '0, 0, 5, 0',

    initComponent: function() {
        this.callParent(arguments);
        this.insert(0, {
            xtype: 'checkbox',
            uncheckedValue: false,
            flex: 1,
            name: this.name,
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            listeners: this.listeners,
            triggerAction: this.triggerAction,
            readOnly: this.readOnly,
            msgTarget: 'none',
            tpl: this.tpl
        });
    },

    getValue: function() {
        return this.down('checkbox').getValue();
    },

    setValue: function(value) {
        this.down('checkbox').setValue(value);
    },

    getName: function() {
        return this.name;
    },

    setReadOnly: function(value) {
        this.down('checkbox').setReadOnly(value);
    }
});
