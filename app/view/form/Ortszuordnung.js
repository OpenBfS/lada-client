/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Form to edit the Ortszuordnung of a Probe
 */
Ext.define('Lada.view.form.Ortszuordnung', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ortszuordnungform',

    model: 'Lada.model.Ortszuordnung',
    width: '100%',
    margin: 5,
    border: 0,

    record: null,

    trackResetOnLoad: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            xtype: 'fieldset',
            title: i18n.getMsg('ortszuordnung.form.fset.title'),
            items: [{
                border: 0,
                margin: '0, 0, 10, 0',
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
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    flex: 1,
                    items: [{
                        xtype: 'tfield',
                        maxLength: 100,
                        name: 'ortszusatztext',
                        fieldLabel: i18n.getMsg('ortszuordnung.form.field.ortszusatztext'),
                        width: 280,
                        labelWidth: 80
                    }, {
                        xtype: 'tfield',
                        maxLength: 100,
                        name: 'ortszuordnungTyp',
                        fieldLabel: i18n.getMsg('ortszuordnung.form.field.ortszuordnungtyp'),
                        width: 280,
                        labelWidth: 80
                    }]
                }]
            }]
        }];
        this.callParent(arguments);
    },

    setRecord: function(record) {
        this.getForm().loadRecord(record);
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
        this.down('tfield[name=ortszusatztext]').clearWarningOrError();
        this.down('tfield[name=ortszuordnungTyp]').clearWarningOrError();
     },

    setReadOnly: function(value) {
        this.down('tfield[name=ortszusatztext]').setReadOnly(value);
        this.down('tfield[name=ortszuordnungTyp]').setReadOnly(value);
    }
});

