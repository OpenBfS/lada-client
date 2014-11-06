/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to create and edit a Messwert
 */
Ext.define('Lada.view.messwerte.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    requires: [
        'Lada.view.widgets.Messgroesse',
        'Lada.view.widgets.Messeinheit',
        'Lada.view.widgets.Nwg'
    ],

    model: 'Lada.model.Messwert',

    initComponent: function() {
        this.items = [{
            xtype: 'numberfield',
            name: 'messwert',
            fieldLabel: 'Messwert'
        }, {
            xtype: 'nwg',
            name: 'messwertNwg',
            fieldLabel: 'Messwert zu NWG'
        }, {
            xtype: 'numberfield',
            name: 'nwgZuMesswert',
            fieldLabel: 'Nachweisgrenze'
        }, {
            xtype: 'numberfield',
            name: 'messfehler',
            fieldLabel: 'Messfehler'
        }, {
            xtype: 'messgroesse',
            name: 'messgroesseId',
            fieldLabel: 'Messgroesse'
        }, {
            xtype: 'messeinheit',
            name: 'mehId',
            fieldLabel: 'Messeinheit'
        }];
        this.callParent(arguments);
    }
});
