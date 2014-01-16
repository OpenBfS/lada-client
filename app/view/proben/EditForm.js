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
    requires: [
        'Lada.view.widgets.Datenbasis',
        'Lada.view.widgets.Netzbetreiber',
        'Lada.view.widgets.Betriebsart',
        'Lada.view.widgets.Testdatensatz',
        'Lada.view.widgets.Probenart',
        'Lada.view.widgets.Uwb',
        'Lada.view.zusatzwerte.List',
        'Lada.view.kommentare.List',
        'Lada.view.orte.List',
        'Lada.view.messungen.List'
    ],
    model: 'Lada.model.Probe',
    alias: 'widget.probeneditform',

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
                                editable: false,
                                fieldLabel: 'Netzbetreiber',
                                allowBlank: false
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
            },
            // Ortsangaben
            {
                xtype: 'fieldset',
                title: 'Ortsangaben',
                padding: '10 10',
                items: [
                    {
                        xtype: 'ortelist',
                        probeId: this.modelId
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
                        xtype: 'zusatzwertelist',
                        probeId: this.modelId
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
                        xtype: 'kommentarelist',
                        probeId: this.modelId
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
                        xtype: 'messungenlist',
                        probeId: this.modelId
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
