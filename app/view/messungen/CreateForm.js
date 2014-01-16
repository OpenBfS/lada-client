/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/*
 * Formular to create a Messung
 */
Ext.define('Lada.view.messungen.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.Messung',
    requires: [
        'Lada.view.widgets.Messmethode',
        'Lada.view.widgets.Testdatensatz'
    ],
    initComponent: function() {
        this.items = [
            {
                xtype: 'textfield',
                name: 'nebenprobenNr',
                maxLength: 10,
                fieldLabel: 'NPR'
            },
            {
                xtype: 'messmethode',
                name: 'mmtId',
                fieldLabel: 'MMT'
            },
            {
                xtype: 'datetime',
                name: 'messzeitpunkt',
                fieldLabel: 'Messzeitpunkt'
            },
            {
                xtype: 'numberfield',
                allowDecimals: false,
                minValue: 0,
                name: 'messdauer',
                fieldLabel: 'Messdauer'
            },
            {
                xtype: 'testdatensatz',
                name: 'fertig',
                fieldLabel: 'Fertig'
            },
            {
                xtype: 'testdatensatz',
                name: 'geplant',
                fieldLabel: 'Geplant'
            }
        ];
        this.callParent();
    }
});
