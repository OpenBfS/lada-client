/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Statusstufe
 */
Ext.define('Lada.view.widget.StatusStufe', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.statusstufe',
    store: Ext.data.StoreManager.get('statusstufe'),
    displayField: 'stufe',
    valueField: 'id',
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.statusstufe');
        this.callParent(arguments);
    }
});
