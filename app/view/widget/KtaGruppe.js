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
Ext.define('Lada.view.widget.KtaGruppe', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.ktagruppe',
    store: 'Lada.store.KtaGruppe',
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
        this.emptyText = i18n.getMsg('emptytext.kta_gruppe');

        this.store = Ext.data.StoreManager.get('ktagruppe');
        if (!this.store) {
            this.store = Ext.create('Lada.store.KtaGruppe');
        }
        this.callParent(arguments);
        //TODO: warning texts
        if (!this.isConsistent()) {
            this.showWarnings('kta warn');
        } else {
            this.clearWarningOrError();
        }
        this.on({
            show: {
                scope: this,
                fn: function() {
                    if (this.isConsistent()) {
                        this.clearWarningOrError();
                    } else {
                        //TODO: Warning texts
                        this.showWarnings('kta warn');
                    }
                }
            }
        });
    },


    /**
     * Checks if field visible and not null
     */
    isConsistent: function() {
        console.log((this.getValue() != null || this.getValue() != ''));

        if (!this.visible) {
            return true;
        }
        return this.getValue() != null || this.getValue() != '';
    }

});
