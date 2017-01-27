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
            items: [{
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.ortId'),
                name: 'ortId'
            },
            {
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.kurztext'),
                name: 'kurztext'
            }, {
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.langtext'),
                name: 'langtext'
            }, {
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('staat'),
                name: 'staatISO'
            }, {
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.gemeinde'),
                name: 'gemeinde'
            }, {
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.gemeindename'),
                name: 'gemeinde'
            }, {
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.kda'),
                name: 'kdaId'
            }, {
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.koordx'),
                name: 'koordXExtern'
            }, {
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.koordy'),
                name: 'koordYExtern'
            }]
        }];
        this.callParent(arguments);
    }
});