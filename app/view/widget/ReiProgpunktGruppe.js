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
    requires: ['Lada.store.ReiProgpunktGruppe'],
    store: null,
    displayField: 'descr',
    valueField: 'id',
    searchValueField: 'name',
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{name:htmlEncode} - {descr:htmlEncode}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{name:htmlEncode}</tpl>'),
    labelTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{name:htmlEncode} - {descr:htmlEncode}</tpl>'),
    editable: this.editable || false,
    disableKeyFilter: true,
    forceSelection: true,
    // Enable filtering of comboboxes
    autoSelect: false,
    listConfig: {maxWidth: 850},
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    umweltWarning: null,
    allowBlank: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.emptyText = i18n.getMsg('emptytext.rei_progpunkt_gruppe');


        this.store = Ext.create('Lada.store.ReiProgpunktGruppe');

        this.store.proxy.extraParams = {};
        this.callParent(arguments);

        this.down('combobox').enableBubble('change');

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
        this.down('combobox').triggers.clear.scope = this;
        this.down('combobox').triggers.clear.handler = function() {
            var combo = me.down('combobox');
            var oldVal = combo.getValue();
            combo.clearValue();
            combo.fireEvent('change', combo, '', oldVal);
        };
    },

    /**
     * Handle show events
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
            this.showWarnings(
                i18n.getMsg('warn.msg.reiprogpunktgruppe.empty'));
            cons = false;
        }

        if (cons) {
            this.clearWarningOrError();
        }
        return cons;
    },

    setUmweltWarningVisible: function(state) {
        var i18n = Lada.getApplication().bundle;
        if (state) {
            this.showWarnings(
                i18n.getMsg('warn.msg.reiprogpunktgruppe.umwelt'));
        } else {
            this.clearWarningOrError();
        }
    }
});
