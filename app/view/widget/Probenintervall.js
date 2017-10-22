/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */




/**
 * Combobox for Probenintervall
 */
Ext.define('Lada.view.widget.Probenintervall', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.probenintervall',
    requires: [
        'Lada.store.Probenintervall'
    ],
    store: 'Probenintervall',
    displayField: 'probenintervall',
    valueField: 'probenintervall',
    forceSelection: true,
    //editable: this.editable || false,
    // Enable filtering of comboboxes
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{probenintervall} - {piTexti18nId}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{probenintervall} -'+
         '{piTexti18nId}</tpl>'),

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.probenintervall');

        this.store = Ext.data.StoreManager.get('Probenintervall');

        if (!this.store) {
            this.store = Ext.create('Lada.store.Probenintervall');
        } else {
            this.store.clearFilter();
        }
        this.callParent(arguments);
    }
});
