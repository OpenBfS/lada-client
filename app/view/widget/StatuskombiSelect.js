/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for StatusStufe/StatusWert- combination
 */
Ext.define('Lada.view.widget.StatuskombiSelect', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.statuskombiselect',
    store: Ext.data.StoreManager.get('statuskombi'),
    displayField: 'stufe',
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
        '{statusStufe} - {statusWert}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{statusStufe} - {statusWert}</tpl>'),
    valueField: 'id',
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    initComponent: function() {
        var i18n= Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.statuskombi');
        this.callParent(arguments);
    }
});
