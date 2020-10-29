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
    //editable: this.editable || false,
    disableKeyFilter: true,
    searchValueField: 'ktaGruppe',
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{ktaGruppe} - {beschreibung}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{ktaGruppe}</tpl>'),
    labelTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{ktaGruppe} - {beschreibung}</tpl>'),
    //forceSelection: true,
    forceSelection: this.forceSelection || false,
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'type',
    listConfig: {maxWidth: 500},
    typeAhead: false,
    minChars: 2,
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
                fn: this.handleShow
            }
        });
        this.down('combobox').onAfter({
            change: {
                scope: this,
                fn: this.handleChange
            }
        });
    },

    /**
     * Handles show events
     */
    handleShow: function() {
        this.isConsistent();
    },

    /**
     * Handle change events
     */
    handleChange: function() {
        this.isConsistent();
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

        if (this.getValue() === null || this.getValue() === '') {
            this.showWarnings(i18n.getMsg('warn.msg.ktagruppe.empty'));
            cons = false;
        }

        if (cons) {
            this.clearWarningOrError();
        }
        return cons;
    }

});
