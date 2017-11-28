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
    allowBlank: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.kta_gruppe');

        this.store = Ext.data.StoreManager.get('ktagruppe');
        if (!this.store) {
            this.store = Ext.create('Lada.store.KtaGruppe');
        }
        this.callParent(arguments);

        this.onAfter({
            show: {
                scope: this,
                fn: this.isConsistent
            }
        });
        this.down('combobox').onAfter({
            change: {
                scope: this,
                fn: this.isConsistent
            }
        });
    },


    /**
     * Checks if field visible and contains consistent Data
     */
    isConsistent: function() {
        var i18n = Lada.getApplication().bundle;
        var cons = true;
        if (!this.isVisible()) {
            this.clearWarningOrError();
            return true;
        }
        
        if (!this.allowBlank) {
            if (this.getValue() == null || this.getValue() == '') {
                this.showWarnings(i18n.getMsg('warn.msg.ktagruppe.empty'));
                cons = false;
            }
        }

        if (cons) {
            this.clearWarningOrError();
        }
        return cons;
    }

});
