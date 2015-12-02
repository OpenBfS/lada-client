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

    requires: [
        'Lada.store.MessprogrammQueries',
        'Lada.store.ProbeQueries',
        'Lada.store.StammdatenQueries'
    ],

    /**
     * Initialize this Controller
     * It has 1 Listeners
     * A checked PPS-Radiofield fired a 'check'-event
     */
    init: function() {
        this.control({
            'radiofield[name=ppswitch]': {
                check: this.switchModes
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
    switchModes: function(field) {
        var cbox = field.up('probenplanungswitcher').up().down('combobox');
        filters = field.up('panel[name=main]').down('fieldset[name=filtervariables]');
        filters.removeAll();
        filters.hide();

        //Initialise variables which will define the querystore
        // and the store which has to be loaded into the grid.
        var querystorename = '';

        // In dependence of the checkboxes input value,
        // define the store of the filter.
        //    app/controller/Filter.js contains similar code.
        if (field.inputValue === 'messprogramme' && cbox) {
            querystorename = 'Lada.store.MessprogrammQueries';
        }
        else if (field.inputValue === 'proben' && cbox) {
            querystorename = 'Lada.store.ProbeQueries';
        }
        else if (field.inputValue === 'stammdaten' && cbox) {
            querystorename = 'Lada.store.StammdatenQueries';
        }

        if (querystorename) {
            var store = Ext.StoreManager.lookup(querystorename);

            if (!store) {
                store = Ext.create(querystorename, {
                    //Select first Item on Load
                    listeners: {
                        load: function(store){
                            var records = new Array();
                            records.push(store.getAt(0));

                            cbox.select(records[0]);
                            cbox.fireEvent('select', cbox, records);
                        }
                    }
                });
            }

            if (store) {
                if (!store.autoLoad) {
                    store.load();
                }
                //cbox.reset();
                cbox.bindStore(store);
            }
        }
    }
});
