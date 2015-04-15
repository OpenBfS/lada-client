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
Ext.define('Lada.view.form.Probe', {
    extend: 'Ext.form.Panel',
    alias: 'widget.probeform',
    requires: [
        'Lada.view.widget.Datenbasis',
        'Lada.view.widget.Messstelle',
        'Lada.view.widget.Netzbetreiber',
        'Lada.view.widget.Betriebsart',
        'Lada.view.widget.Testdatensatz',
        'Lada.view.widget.Probenart',
        'Lada.view.widget.Umwelt',
        'Lada.view.widget.base.TextField',
        'Lada.view.widget.base.Datetime',
        'Lada.view.widget.base.FieldSet',
        'Lada.view.widget.base.DateField',
        'Lada.model.Probe',
    ],

    model: 'Lada.model.Probe',
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
                    layout: 'hbox',
                    border: 0,
                    items: [{
                        border: 0,
                        width: '50%',
                        minWidth: 290,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        margin: '0, 10, 0, 0',
                        items: [{
                            xtype: 'messstelle',
                            name: 'mstId',
                            fieldLabel: 'Messstelle',
                            labelWidth: 135,
                            allowBlank: false
                        }, {
                            xtype: 'tfield',
                            name: 'hauptprobenNr',
                            maxLength: 20,
                            fieldLabel: 'Hauptprobennr.',
                            labelWidth: 135
                        }]
                    }, {
                        border: 0,
                        width: '50%',
                        minWidth: 300,
                        margin: '0, 1, 0, 0',
                        items: [{
                            xtype: 'fset',
                            title: 'Erweiterte Angaben',
                            name: 'erwAngaben',
                            collapsible: true,
                            collapsed: true,
                            items: [{
                                xtype: 'datenbasis',
                                editable: false,
                                name: 'datenbasisId',
                                fieldLabel: 'Datenbasis',
                                anchor: '100%',
                                labelWidth: 105
                            }, {
                                xtype: 'betriebsart',
                                name: 'baId',
                                fieldLabel: 'Betriebsart',
                                anchor: '100%',
                                labelWidth: 105
                            }, {
                                xtype: 'testdatensatz',
                                name: 'test',
                                fieldLabel: 'Testdatensatz',
                                anchor: '100%',
                                labelWidth: 105,
                                allowBlank: false
                            }, {
                                xtype: 'probenart',
                                editable: false,
                                name: 'probenartId',
                                fieldLabel: 'Probenart',
                                anchor: '100%',
                                labelWidth: 105,
                                allowBlank: false
                            }, {
                                xtype: 'numberfield',
                                allowDecimals: false,
                                name: 'probeNehmerId',
                                fieldLabel: 'Probennehmer',
                                anchor: '100%',
                                labelWidth: 105
                            }, {
                                xtype: 'netzbetreiber',
                                name: 'netzbetreiberId',
                                editable: false,
                                fieldLabel: 'Netzbetreiber',
                                anchor: '100%',
                                labelWidth: 105,
                                allowBlank: false
                            }, {
                                xtype: 'tfield',
                                name: 'x11',
                                fieldLabel: 'Datensatzerzeuger',
                                anchor: '100%',
                                labelWidth: 105
                            }]
                        }]
                    }]
                }, {
                    // Medium
                    xtype: 'fieldset',
                    title: 'Medium',
                    items: [{
                        border: 0,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        width: '100%',
                        items: [{
                            xtype: 'textfield',
                            name: 'media',
                            labelWidth: 125,
                            fieldLabel: 'Medienbezeichnung',
                            listeners: {
                                dirtychange: {
                                    fn: this.updateOnChange,
                                    scope: me
                                }
                            }
                        }, {
                            xtype: 'textfield',
                            maxLength: 38,
                            enforceMaxLength: true,
                            name: 'mediaDesk',
                            labelWidth: 125,
                            fieldLabel: 'Deskriptoren',
                            regex: new RegExp('(?:D: ){1}(?:[0-9]{2} ){11}[0-9]{2}'),
                            regexText: 'Die Deskriptoren haben das falsche Format.<br />'+
                            'Richtig wäre: D: 99 99 99 99 99 99 99 99 99 99 99 99',
                            listeners: {
                                dirtychange: {
                                    fn: this.updateOnChange,
                                    scope: me
                                }
                            }
                        }, {
                            xtype: 'umwelt',
                            name: 'umwId',
                            fieldLabel: 'Umweltbereich',
                            labelWidth: 125,
                            allowBlank: false,
                            listeners: {
                                dirtychange: {
                                    fn: this.updateOnChange,
                                    scope: me
                                }
                            }
                        }, {
                            xtype: 'fieldset',
                            title: 'Details Deskriptoren',
                            collapsible: true,
                            collapsed: true,
                            defaultType: 'textfield',
                            layout: {
                                type: 'table',
                                columns: 3
                            },
                            items: this.buildDescriptors(),
                            listeners: {
                                dirtychange: {
                                    fn: this.updateOnChange,
                                    scope: me
                                }
                            }
                        }]
                    }]
                }, {
                    // Zeit
                    xtype: 'fieldset',
                    title: 'Zeit',
                    layout: {
                        type: 'hbox',
                        pack: 'center',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'fset',
                        title: 'Probenentnahme',
                        name: 'entnahmePeriod',
                        anchor: '100%',
                        width: '50%',
                        margin: '0, 5, 5, 5',
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        items: [{
                            xtype: 'datetime',
                            fieldLabel: 'Beginn',
                            labelWidth: 90,
                            anchor: '100%',
                            name: 'probeentnahmeBeginn',
                            format: 'd.m.Y H:i',
                            period: 'start'
                        }, {
                            xtype: 'datetime',
                            fieldLabel: 'Ende',
                            labelWidth: 90,
                            anchor: '100%',
                            name: 'probeentnahmeEnde',
                            format: 'd.m.Y H:i',
                            period: 'end'
                        }]
                    }, {
                        xtype: 'fset',
                        title: 'Sollzeitraum',
                        name: 'sollzeitPeriod',
                        anchor: '100%',
                        width: '50%',
                        margin: '0, 5, 5, 5',
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        items: [{
                            xtype: 'datetime',
                            fieldLabel: 'Von',
                            labelWidth: 90,
                            anchor: '100%',
                            name: 'solldatumBeginn',
                            format: 'd.m.Y H:i',
                            period: 'start'
                        }, {
                            xtype: 'datetime',
                            fieldLabel: 'Bis',
                            labelWidth: 90,
                            anchor: '100%',
                            name: 'solldatumEnde',
                            format: 'd.m.Y H:i',
                            period: 'end'
                        }]
                    }]
                }]
            }]
        }];
        this.callParent(arguments);
    },

    setRecord: function(record) {
        this.clearMessages();
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
        this.down('cbox[name=mstId]').clearWarningOrError();
        this.down('tfield[name=hauptprobenNr]').clearWarningOrError();
        this.down('cbox[name=datenbasisId]').clearWarningOrError();
        this.down('cbox[name=baId]').clearWarningOrError();
        this.down('cbox[name=test]').clearWarningOrError();
        this.down('cbox[name=probenartId]').clearWarningOrError();
        this.down('cbox[name=netzbetreiberId]').clearWarningOrError();
        this.down('tfield[name=x11]').clearWarningOrError();
        this.down('cbox[name=umwId]').clearWarningOrError();
        this.down('datetime[name=probeentnahmeBeginn]').clearWarningOrError();
        this.down('datetime[name=probeentnahmeEnde]').clearWarningOrError();
        this.down('datetime[name=solldatumBeginn]').clearWarningOrError();
        this.down('datetime[name=solldatumEnde]').clearWarningOrError();
        //this.down('numberfield[name=probeNehmerId]').clearWarningOrError();
        this.down('fset[name=erwAngaben]').clearMessages();
        this.down('fset[name=entnahmePeriod]').clearMessages();
        this.down('fset[name=sollzeitPeriod]').clearMessages();
    },

    setReadOnly: function(value) {
        this.down('cbox[name=mstId]').setReadOnly(value);
        this.down('tfield[name=hauptprobenNr]').setReadOnly(value);
        this.down('cbox[name=datenbasisId]').setReadOnly(value);
        this.down('cbox[name=baId]').setReadOnly(value);
        this.down('cbox[name=test]').setReadOnly(value);
        this.down('cbox[name=probenartId]').setReadOnly(value);
        this.down('cbox[name=netzbetreiberId]').setReadOnly(value);
        this.down('tfield[name=x11]').setReadOnly(value);
        this.down('textfield[name=media]').setReadOnly(value);
        this.down('textfield[name=mediaDesk]').setReadOnly(value);
        this.down('cbox[name=umwId]').setReadOnly(value);
        this.down('datetime[name=probeentnahmeBeginn]').setReadOnly(value);
        this.down('datetime[name=probeentnahmeEnde]').setReadOnly(value);
        this.down('datetime[name=solldatumBeginn]').setReadOnly(value);
        this.down('datetime[name=solldatumEnde]').setReadOnly(value);
        this.down('numberfield[name=probeNehmerId]').setReadOnly(value);

        //Deskriptoren
        for (var i = 0; i < 12; i++) {
            this.down('field[name=s'+i+']').setReadOnly(value);
        }
    },

    buildDescriptors: function() {
        var fields = [];
        for (var i = 0; i < 12; i++) {
            fields[i] = {
                fieldLabel: 'S' + i,
                name: 's' + i,
                labelWidth: 25,
                margin: '0, 10, 5, 0'
            };
        }
        return fields;
    }
});
