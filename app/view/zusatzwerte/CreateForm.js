/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to create and edit a Probenzusatzwert
 */
Ext.define('Lada.view.zusatzwerte.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    requires: [
        'Lada.view.widgets.Probenzusatzwert',
        'Ext.layout.container.Column'
    ],

    model: 'Lada.model.Zusatzwert',

    initComponent: function() {
        this.items = [{
            xtype: 'probenzusatzwert',
            name: 'pzsId',
            fieldLabel: 'PZW-Größe',
            listeners: {
                scope: this,
                'change': function(field, newv, oldv, opts) {
                    console.log(field, oldv, newv, opts);
                    var ffield = this.getForm().findField('messeinheit');
                    var pzsId = newv;
                    if (!pzsId) {
                        pzsId = oldv;
                    }
                    ffield.setValue(this.model.getMesseinheit(pzsId));
                }
            }
        }, {
            layout: 'column',
            border: 0,
            items: [{
                xtype: 'numberfield',
                name: 'messwertPzs',
                fieldLabel: 'Messwert'
            }, {
                xtype: 'displayfield',
                name: 'messeinheit'
            }]
        }, {
            xtype: 'numberfield',
            name: 'messfehler',
            fieldLabel: 'rel. Unsich.[%]'
        }, {
            xtype: 'numberfield',
            name: 'nwgZuMesswert',
            fieldLabel: 'Nachweisgrenze'
        }];
        this.callParent(arguments);
    }
});
