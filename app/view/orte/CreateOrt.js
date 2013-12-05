/**
 *
 */
Ext.define('Lada.view.orte.CreateOrt', {
    extend: 'Ext.window.Window',
    alias: 'widget.createortdetail',
    title: 'Neuer Ort',

    /**
     * @private
     * Initialize the view.
     */
    initComponent: function() {
        var me = this;

        var form = Ext.create('Ext.form.Panel', {
            items: [{
                xtype: 'textfield',
                maxLength: 100,
                name: 'ort_beschreibung',
                fieldLabel: 'Beschreibung'
            },
            {
                xtype: 'staat',
                name: 'ort_staatId',
                fieldLabel: 'Staat'
            },
            {
                xtype: 'verwaltungseinheiten',
                name: 'ort_gemId',
                fieldLabel: 'Gemeinde',
                listeners: {
                    'select': {
                        scope: me,
                        fn: function(field, newValue, oldValue) {
                            var lon = field.up('window').down(
                                'numberfield[name=ort_longitude]');
                            var lat = field.up('window').down(
                                'numberfield[name=ort_latitude]');
                            lon.setValue(newValue[0].data.longitude);
                            lat.setValue(newValue[0].data.latitude);
                        }
                    }
                }
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
            }]
        });

        me.items = [form];
        this.buttons = [
            {
                text: 'Speichern',
                scope: form,
                action: 'save'
            },
            {
                text: 'Abbrechen',
                scope: this,
                handler: this.close
            }
        ];
        this.callParent(arguments);
    }
});

