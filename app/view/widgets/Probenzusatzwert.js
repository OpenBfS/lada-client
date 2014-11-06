/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Zusatzwert
 */
Ext.define('Lada.view.widgets.Probenzusatzwert', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.probenzusatzwert',
    store: 'StaProbenzusaetze',
    displayField: 'beschreibung',
    valueField: 'id',
    emptyText: 'Wählen Sie einen Zusatzwert',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('staProbenzusaetze');
        if (!this.store) {
            this.store = Ext.create('Lada.store.StaProbenzusaetze');
        }
        this.callParent(arguments);
    }
});
