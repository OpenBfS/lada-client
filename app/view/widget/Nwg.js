/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

var nwgStore = Ext.create('Ext.data.Store', {
    fields: ['nwgId', 'nwg'],
    data: [{
        'nwgId': '',
        'nwg': '>='
    }, {
        'nwgId': '<',
        'nwg': '<'
    }]
});

/**
 * Combobox for Nachweisgrenze.
 */
Ext.define('Lada.view.widget.Nwg', {
    extend: 'Lada.view.widget.base.ComboBox',
    editable: false,
    alias: 'widget.nwg',
    store: nwgStore,
    queryMode: 'local',
    displayField: 'nwg',
    valueField: 'nwgId',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.nwg');
        this.callParent(arguments);
    }
});
