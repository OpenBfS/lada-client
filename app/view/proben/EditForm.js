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
Ext.define('Lada.view.proben.EditForm', {
    extend: 'Lada.view.widgets.LadaForm',
    alias: 'widget.probeneditform',
    requires: [
        'Lada.view.widgets.Datenbasis',
        'Lada.view.widgets.Netzbetreiber',
        'Lada.view.widgets.Betriebsart',
        'Lada.view.widgets.Testdatensatz',
        'Lada.view.widgets.Probenart',
        'Lada.view.widgets.Uwb',
        'Lada.view.widgets.TextField',
        'Lada.view.zusatzwerte.List',
        'Lada.view.kommentare.List',
        'Lada.view.orte.List',
        'Lada.view.messungen.List'
    ],

    model: 'Lada.model.Probe',
    minWidth: 650,

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
                        icon: 'gfx/dialog-ok-apply.png',
                        action: 'save',
                        scope: me,
                        handler: this.commit
                    }, {
                        text: 'Verwerfen',
                        qtip: 'Änderungen verwerfen',
                        icon: 'gfx/dialog-cancel.png',
                        action: 'discard',
                        disabled: true,
                        scope: me,
                        handler: this.reset
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
                            xtype: 'mst',
                            name: 'mstId',
                            fieldLabel: 'Messstelle',
                            labelWidth: 135,
                            allowBlank: false,
                            listeners: {
                                dirtychange: {
                                    fn: this.updateOnChange,
                                    scope: me
                                }
                            }
                        }, {
                            xtype: 'tfield',
                            name: 'hauptprobenNr',
                            maxLength: 20,
                            fieldLabel: 'Hauptprobennr.',
                            labelWidth: 135,
                            listeners: {
                                dirtychange: {
                                    fn: this.updateOnChange,
                                    scope: me
                                }
                            }
                        }]
                    }, {
                        border: 0,
                        width: '50%',
                        minWidth: 300,
                        items: [{
                            xtype: 'fieldset',
                            title: 'Erweiterte Angaben',
                            collapsible: true,
                            collapsed: true,
                            items: [{
                                xtype: 'datenbasis',
                                id: 'datenbasis',
                                editable: false,
                                name: 'datenbasisId',
                                fieldLabel: 'Datenbasis',
                                listeners: {
                                    dirtychange: {
                                        fn: this.updateOnChange,
                                        scope: me
                                    }
                                }
                            }, {
                                xtype: 'betriebsart',
                                name: 'baId',
                                fieldLabel: 'Betriebsart',
                                listeners: {
                                    dirtychange: {
                                        fn: this.updateOnChange,
                                        scope: me
                                    }
                                }
                            }, {
                                xtype: 'testdatensatz',
                                name: 'test',
                                fieldLabel: 'Testdatensatz',
                                allowBlank: false,
                                listeners: {
                                    dirtychange: {
                                        fn: this.updateOnChange,
                                        scope: me
                                    }
                                }
                            }, {
                                xtype: 'probenart',
                                id: 'probenart',
                                editable: false,
                                name: 'probenartId',
                                fieldLabel: 'Probenart',
                                allowBlank: false,
                                listeners: {
                                    dirtychange: {
                                        fn: this.updateOnChange,
                                        scope: me
                                    }
                                }
                            }, {
                                xtype: 'numberfield',
                                allowDecimals: false,
                                name: 'probeNehmerId',
                                fieldLabel: 'Probennehmer',
                                listeners: {
                                    dirtychange: {
                                        fn: this.updateOnChange,
                                        scope: me
                                    }
                                }
                            }, {
                                xtype: 'netzbetreiber',
                                name: 'netzbetreiberId',
                                editable: false,
                                fieldLabel: 'Netzbetreiber',
                                allowBlank: false,
                                listeners: {
                                    dirtychange: {
                                        fn: this.updateOnChange,
                                        scope: me
                                    }
                                }
                            }, {
                                xtype: 'textfield',
                                name: 'x11',
                                fieldLabel: 'Datensatzerzeuger',
                                listeners: {
                                    dirtychange: {
                                        fn: this.updateOnChange,
                                        scope: me
                                    }
                                }
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
                        maxLength: 100,
                        name: 'mediaDesk',
                        labelWidth: 125,
                        fieldLabel: 'Deskriptoren',
                        listeners: {
                            dirtychange: {
                                fn: this.updateOnChange,
                                scope: me
                            }
                        }
                    }, {
                        xtype: 'uwb',
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
                    type: 'hbox'
                },
                items: [{
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    border: 0,
                    items: [{
                        xtype: 'datetime',
                        fieldLabel: 'Probennahme Beginn',
                        fieldMargin: '0, 10, 5, 0',
                        labelWidth: 125,
                        name: 'probeentnahmeBeginn',
                        listeners: {
                            dirtychange: {
                                fn: this.updateOnChange,
                                scope: me
                            }
                        }
                    }, {
                        xtype: 'datetime',
                        fieldLabel: 'Probennahme Ende',
                        fieldMargin: '0, 10, 5, 0',
                        labelWidth: 125,
                        name: 'probeentnahmeEnde',
                        listeners: {
                            dirtychange: {
                                fn: this.updateOnChange,
                                scope: me
                            }
                        }
                    }]
                }, {
                    layout: 'vbox',
                    border: 0,
                    items: [{
                        xtype: 'datetime',
                        fieldLabel: 'Sollzeit Von',
                        fieldMargin: '0, 10, 5, 0',
                        labelWidth: 90,
                        name: 'solldatumBeginn',
                        listeners: {
                            dirtychange: {
                                fn: this.updateOnChange,
                                scope: me
                            }
                        }
                    }, {
                        xtype: 'datetime',
                        fieldLabel: 'Sollzeit Bis',
                        fieldMargin: '0, 10, 5, 0',
                        labelWidth: 90,
                        name: 'solldatumEnde',
                        listeners: {
                            dirtychange: {
                                fn: this.updateOnChange,
                                scope: me
                            }
                        }
                    }]
                }]
            }]
                }]
        }, {
            // Ortsangaben
            xtype: 'fieldset',
            title: 'Ortsangaben',
            padding: '10 10',
            items: [{
                xtype: 'ortelist',
                probeId: this.modelId
            }]
        }, {
            // Probenzusatzwerte
            xtype: 'fieldset',
            title: 'Probenzusatzwerte',
            collapsible: true,
            collapsed: true,
            padding: '10 10',
            items: [{
                xtype: 'zusatzwertelist',
                probeId: this.modelId
            }]
        }, {
            // Probenkommentar
            xtype: 'fieldset',
            title: 'Probenkommentare',
            collapsible: true,
            collapsed: true,
            padding: '10 10',
            items: [{
                xtype: 'kommentarelist',
                probeId: this.modelId
            }]
        }, {
            // Messungsangaben
            xtype: 'fieldset',
            title: 'Messungsangaben',
            padding: '10 10',
            items: [{
                    xtype: 'messungenlist',
                    probeId: this.modelId
            }]
        }];
        this.callParent(arguments);
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
