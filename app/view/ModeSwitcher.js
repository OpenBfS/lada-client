/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a Widget for a ModeSwitcher
 */
Ext.define('Lada.view.ModeSwitcher', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.modeswitcher',

    mixins: {
        observable: 'Ext.util.Observable'
    },
    /**
     * Initialise the Widget.
     * Use a combobox to choose display mode
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('modus');
        var store = Ext.create('Ext.data.Store', {
            //Fields are internal value and display value
            fields: ['value', 'display'],
            data: [
                {'value': 'proben', 'display': i18n.getMsg('proben')},
                {'value': 'messungen', 'display': i18n.getMsg('messungen')},
                {'value': 'messprogramme', 'display': i18n.getMsg('messprogramme')},
                {'value': 'stammdaten', 'display': i18n.getMsg('stammdaten')},
                {'value': 'gen_query', 'display': i18n.getMsg('gen_query')}
            ]
        });

        var combo = Ext.create('Ext.form.field.ComboBox', {
            xtype: 'combobox',
            name: 'modeswitch',
            allowBlank: false,
            displayField: 'display',
            editable: false,
            queryMode: 'local',
            store: store,
            valueField: 'value',
            triggers: {
                clear: {
                    hidden: true
                }
            }
        });
        //Preselect entry
        combo.suspendEvents();
        combo.select('proben');
        combo.resumeEvents();
        this.items = [combo];
        this.callParent(arguments);
    }
});
