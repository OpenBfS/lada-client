/*
 * Formular to create a Probe
 */
Ext.define('Lada.view.proben.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    requires: [
        'Lada.view.widgets.Datenbasis',
        'Lada.view.widgets.Netzbetreiber',
        'Lada.view.widgets.Betriebsart',
        'Lada.view.widgets.Testdatensatz',
        'Lada.view.widgets.Probenart',
        'Lada.view.widgets.Uwb'
    ],
    model: 'Lada.model.Probe',
    initComponent: function() {
       this.items = [
            {
                xtype: 'fieldset',
                title: 'Probenangaben',
                defaults: {
                        labelWidth: 150
                },
                items: [
                    {
                        xtype: 'mst',
                        name: 'mstId',
                        fieldLabel: 'Messstelle',
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        name: 'hauptprobenNr',
                        maxLength: 20,
                        fieldLabel: 'Hauptprobennr.'
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
                                fieldLabel: 'Testdatensatz',
                                allowBlank: false
                            },
                            {
                                xtype: 'probenart',
                                id: 'probenart',
                                editable: false,
                                name: 'probenartId',
                                fieldLabel: 'Probenart',
                                allowBlank: false
                            },
                            {
                                xtype: 'numberfield',
                                allowDecimals: false,
                                name: 'probeNehmerId',
                                fieldLabel: 'Probennehmer'
                            },
                            {
                                xtype: 'netzbetreiber',
                                name: 'netzbetreiberId',
                                fieldLabel: 'Netzbetreiber',
                                editable: false,
                                allowBlank: false
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
                            fieldLabel: 'Umweltbereich',
                            allowBlank: false
                        },
                        {
                            xtype: 'textfield',
                            maxLength: 100,
                            name: 'media',
                            fieldLabel: 'Medienbezeichnung'
                        },
                        {
                            xtype: 'textfield',
                            maxLength: 100,
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
                defaultType: 'datetime',
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
                    }
                ]
            }
        ];
        this.callParent();
    },
    buildDescriptors: function() {
        var fields = new Array();
        for ($i=0; $i<12; $i++) {
            fields[$i] = {fieldLabel: 'S'+$i, name: 's'+$i};
        }
        return fields;
    }
});
