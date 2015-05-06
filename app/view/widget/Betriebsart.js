/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

var betriebsartStore = Ext.create('Ext.data.Store', {
    fields: ['betriebsartId', 'betriebsart'],
    storeId: 'betriebsartStore',
    data: [{
        'betriebsartId': '1',
        'betriebsart': 'Normal-/Routinebetrieb'
    }, {
        'betriebsartId': '2',
        'betriebsart': 'Störfall/Intensivbetrieb'
    }],
});

/**
 * Combobox for Betriebsart
 */
Ext.define('Lada.view.widget.Betriebsart', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.betriebsart',
    store: 'betriebsartStore',
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,

    displayField: 'betriebsart',
    valueField: 'betriebsartId',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.probenart');

        this.store = Ext.data.StoreManager.get('betriebsartStore')
        this.store.clearFilter();
        this.callParent(arguments);
    }
});
