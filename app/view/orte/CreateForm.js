/*
 * Formular to create and edit a Ort
 */
Ext.define('Lada.view.orte.CreateForm', {
    extend: 'Lada.view.widgets.LadaForm',
    model: 'Lada.model.Ort',
    requires: [
        'Lada.view.widgets.Ortdetail',
        'Lada.view.widgets.Staat',
        'Lada.view.widgets.Verwaltungseinheit'
    ],
    initComponent: function() {
        this.items = [
            {
                xtype: 'ortdetail',
                name: 'ortId',
                fieldLabel: 'Ort',
                listeners: {
                    scope: this,
                    'change': function (field, newv, oldv, opts) {
                        console.log(field, oldv, newv, opts);
                        var orte = Ext.getStore('Ortedetails');
                        var ort = orte.getById(newv);
                        var fields = ['beschreibung', 'bezeichnung', 'hoeheLand',
                                      'latitude', 'longitude', 'staatId', 'gemId'];
                        var form = this.getForm();
                        if ( ort != undefined ) {
                            console.log('Found ort');
                            for (var i = fields.length - 1; i >= 0; i--){
                                ffield = form.findField("ort_"+fields[i]);
                                ffield.setValue(ort.get(fields[i]));
                            }
                        }
                    }
                }
            },
            {
                xtype: 'textfield',
                name: 'ortsTyp',
                maxLength: 1,
                fieldLabel: 'Typ'
            },
            {
                xtype: 'textareafield',
                name: 'ortszusatztext',
                maxLength: 100,
                fieldLabel: 'Ortszusatz'
            },
            {
                xtype: 'fieldset',
                title: 'Ortsangaben',
                defaults: {
                        labelWidth: 150
                },
                items: [
                    {
                        xtype: 'textfield',
                        maxLength: 100,
                        name: 'ort_beschreibung',
                        fieldLabel: 'Beschreibung'
                    },
                    {
                        xtype: 'textfield',
                        maxLength: 10,
                        name: 'ort_bezeichnung',
                        fieldLabel: 'Bezeichnung'
                    },
                    {
                        xtype: 'staat',
                        name: 'ort_staatId',
                        fieldLabel: 'Staat'
                    },
                    {
                        xtype: 'verwaltungseinheiten',
                        name: 'ort_gemId',
                        fieldLabel: 'Gemeinde'
                    },
                    {
                        xtype: 'numberfield',
                        name: 'ort_latitude',
                        fieldLabel: 'Lat'
                    },
                    {
                        xtype: 'numberfield',
                        name: 'ort_longitude',
                        fieldLabel: 'Lon'
                    },
                    {
                        xtype: 'numberfield',
                        name: 'ort_hoeheLand',
                        fieldLabel: 'Höhe'
                    }
                ]
            }
        ];
        this.callParent();
    },
    updateOrtInfo: function(field, oldv, newv, opts) {
        console.log(field, oldv, newv, opts);
    }
});
