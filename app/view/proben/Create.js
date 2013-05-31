Ext.define('Lada.view.proben.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.probencreate',

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
        'Lada.view.widgets.Testdatensatz'
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
                                collapsed: false,
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

