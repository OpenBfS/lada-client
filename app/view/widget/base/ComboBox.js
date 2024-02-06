/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This Widget extends a Panel to creat a custom Combobox
 */
Ext.define('Lada.view.widget.base.ComboBox', {
    extend: 'Lada.view.widget.base.LadaField',
    alias: 'widget.cbox',

    layout: 'hbox',
    border: false,
    margin: '0, 0, 5, 0',

    isFormField: true,
    submitValue: true,
    defaultInputWrapCls: null,

    initComponent: function() {
        if (this.editable === undefined) {
            this.editable = true;
        }
        if (this.allowBlank === undefined) {
            this.allowBlank = true;
        }
        var dkf = false;
        var ta = 'all';
        if (this.disableKeyFilter !== undefined) {
            dkf = this.disableKeyFilter;
            ta = this.disableKeyFilter ? 'all' : 'query';
        }

        this.callParent(arguments);
        this.insert(0, {
            xtype: this.multiSelect ? 'tagfield' : 'combobox',
            flex: 1,
            name: this.name,
            maxLength: this.maxLength,
            fieldLabel: this.fieldLabel,
            labelWidth: this.labelWidth,
            listeners: this.listenersJson,
            store: this.store,
            displayField: this.displayField,
            valueField: this.valueField,
            // additional field to search for in typing filters.
            // If not present, the combobox value may be used
            searchValueField: this.searchValueField || null,
            emptyText: this.emptyText,
            autoSelect: this.autoSelect || true,
            queryMode: this.queryMode,
            lastQuery: this.lastQuery || '',
            typeAhead: this.typeAhead,
            minChars: this.minChars,
            maxChars: this.maxChars,
            multiSelect: this.multiSelect,
            isFormField: this.isFormField,
            submitValue: this.submitValue,
            editable: this.editable,
            readOnly: this.readOnly,
            allowBlank: this.allowBlank,
            validator: this.validator,
            forceSelection: this.forceSelection || false,
            msgTarget: 'none',
            value: this.value,
            tpl: this.tpl,
            displayTpl: this.displayTpl,
            labelTpl: this.labelTpl,
            // disable filtering of entries if disableKeyFilter is true
            disableKeyFilter: dkf,
            triggerAction: ta,
            matchFieldWidth: this.matchFieldWidth || false,
            listConfig: this.listConfig || {maxWidth: 600}
        });

        /* listeners have been passed to combobox. Thus, clear them on panel
         * to avoid double effects of events fired on combobox and panel. */
        this.clearListeners();

        this.defaultInputWrapCls = this.down('combobox').inputWrapCls;
    },

    getValue: function() {
        return this.down('combobox').getValue();
    },

    setValue: function(value) {
        this.down('combobox').setValue(value);
    },

    clearValue: function() {
        this.down('combobox').clearValue();
    },

    resetOriginalValue: function() {
        this.down('combobox').resetOriginalValue();
    },

    getModelData: function() {
        // Since this is called from Ext.form.Basic.getFieldValues() and the
        // internal field is also part of the form under the same name,
        // prevent multiple field values under the same name:
        return null;
    },

    getSubmitData: function() {
        return this.down('combobox').getSubmitData();
    },

    validate: function() {
        return this.down('combobox').validate();
    },

    getName: function() {
        return this.name;
    },

    setReadOnly: function(value) {
        this.down('combobox').setReadOnly(value);
    },

    setStore: function(store) {
        this.store = store;
        this.down('combobox').setStore(store);
    }
});
