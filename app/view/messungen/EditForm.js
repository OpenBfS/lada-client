/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to edit a Messung
 */
Ext.define('Lada.view.messungen.EditForm', {
    extend: 'Lada.view.widgets.LadaForm',

    requires: [
        'Lada.view.widgets.Messmethode',
        'Lada.view.widgets.Testdatensatz',
        'Lada.view.mkommentare.List',
        'Lada.view.status.List',
        'Lada.view.messwerte.List'
    ],

    model: 'Lada.model.Messung',
    minWidth: 650,

    initComponent: function() {
        this.items = [{
            xtype: 'fieldset',
            title: 'Allgemein',
            items: [{
                layout: {
                    type: 'table',
                    columns: 2
                },
                border: 0,
                items: [{
                    xtype: 'textfield',
                    name: 'nebenprobenNr',
                    maxLength: 10,
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Nebenprobennr.'
                }, {
                    xtype: 'messmethode',
                    name: 'mmtId',
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Messmethode'
                }, {
                    xtype: 'datetime',
                    name: 'messzeitpunkt',
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Messzeitpunkt'
                }, {
                    xtype: 'numberfield',
                    allowDecimals: false,
                    minValue: 0,
                    name: 'messdauer',
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Messdauer'
                }, {
                    xtype: 'testdatensatz',
                    name: 'fertig',
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Fertig'
                }, {
                    xtype: 'testdatensatz',
                    name: 'geplant',
                    margin: '0, 10, 5, 0',
                    fieldLabel: 'Geplant'
                }]
            }]
        }, {
            // Messwerte
            xtype: 'fieldset',
            title: 'Messwerte',
            collapsible: true,
            collapsed: false,
            padding: '10 10',
            items: [{
                xtype: 'messwertelist',
                parentId: this.model.get('messungsId'),
                probeId: this.model.get('probeId')
            }]
        }, {
            // Status
            xtype: 'fieldset',
            title: 'Messungsstatus',
            collapsible: true,
            collapsed: false,
            padding: '10 10',
            items: [{
                xtype: 'statuslist',
                parentId: this.model.get('messungsId'),
                probeId: this.model.get('probeId')
            }]
        }, {
            // Messungskommentare
            xtype: 'fieldset',
            title: 'Messungskommentare',
            collapsible: true,
            collapsed: false,
            padding: '10 10',
            items: [{
                xtype: 'mkommentarelist',
                parentId: this.model.get('messungsId'),
                probeId: this.model.get('probeId')
            }]
        }];
        this.callParent(arguments);
    }
});
