Ext.define('Lada.view.proben.Edit', {
    extend: 'Ext.window.Window',
    alias: 'widget.probenedit',

    title: 'Maske für §3-Proben',
    width: 800,
    layout: 'fit',
    autoShow: true,

    initComponent: function() {
        this.items = [
            {
                //Define the form
                xtype: 'form',
                items: [
                    // Probenangaben
                    {
                        xtype: 'fieldset',
                        title: 'Probenangaben',
                        defaults: {
                                labelWidth: 150
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'x1',
                                fieldLabel: 'Messstelle'
                            },
                            {
                                xtype: 'textfield',
                                name: 'x2',
                                fieldLabel: 'Hauptprobennr.'
                            },
                            {
                                xtype: 'textfield',
                                name: 'x3',
                                fieldLabel: 'Probe-ID'
                            },
                            {
                                xtype: 'fieldset',
                                title: 'Erweiterte Probenangaben',
                                collapsible: true,
                                collapsed: true,
                                items: [
                                    {
                                        xtype: 'textfield',
                                        name: 'x4',
                                        fieldLabel: 'Datebasis'
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'x5',
                                        fieldLabel: 'RB/IB'
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'x6',
                                        fieldLabel: 'Testdatensatz'
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'x7',
                                        fieldLabel: 'Probenart'
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'x8',
                                        fieldLabel: 'Phase'
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'x9',
                                        fieldLabel: 'Szenario'
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'x10',
                                        fieldLabel: 'Probennehmer'
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'x11',
                                        fieldLabel: 'Datensatzerzeuger'
                                    }
                                ]
                            }
                        ]
                    },
                    // Medium
                    {
                        xtype: 'fieldset',
                        title: 'Medium',
                        defaults: {
                                labelWidth: 150
                        },
                        items: [
                                {
                                    xtype: 'textfield',
                                    name: 'x12',
                                    fieldLabel: 'Umweltbereich'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'x13',
                                    fieldLabel: 'Medienbezeichnung'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'x14',
                                    fieldLabel: 'Deskriptoren'
                                },
                                {
                                    xtype: 'fieldset',
                                    title: 'Details Deskriptoren',
                                    collapsible: true,
                                    collapsed: true,
                                    defaultType: 'textfield',
                                    items: this.buildDescriptors()
                                }
                        ]
                    },
                    // Zeit
                    {
                        xtype: 'fieldset',
                        title: 'Zeit',
                        defaultType: 'datefield',
                        defaults: {
                                labelWidth: 150
                        },
                        items: [
                            {
                                fieldLabel: 'Probennahme Beginn',
                                name: 'z1'
                            },
                            {
                                fieldLabel: 'Probennahme Ende',
                                name: 'z2'
                            },
                            {
                                fieldLabel: 'Sollzeit Von',
                                name: 'z3'
                            },
                            {
                                fieldLabel: 'Sollzeit Bis',
                                name: 'z4'
                            },
                            {
                                fieldLabel: 'Ursprungszeit',
                                name: 'z5'
                            }
                        ]
                    },
                    // Ortsangaben
                    {
                        xtype: 'fieldset',
                        title: 'Ortsangaben',
                        padding: '10 10',
                        items: [
                            {
                                xtype: 'grid',
                                dockedItems: [
                                    {
                                        xtype: 'toolbar',
                                        dock: 'top',
                                        items: [
                                            {
                                                text: 'Hinzufügen',
                                                icon: 'gfx/plus.gif'
                                            },
                                            {
                                                text: 'Löschen',
                                                icon: 'gfx/minus.gif'
                                            }
                                        ]
                                    }
                                ],
                                columns: [
                                    {
                                        text: 'Typ'
                                    },
                                    {
                                        text: 'Staat'
                                    },
                                    {
                                        text: 'Gem-ID'
                                    },
                                    {
                                        text: 'Gemeindebezeichnung',
                                        flex: 1
                                    },
                                    {
                                        text: 'Messpunkt',
                                        flex: 1
                                    }
                                ]
                            }
                        ]
                    },
                    // Probenzusatzwerte
                    {
                        xtype: 'fieldset',
                        title: 'Probenzusatzwerte',
                        collapsible: true,
                        collapsed: true,
                        padding: '10 10',
                        items: [
                            {
                                xtype: 'grid',
                                dockedItems: [
                                    {
                                        xtype: 'toolbar',
                                        dock: 'top',
                                        items: [
                                            {
                                                text: 'Hinzufügen',
                                                icon: 'gfx/plus.gif'
                                            },
                                            {
                                                text: 'Löschen',
                                                icon: 'gfx/minus.gif'
                                            }
                                        ]
                                    }
                                ],
                                columns: [
                                    {
                                        text: 'PZW-ID'
                                    },
                                    {
                                        text: 'PZW-Größe'
                                    },
                                    {
                                        text: '&lt; NWG'
                                    },
                                    {
                                        text: '&lt; PZW'
                                    },
                                    {
                                        text: 'rel. Unsich.[%]'
                                    },
                                    {
                                        text: 'Maßeinheit',
                                        flex: 1
                                    }
                                ]
                            }
                        ]
                    },
                    // Probenkommentar
                    {
                        xtype: 'fieldset',
                        title: 'Probenkommentare',
                        collapsible: true,
                        collapsed: true,
                        padding: '10 10',
                        items: [
                            {
                                xtype: 'grid',
                                dockedItems: [
                                    {
                                        xtype: 'toolbar',
                                        dock: 'top',
                                        items: [
                                            {
                                                text: 'Hinzufügen',
                                                icon: 'gfx/plus.gif'
                                            },
                                            {
                                                text: 'Löschen',
                                                icon: 'gfx/minus.gif'
                                            }
                                        ]
                                    }
                                ],
                                columns: [
                                    {
                                        text: 'Erzeuger'
                                    },
                                    {
                                        text: 'Datum'
                                    },
                                    {
                                        text: 'Text',
                                        flex: 1
                                    }
                                ]
                            }
                        ]
                    },
                    // Messungsangaben
                    {
                        xtype: 'fieldset',
                        title: 'Messungsangaben',
                        padding: '10 10',
                        items: [
                            {
                                xtype: 'grid',
                                dockedItems: [
                                    {
                                        xtype: 'toolbar',
                                        dock: 'top',
                                        items: [
                                            {
                                                text: 'Hinzufügen',
                                                icon: 'gfx/plus.gif'
                                            },
                                            {
                                                text: 'Löschen',
                                                icon: 'gfx/minus.gif'
                                            }
                                        ]
                                    }
                                ],
                                columns: [
                                    {
                                        text: 'Mess.ID',
                                        width: 50
                                    },
                                    {
                                        text: 'NPR-Nr.',
                                        width: 50
                                    },
                                    {
                                        text: 'MMT',
                                        width: 50
                                    },
                                    {
                                        text: 'Messzeit'
                                    },
                                    {
                                        text: 'Status'
                                    },
                                    {
                                        text: 'OK-Flag'
                                    },
                                    {
                                        text: 'Anzahl Nuklide'
                                    },
                                    {
                                        text: 'Anzahl Kommentare',
                                        flex: 1
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: 'Speichern',
                action: 'save'
            },
            {
                text: 'Verwerfen',
                scope: this,
                handler: this.close
            }
        ];
        this.callParent(arguments);
    },
    buildDescriptors: function() {
        var fields = new Array();
        for ($i=0; $i<12; $i++) {
            fields[$i] = {fieldLabel: 'S'+$i, name: 's'+$i};
        }
        return fields;
    }
});
