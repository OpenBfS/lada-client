/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Betriebsart
 */
Ext.define('Lada.view.widget.Betriebsart', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.betriebsart',
    requires: ['Lada.store.OprMode'],

    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    forceSelection: true,
    displayField: 'name',
    valueField: 'id',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.betriebsart');

        this.store = Ext.data.StoreManager.get('oprModeStore');
        this.callParent(arguments);
    }
});
