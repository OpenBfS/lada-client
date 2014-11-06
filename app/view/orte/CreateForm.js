/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to create and edit a Ort
 */
Ext.define('Lada.view.orte.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    requires: [
        'Lada.view.widgets.Ortdetail',
        'Lada.view.widgets.Staat',
        'Lada.view.widgets.Verwaltungseinheit',
        'Lada.view.orte.CreateOrt'
    ],

    model: 'Lada.model.Ort',
    edit: false,

    initComponent: function() {
        this.items = [{
            xtype: 'ortdetail',
            name: 'ortId',
            fieldLabel: 'Ort',
            listeners: {
                scope: this,
                'change': function(field, newv) {
                    if (field.up('window')) {
                        field.up('window').down('fieldset').show();
                    }
                    var orte = Ext.data.StoreManager.get('staOrte');
                    var ort = orte.getById(newv);
                    var fields = [
                        'beschreibung',
                        'bezeichnung',
                        'hoeheLand',
                        'latitude',
                        'longitude',
                        'staatId',
                        'gemId'
                    ];

                    // Load currently "selected" verwaltungseinheit.  This
                    // is needed as without having this record the field
                    // would only display the raw value (id) of the
                    // verwaltungseinheit.
                    var verw =
                        Ext.data.StoreManager.get('staVerwaltungseinheiten');
                    if (ort) {
                        verw.load({
                            id: ort.get('gemId')
                        });
                    }

                    var form = this.getForm();
                    var ffield = null;
                    if (ort) {
                        for (var i = fields.length - 1; i >= 0; i--) {
                            ffield = form.findField('ort_' + fields[i]);
                            ffield.setValue(ort.get(fields[i]));
                        }
                    }
                }
            }
        }, {
            xtype: 'textfield',
            name: 'ortsTyp',
            maxLength: 1,
            fieldLabel: 'Typ'
        }, {
            xtype: 'textareafield',
            name: 'ortszusatztext',
            maxLength: 100,
            fieldLabel: 'Ortszusatz'
        }, {
            xtype: 'button',
            name: 'newort',
            text: 'Neuen Ort Anlegen',
            hidden: this.edit,
            action: 'newort'
        }, {
            xtype: 'fieldset',
            title: 'Ortsangaben',
            hidden: !this.edit,
            defaults: {
                    labelWidth: 150
            },
            items: [{
                xtype: 'textfield',
                maxLength: 100,
                name: 'ort_beschreibung',
                fieldLabel: 'Beschreibung'
            }, {
                xtype: 'textfield',
                maxLength: 10,
                name: 'ort_bezeichnung',
                fieldLabel: 'Bezeichnung'
            }, {
                xtype: 'staat',
                name: 'ort_staatId',
                fieldLabel: 'Staat'
            }, {
                xtype: 'verwaltungseinheiten',
                name: 'ort_gemId',
                fieldLabel: 'Gemeinde'
            }, {
                xtype: 'numberfield',
                name: 'ort_latitude',
                fieldLabel: 'Lat'
            }, {
                xtype: 'numberfield',
                name: 'ort_longitude',
                fieldLabel: 'Lon'
            }, {
                xtype: 'numberfield',
                name: 'ort_hoeheLand',
                fieldLabel: 'Höhe'
            }]
        }];
        this.callParent(arguments);
    },

    updateOrtInfo: function(field, oldv, newv, opts) {
        console.log(field, oldv, newv, opts);
    }
});
