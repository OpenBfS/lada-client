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
        'betriebsartId': 1,
        'betriebsart': 'Normal-/Routinebetrieb'
    }, {
        'betriebsartId': 2,
        'betriebsart': 'Störfall/Intensivbetrieb'
    }, {
        'betriebsartId': 3,
        'betriebsart': 'Übung zum Störfall'
    }, {
        'betriebsartId': 65,
        'betriebsart': 'Landesmessprogramm -A-'
    }, {
        'betriebsartId': 66,
        'betriebsart': 'Landesmessprogramm -B-'
    }, {
        'betriebsartId': 67,
        'betriebsart': 'Landesmessprogramm -C-'
    }, {
        'betriebsartId': 68,
        'betriebsart': 'Landesmessprogramm -D-'
    }, {
        'betriebsartId': 69,
        'betriebsart': 'Landesmessprogramm -E-'
    }, {
        'betriebsartId': 70,
        'betriebsart': 'Landesmessprogramm -F-'
    }, {
        'betriebsartId': 71,
        'betriebsart': 'Landesmessprogramm -G-'
    }, {
        'betriebsartId': 72,
        'betriebsart': 'Landesmessprogramm -H-'
    }, {
        'betriebsartId': 73,
        'betriebsart': 'Landesmessprogramm -I-'
    }, {
        'betriebsartId': 74,
        'betriebsart': 'Landesmessprogramm -J-'
    }, {
        'betriebsartId': 75,
        'betriebsart': 'Landesmessprogramm -K-'
    }, {
        'betriebsartId': 76,
        'betriebsart': 'Landesmessprogramm -L-'
    }, {
        'betriebsartId': 77,
        'betriebsart': 'Landesmessprogramm -M-'
    }, {
        'betriebsartId': 78,
        'betriebsart': 'Landesmessprogramm -N-'
    }, {
        'betriebsartId': 79,
        'betriebsart': 'Landesmessprogramm -O-'
    }, {
        'betriebsartId': 80,
        'betriebsart': 'Landesmessprogramm -P-'
    }, {
        'betriebsartId': 81,
        'betriebsart': 'Landesmessprogramm -Q-'
    }, {
        'betriebsartId': 82,
        'betriebsart': 'Landesmessprogramm -R-'
    }, {
        'betriebsartId': 83,
        'betriebsart': 'Landesmessprogramm -S-'
    }, {
        'betriebsartId': 84,
        'betriebsart': 'Landesmessprogramm -T-'
    }, {
        'betriebsartId': 85,
        'betriebsart': 'Landesmessprogramm -U-'
    }, {
        'betriebsartId': 86,
        'betriebsart': 'Landesmessprogramm -V-'
    }, {
        'betriebsartId': 87,
        'betriebsart': 'Landesmessprogramm -W-'
    }, {
        'betriebsartId': 88,
        'betriebsart': 'Landesmessprogramm -X-'
    }, {
        'betriebsartId': 89,
        'betriebsart': 'Landesmessprogramm -Y-'
    }, {
        'betriebsartId': 90,
        'betriebsart': 'Landesmessprogramm -Z-'
    }]
});

/**
 * Combobox for Betriebsart
 */
Ext.define('Lada.view.widget.Betriebsart', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.betriebsart',
    store: betriebsartStore,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    forceSelection: true,
    displayField: 'betriebsart',
    valueField: 'betriebsartId',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.betriebsart');

        this.store = Ext.data.StoreManager.get('betriebsartStore');
        this.store.clearFilter();
        this.callParent(arguments);
    }
});
