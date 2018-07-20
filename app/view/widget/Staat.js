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
Ext.define('Lada.view.widget.Staat', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.staat',
    store: 'staatenwidget',
    displayField: 'staat',
    valueField: 'id',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    forceSelection: this.forceSelection || false,

    initComponent: function() {
        // This widget requires a separate store to not change the grid during typing
        this.store = Ext.data.StoreManager.get('staatenwidget');
        var i18n= Lada.getApplication().bundle;
        this.emptyText= i18n.getMsg('emptytext.staat');
        if (!this.store) {
            this.store = Ext.create('Lada.store.Staaten');
        }
        this.store.clearFilter();
        this.callParent(arguments);
    }
});
