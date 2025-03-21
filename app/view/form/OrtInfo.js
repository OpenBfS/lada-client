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

    requires: [
        'Lada.view.widget.base.SelectableDisplayField'
    ],

    border: false,
    flex: 1,
    margin: '0, 10, 0, 0',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            layout: 'vbox',
            flex: 1,
            border: false,
            defaults: {
                xtype: 'selectabledisplayfield',
                labelWidth: 115,
                submitValue: false
            },
            items: [{
                fieldLabel: i18n.getMsg('orte.ortId'),
                name: 'extId'
            }, {
                fieldLabel: i18n.getMsg('orte.kurztext'),
                name: 'shortText'
            }, {
                fieldLabel: i18n.getMsg('orte.langtext'),
                xtype: 'displayfield',
                labelWidth: 120,
                name: 'longText',
                maxWidth: 300,
                cls: 'text-wrapper'
            }, {
                xtype: 'ortinforow',
                label: i18n.getMsg('ctry'),
                firstitem: 'staatISO',
                seconditem: 'staat'
            }, {
                xtype: 'ortinforow',
                label: i18n.getMsg('orte.verwaltungseinheit'),
                firstitem: 'adminUnitId',
                seconditem: 'gemeinde'
            }]
        }];
        this.callParent(arguments);
    }
});

/**
 * A row with a label and two values, to be properly aligned in ortinfo form
 */
Ext.define('Lada.view.form.OrtInfoRow', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.ortinforow',
    padding: 0,
    border: false,
    flex: 1,
    layout: 'hbox',
    label: '',
    firstitem: '',
    secondtitem: '',
    defaults: {
        xtype: 'displayfield',
        inputWrapCls: '',
        triggerWrapCls: ''
    },
    initComponent: function() {
        this.items = [{
            xtype: 'label',
            html: this.label + ':',
            width: 125,
            padding: '2, 0, 2, 0'
        }, {
            name: this.firstitem,
            width: 80
        }, {
            name: this.seconditem,
            width: 115,
            maxWidth: 115
        }];
        this.callParent();
    }
});

