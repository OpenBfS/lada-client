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
        'Lada.view.zusatzwerte.List',
        'Lada.view.kommentare.List',
        'Lada.view.orte.List',
        'Lada.view.messungen.List'
    ],

    model: 'Lada.model.Probe',

    initComponent: function() {
        this.items = [{
            xtype: 'fieldset',
            title: 'Allgemein',
            defaults: {
                labelWidth: 160
            },
            items: [{
                layout: 'hbox',
                border: 0,
                items: [{
                    border: 0,
                    width: '43%',
                    minWidth: 290,
                    items: [{
                        xtype: 'mst',
                        name: 'mstId',
                        fieldLabel: 'Messstelle',
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        name: 'hauptprobenNr',
                        maxLength: 20,
                        fieldLabel: 'Hauptprobennr.'
                    }]
                }, {
                    border: 0,
                    width: '52%',
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
                            fieldLabel: 'Datenbasis'
                        }, {
                            xtype: 'betriebsart',
                            name: 'baId',
                            fieldLabel: 'Betriebsart'
                        }, {
                            xtype: 'testdatensatz',
                            name: 'test',
                            fieldLabel: 'Testdatensatz',
                            allowBlank: false
                        }, {
                            xtype: 'probenart',
                            id: 'probenart',
                            editable: false,
                            name: 'probenartId',
                            fieldLabel: 'Probenart',
                            allowBlank: false
                        }, {
                            xtype: 'numberfield',
                            allowDecimals: false,
                            name: 'probeNehmerId',
                            fieldLabel: 'Probennehmer'
                        }, {
                            xtype: 'netzbetreiber',
                            name: 'netzbetreiberId',
                            editable: false,
                            fieldLabel: 'Netzbetreiber',
                            allowBlank: false
                        }, {
                            xtype: 'textfield',
                            name: 'x11',
                            fieldLabel: 'Datensatzerzeuger'
                        }]
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
                    labelWidth: 110,
                    fieldLabel: 'Medienbezeichnung'
                }, {
                    xtype: 'textfield',
                    maxLength: 100,
                    name: 'mediaDesk',
                    labelWidth: 110,
                    fieldLabel: 'Deskriptoren'
                }, {
                    xtype: 'uwb',
                    name: 'umwId',
                    fieldLabel: 'Umweltbereich',
                    labelWidth: 110,
                    allowBlank: false
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
                    items: this.buildDescriptors()
                }]
            }]
        }, {
            // Zeit
            xtype: 'fieldset',
            title: 'Zeit',
            defaultType: 'datetime',
            defaults: {
                    labelWidth: 150
            },
            layout: {
                type: 'table',
                columns: 2
            },
            items: [{
                fieldLabel: 'Probennahme Beginn',
                margin: '0, 10, 5, 0',
                labelWidth: 130,
                name: 'probeentnahmeBeginn'
            }, {
                fieldLabel: 'Sollzeit Von',
                margin: '0, 10, 5, 0',
                labelWidth: 100,
                name: 'solldatumBeginn'
            }, {
                fieldLabel: 'Probennahme Ende',
                margin: '0, 10, 5, 0',
                labelWidth: 130,
                name: 'probeentnahmeEnde'
            }, {
                fieldLabel: 'Sollzeit Bis',
                margin: '0, 10, 5, 0',
                labelWidth: 100,
                name: 'solldatumEnde'
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
