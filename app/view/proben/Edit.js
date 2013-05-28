Ext.define('Lada.view.proben.Edit', {
    extend: 'Ext.window.Window',
    alias: 'widget.probenedit',

    title: 'Maske für §3-Proben',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    width: Ext.getBody().getViewSize().width - 30,
    height: Ext.getBody().getViewSize().height - 30,
    autoShow: true,
    autoScroll: true,
    modal: true,

    requires: [
        'Lada.view.widgets.Uwb',
        'Lada.view.widgets.Datenbasis',
        'Lada.view.widgets.Probenart',
        'Lada.view.widgets.Betriebsart',
        'Lada.view.widgets.Testdatensatz',
        'Lada.view.kommentare.List'
    ],

    initComponent: function() {
        this.items = [
            {
                //Define the form
                xtype: 'form',
                bodyPadding: '10 10',
                border: 0,
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
                                name: 'mstId',
                                fieldLabel: 'Messstelle'
                            },
                            {
                                xtype: 'textfield',
                                name: 'hauptprobenNr',
                                fieldLabel: 'Hauptprobennr.'
                            },
                            {
                                xtype: 'textfield',
                                name: 'probeId',
                                fieldLabel: 'Probe-ID'
                            },
                            {
                                xtype: 'fieldset',
                                title: 'Erweiterte Probenangaben',
                                collapsible: true,
                                collapsed: true,
                                items: [
                                    {
                                        xtype: 'datenbasis',
                                        id: 'datenbasis',
                                        editable: false,
                                        name: 'datenbasisId',
                                        fieldLabel: 'Datenbasis'
                                    },
                                    {
                                        xtype: 'betriebsart',
                                        name: 'baId',
                                        fieldLabel: 'Betriebsart'
                                    },
                                    {
                                        xtype: 'testdatensatz',
                                        name: 'test',
                                        fieldLabel: 'Testdatensatz'
                                    },
                                    {
                                        xtype: 'probenart',
                                        id: 'probenart',
                                        editable: false,
                                        name: 'probenartId',
                                        fieldLabel: 'Probenart'
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'probenartId',
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
                                    xtype: 'uwb',
                                    name: 'umwId',
                                    fieldLabel: 'Umweltbereich'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'media',
                                    fieldLabel: 'Medienbezeichnung'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'mediaDesk',
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
                                name: 'probeentnahmeBeginn'
                            },
                            {
                                fieldLabel: 'Probennahme Ende',
                                name: 'probeentnahmeEnde'
                            },
                            {
                                fieldLabel: 'Sollzeit Von',
                                name: 'solldatumBeginn'
                            },
                            {
                                fieldLabel: 'Sollzeit Bis',
                                name: 'solldatumEnde'
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
                                xtype: 'kommentarelist'
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
    },
    listeners: {
        afterrender: function() {
            // FIXME: This does not work! I do not know how to set the correct
            // value in the combobox based on the model value.
            // Will iterate over defined comboboxes and set the value
            var combos = ['probenart', 'datenbasis'];
            for (var i = combos.length - 1; i >= 0; i--){
                console.log('Searching for ' + combos[i]);
                var element = Ext.getCmp(combos[i]);
                // Statically set to 2. Must be the value from the model.
                element.setValue(2);
            }
        }
    }
});

