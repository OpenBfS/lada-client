/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Combobox for Messeinheit
 */
Ext.define('Lada.view.widgets.Messeinheit' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.messeinheit',
        store: 'Messeinheit',
        displayField: 'einheit',
        valueField: 'mehId',
        emptyText:'Wählen Sie eine Messeinheit',
        // Enable filtering of comboboxes
        autoSelect: false,
        queryMode: 'local',
        triggerAction : 'all',
        typeAhead: false,
        minChars: 0,
    initComponent: function() {
        this.callParent(arguments);
    }
});
