/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for SollIstUmwGrp
 */
Ext.define('Lada.view.widget.SollIstUmwGruppe', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.sollistumwgruppe',
    store: 'sollIstUmwGruppe',
    displayField: 'beschreibung',
    valueField: 'id',
    searchValueField: 'beschreibung',
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{id} - {beschreibung}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{beschreibung}</tpl>'),
    labelTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{id} - {beschreibung}</tpl>'),
    editable: this.editable || false,
    disableKeyFilter: true,
    forceSelection: true,
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    allowBlank: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.sollistumwgrp');
        this.store = Ext.create('Lada.store.SollIstUmwGruppe');
        this.callParent(arguments);
    }
});
