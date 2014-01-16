/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Combobox for Staat
 */
Ext.define('Lada.view.widgets.Staat' ,{
        extend: 'Ext.form.ComboBox',
        alias: 'widget.staat',
        store: 'Staaten',
        displayField: 'staat',
        valueField: 'staatId',
        emptyText:'Wählen Sie einen Staat',
        // Enable filtering of comboboxes
        autoSelect: false,
        queryMode: 'local',
        triggerAction : 'all',
        typeAhead: true,
        minChars: 0,
    initComponent: function() {
        this.callParent(arguments);
    }
});
