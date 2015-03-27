/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to edit a Probe
 */
Ext.define('Lada.view.form.Location', {
    extend: 'Ext.form.Panel',
    alias: 'widget.locationform',

    requires: [
        'Lada.view.widget.Verwaltungseinheit',
        'Lada.view.widget.Staat'
    ],

    model: 'Lada.model.Ort',
    minWidth: 300,
    margin: 5,
    border: 0,

    recordId: null,

    trackResetOnLoad: true,

    initComponent: function() {
        this.items = [{
            xtype: 'fieldset',
            title: 'Details',
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
                    maxLength: 100,
                    name: 'beschreibung',
                    fieldLabel: 'Beschreibung',
                    width: 280,
                    labelWidth: 80
                }, {
                    xtype: 'tfield',
                    maxLength: 10,
                    name: 'bezeichnung',
                    fieldLabel: 'Bezeichnung',
                    width: 280,
                    labelWidth: 80
                }, {
                    xtype: 'staat',
                    name: 'staatId',
                    fieldLabel: 'Staat',
                    width: 280,
                    labelWidth: 80
                }, {
                    xtype: 'verwaltungseinheit',
                    name: 'verwaltungseinheitId',
                    fieldLabel: 'Gemeinde',
                    editable: true,
                    width: 280,
                    labelWidth: 80
                }, {
                    xtype: 'numberfield',
                    name: 'latitude',
                    fieldLabel: 'Lat',
                    width: 280,
                    labelWidth: 80
                }, {
                    xtype: 'numberfield',
                    name: 'longitude',
                    fieldLabel: 'Lon',
                    width: 280,
                    labelWidth: 80
                }, {
                    xtype: 'numberfield',
                    name: 'hoeheLand',
                    fieldLabel: 'Höhe',
                    width: 280,
                    labelWidth: 80
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
        this.down('tfield[name=beschreibung]').clearWarningOrError();
        this.down('tfield[name=bezeichnung]').clearWarningOrError();
        this.down('staat[name=staatId]').clearWarningOrError();
        this.down('verwaltungseinheit[name=verwaltungseinheitId]').clearWarningOrError();
        //this.down('numberfield[name=longitude]').clearWarningOrError();
        //this.down('numberfield[name=latitude]').clearWarningOrError();
        //this.down('numberfield[name=hoeheLand]').clearWarningOrError();
     },

    setReadOnly: function(value) {
        this.down('tfield[name=beschreibung]').setReadOnly(value);
        this.down('tfield[name=bezeichnung]').setReadOnly(value);
        this.down('staat[name=staatId]').setReadOnly(value);
        this.down('verwaltungseinheit[name=verwaltungseinheitId]').setReadOnly(value);
        this.down('numberfield[name=longitude]').setReadOnly(value);
        this.down('numberfield[name=latitude]').setReadOnly(value);
        this.down('numberfield[name=hoeheLand]').setReadOnly(value);
    }
});
