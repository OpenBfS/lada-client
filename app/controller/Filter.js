/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for the Filter
 * This controller handles all logic related to the filter
 */
Ext.define('Lada.controller.Filter', {
    extend: 'Ext.app.Controller',

    requires: [
        'Lada.view.widget.Messstelle',
        'Lada.view.widget.Umwelt'
    ],

    stores: [
        'ProbenList'    // List of found Proben
    ],

    displayFields: null,

    /**
     * Initialize this Controller
     * It has 4 Listeners
     */
    init: function() {
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            'combobox[name=filter]': {
                // Map Select event
                select: this.selectSql,
            },
            'button[action=search]': {
                // Map click event on Button.
                click: this.search
            },
            'button[action=reset]': {
                // Map click event on Button.
                click: this.reset
            },
            'menuitem[action=about]': {
                // Map click event on Button.
                click: this.about
            }
        });
        this.callParent(arguments);
    },

    /**
     * Function called when the user selects a SQL query in the dropdownlist.
     * The function will hide/display additional element related to the
     * selected search query
     */
    selectSql: function(element, record) {
        var filters = element.up('panel[name=main]').down('fieldset[name=filtervariables]');
        var columns = element.up('fieldset').down('displayfield[name=columns]');
        var desc = element.up('fieldset').down('displayfield[name=description]');
        this.displayFields = record[0].data.results;
        var filterFields = record[0].data.filters;

        this.reset(element);

        var columnString = [];
        for (var i = 0; i < this.displayFields.length; i++) {
            columnString.push(this.displayFields[i].header);
        }
        columns.setValue(columnString.join(', '));
        desc.setValue(record[0].data.description);

        // Setup Columns of the probenlist
        this.displayFields.reverse();

        /* Setup Filters of the probenlist
         *
         * Allowed types are
         * * text
         * * number
         * * datetime
         * * bool
         * * listmst
         * * listumw
         * * listver
         * * listdbasis
         * * listnetz
         *
         * Iterate over all configured filters and add filters dynamically
         *
         *  1. Empty filters
         */
        filters.removeAll();
        var hide = true;
        /* 2. Iterate over all configured filters */
        var j;
        for (j = 0; j < filterFields.length; j++) {
            var type = filterFields[j].type;
            var name = filterFields[j].dataIndex;
            var label = filterFields[j].label;
            var multi = filterFields[j].multiSelect;
            var field = null;
            if (type === 'text') {
                field = Ext.create('Ext.form.field.Text', {
                    name: name,
                    fieldLabel: label
                });
            }
            else if (type === 'number') {
                field = Ext.create('Ext.form.field.Number', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label
                });
            }
            else if (type === 'datetime') {
                field = Ext.create('Lada.view.widget.Datetime', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label
                });
            }
            else if (type === 'bool') {
                field = Ext.create('Lada.view.widget.Testdatensatz', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label,
                    emptyText: ''
                });
            }
            else if (type === 'listmst') {
                field = Ext.create('Lada.view.widget.Messstelle', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label,
                    multiSelect: multi
                });
            }
            else if (type === 'listumw') {
                field = Ext.create('Lada.view.widget.Umwelt', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label,
                    multiSelect: multi
                });
            }
            else if (type === 'listdbasis') {
                field = Ext.create('Lada.view.widget.Datenbasis', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label,
                    multiSelect: multi
                });
            }
            else if (type === 'listver') {
                field = Ext.create('Lada.view.widget.Verwaltungseinheit', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label,
                    multiSelect: multi
                });
            }
            else if (type === 'listnetz') {
                field = Ext.create('Lada.view.widget.Netzbetreiber', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label,
                    multiSelect: multi
                });
            }
            if (field) {
                filters.add(field);
                filters.show();
                hide = false;
            }
        }
        if (hide) {
            filters.hide();
        }
    },

    /**
     * Function is called when the user clicks the search button. The function
     * will perform a search to the server on refreshes the result list.
     */
    search: function(element) {
        var resultGrid = element.up('panel[name=main]').down('filterresultgrid');
        var filters = element.up('panel[name=main]').down('fieldset[name=filtervariables]');
        var search = element.up('fieldset').down('combobox[name=filter]');

        // Get search parameters:
        var searchParams = {};
        searchParams['qid'] = search.getValue();
        for (var i = filters.items.length - 1; i >= 0; i--) {
            var filter = filters.items.items[i];
            var value = filter.getValue();
            if (value instanceof Array) {
                value = value.join(',');
            }
            searchParams[filter.getName()] = value;
        }
        // Retrieve the mode
        var modes = element.up('panel[name=main]').down('radiogroup').getChecked();
        var sname = modes[0].inputValue;

        if (sname === 'ProbeList') {
            sname = 'Lada.store.ProbenList';
        }
        else if (sname === 'MessprogrammList') {
            sname = 'Lada.store.MessprogrammeList';
        }

        // Find the store or create a new one.
        var store = Ext.StoreManager.lookup(sname);
        if (!store) {
            store = Ext.create(sname);
        }
        if (store) {
            resultGrid.setStore(store);
            resultGrid.setupColumns(this.displayFields);
            resultGrid.getStore().proxy.extraParams = searchParams;
            resultGrid.getStore().load();
            resultGrid.show();
        }
    },
    /**
     * This function resets the filters
     */
    reset: function(element) {
        var filters = element.up('panel[name=main]').down('fieldset[name=filtervariables]');
        for (var i = filters.items.length - 1; i >= 0; i--) {
            var filter = filters.items.items[i];
            filter.clearValue();
        }
    },
    /**
     * This Function is supposed to handle the About action
     * It has no function yet.
     */
    about: function() {
        var info = this.getInfoStore();
        Ext.widget('about', {
            info: info
        });
    }
});
