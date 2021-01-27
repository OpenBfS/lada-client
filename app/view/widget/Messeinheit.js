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
Ext.define('Lada.view.widget.Messeinheit', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.messeinheit',
    store: null,
    displayField: 'einheit',
    valueField: 'id',

    // Enable filtering of comboboxes
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    listConfig: {minWidth: 110},

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.messeinheit');

        if (!this.store) {
            this.store = Ext.create('Lada.store.Messeinheiten');
            this.store.setProxy(Ext.clone(this.store.getProxy()));
            this.store.extraParams = {};
            this.store.load();
        }
        this.callParent(arguments);
    }
});
