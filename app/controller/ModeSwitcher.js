/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for the ModeSwitcher
 * This controller handles all logic related to the ModeSwitch
 */
Ext.define('Lada.controller.ModeSwitcher', {
    extend: 'Ext.app.Controller',
    displayFields: null,

    requires: [
        'Lada.store.MessprogrammQueries',
        'Lada.store.ProbeQueries',
        'Lada.store.StammdatenQueries'
    ],

    /**
     * Initialize this Controller
     * It has 1 Listeners
     * A checked ModeSwitch-Combobox fired a 'change'-event
     */
    init: function() {
        this.control({
            'combobox[name=modeswitch]': {
                change: this.switchModes
            }
        });
        this.callParent(arguments);
    },

    /**
     * Function is called when the user selects a checkbox.
     * according to the checkboxes inputValue,
     * the function alters the store which was loaded by the
     * filterpanels combobox,
     */
    switchModes: function(field, newVal) {
        var cbox = field.up('modeswitcher').up().down('combobox[name=filter]');
        var filterValues = field.up('panel[name=main]').down('panel[name=filtervalues]');
        var filters = field.up('panel[name=main]').down('panel[name=filtervariables]');
        filterValues.removeAll();
        filters.hide();

        var filterController = this.getController('Lada.controller.Filter');
        filterController.mode = newVal;
        
        filterController.updateFilter(cbox);
    }
});
