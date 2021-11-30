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
Ext.define('Lada.view.widget.Probenzusatzwert', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.probenzusatzwert',
    store: 'probenzusaetze',
    displayField: 'beschreibung',
    valueField: 'id',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('probenzusaetze');
        var i18n= Lada.getApplication().bundle;
        this.emptyText= i18n.getMsg('emptytext.pzw.widget');
        if (!this.store) {
            this.store = Ext.create('Lada.store.Probenzusaetze');
        }
        this.callParent(arguments);
    }
});
