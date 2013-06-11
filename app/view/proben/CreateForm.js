Ext.define('Lada.view.proben.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
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
                        xtype: 'textfield',
                        name: 'mstId',
                        fieldLabel: 'Messstelle'
                    },
                    {
                        xtype: 'textfield',
                        name: 'hauptprobenNr',
                        fieldLabel: 'Hauptprobennr.'
                    },
                    //{
                    //    xtype: 'textfield',
                    //    name: 'probeId',
                    //    fieldLabel: 'Probe-ID'
                    //},
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
                                fieldLabel: 'Probenart',
                                allowBlank: false
                            },
                            {
                                xtype: 'textfield',
                                name: 'probeNehmerId',
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
        ];
        //this.buttons = [
        //    {
        //        text: 'Speichern',
        //        handler: this.commit,
        //        scope: this
        //    }
        //];
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
