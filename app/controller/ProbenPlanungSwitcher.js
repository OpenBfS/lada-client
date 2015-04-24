/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for the ProbenPlanungSwitcher
 * This controller handles all logic related to the PPS
 */
Ext.define('Lada.controller.ProbenPlanungSwitcher', {
    extend: 'Ext.app.Controller',
    displayFields: null,

    /**
     * Initialize this Controller
     * It has 1 Listeners
     * A checked PPS-Radiofield fired a 'check'-event
     */
    init: function() {
        this.control({
            'radiofield[name=ppswitch]': {
                check: this.switchStores
            }
        });
        this.callParent(arguments);
    },

    /**
     * Function is called when the user selects a checkbox.
     * according to the checkboxes inputValue,
     * the function alters the store which was loaded by the
     * filterpanels combobox
     */
    switchStores: function(field) {
        var cbox = field.up('probenplanungswitcher').up().down('combobox');

        if (field.inputValue == "probenplanung" && cbox) {
            var sname = 'Lada.store.Queries'; // TODO change store!
        }
        else if (field.inputValue == "probenliste" && cbox) {
            var sname = 'Lada.store.Queries';
        }

        var store = Ext.StoreManager.lookup(sname);
        if (!store) {
            store = Ext.create(sname);
        }
        if (store) {
            store.load();
            cbox.bindStore(store);
        }
    }
});
