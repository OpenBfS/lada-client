/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Form used to display the data of an Ort record.
 */
Ext.define('Lada.view.form.OrtInfo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ortinfo',
    model: 'Lada.model.Ort',
    border: 0,
    flex: 1,
    margin: '0, 10, 0, 0',
    record: null,
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            layout: 'vbox',
            flex: 1,
            border: 0,
            defaults: {
                xtype: 'displayfield',
                labelWidth: 125,
                submitValue: false
            },
            items: [{
                fieldLabel: i18n.getMsg('orte.ortId'),
                name: 'ortId'
            },
            {
                fieldLabel: i18n.getMsg('orte.kurztext'),
                name: 'kurztext'
            }, {
                fieldLabel: i18n.getMsg('orte.langtext'),
                name: 'langtext'
            }, {
                xtype: 'ortinforow',
                label: i18n.getMsg('staat'),
                firstitem: 'staatISO',
                seconditem: 'staat'
            }, {
                xtype: 'ortinforow',
                label: i18n.getMsg('orte.verwaltungseinheit'),
                firstitem: 'gemId',
                seconditem: 'gemeinde'
            }, {
                xtype: 'ortinforow',
                label: i18n.getMsg('orte.kda'),
                firstitem:'kdaId',
                seconditem: 'koordinatenart'
            },{
                xtype: 'ortinforow',
                label: i18n.getMsg('orte.koords'),
                firstitem: 'koordXExtern',
                seconditem: 'koordYExtern'
            }]
        }];
        this.callParent(arguments);
    }
});

/**
 * A row with a label and two values, to be properly aligned in ortinfo form
 */
Ext.define('Lada.view.form.OrtInfoRow',{
    // TODO Migration needs to be 5 px to the left to align properly with parent grid
    extend: 'Ext.form.FieldSet',
    alias: 'widget.ortinforow',
    border: 0,
    flex: 2,
    layout: 'hbox',
    label: '',
    firstitem: '',
    secondtitem: '',
    defaults: {
        submitValue: false,
        xtype: 'displayfield'
    },
    initComponent: function(){
        this.items = [{
            xtype: 'label',
            html: this.label,
            width: 125
        },{
            name: this.firstitem,
            width: 100
        },{
            name: this.seconditem
        }];
        this.callParent();
    }
});

