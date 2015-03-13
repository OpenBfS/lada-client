/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */



/**
 * Combobox for Testdatensatz.
 * This widget is also used a generic "Ja/Nein" combobox.
 */
Ext.define('Lada.view.widget.Testdatensatz', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.testdatensatz',
    queryMode: 'local',
    displayField: 'testdatensatz',
    valueField: 'testdatensatzId',
    emptyText: 'Testdatensatz?',

    initComponent: function() {
        this.store = Ext.create('Ext.data.Store', {
            fields: ['testdatensatzId', 'testdatensatz'],
            data: [{
                'testdatensatzId': true,
                'testdatensatz': 'Ja'
            }, {
                'testdatensatzId': false,
                'testdatensatz': 'Nein'
            }]
        });
        this.callParent(arguments);
    }
});
