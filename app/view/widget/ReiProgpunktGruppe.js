/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Kta-Gruppe
 */
Ext.define('Lada.view.widget.ReiProgpunktGruppe', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.reiprogpunktgruppe',
    store: 'Lada.store.ReiProgpunktGruppe',
    displayField: 'beschreibung',
    valueField: 'id',
    editable: this.editable || false,
    disableKeyFilter: true,
    forceSelection: true,
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.rei_progpunkt_gruppe');

        this.store = Ext.create('Lada.store.ReiProgpunktGruppe');

        this.store.proxy.extraParams = {};
        this.callParent(arguments);
    }
});
