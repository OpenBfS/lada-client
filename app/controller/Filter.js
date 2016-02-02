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
        'Lada.view.window.FilterManagement',
        'Lada.view.widget.Umwelt'
    ],

    stores: [
        'ProbenList',    // List of found Proben
        'MessprogrammeList' //List of found Messprogramme
    ],

    displayFields: null,

    managementWindow: null,

    mode: 'proben',

    /**
     * Initialize this Controller
     * It has 4 Listeners
     */
    init: function() {
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            'filterpanel combobox[name=filter]': {
                // Map Select event
                select: this.selectSql
            },
            'filterpanel button[action=search]': {
                // Map click event on Button.
                click: this.search
            },
            'filterpanel button[action=reset]': {
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
     * selected search query.
     * It also replaces the Store of the Filteresultgrid.
     * Two possibilities exist to do so: Proben/Messprogramme where dynamic columns exist, but the
     * content remains of the same type and Stammdaten, were columns are fixed but the type might
     * vary between orte, kategorien, ...
     */
    selectSql: function(element, record) {
        var filters = element.up('panel[name=main]').down('fieldset[name=filtervariables]');

        if (!record[0]) {
            return;
        }
        // Set "Filter Auswahl" Description
        var desc = element.up('fieldset').down('displayfield[name=description]');
        desc.setValue(record[0].data.description);

        this.displayFields = record[0].data.results;
        var filterFields = record[0].data.filters;
        var contentPanel = element.up('panel[name=main]').down('panel[name=contentpanel]');
        var queryType = record[0].get('type'); //The type of the query, might be proben, messprogramme,
            // or a stammdatendtype
        var details = element.up('panel[name=main]').down('filterdetails');
        details.setRecord(record[0]);

        this.reset(element);

        contentPanel.removeAll(); //clear the panel: make space for new grids

        // Setup Columns
        if (this.displayFields) {
            this.displayFields.reverse();
        }

        if (queryType == 'probe' || queryType == 'messprogramm') {
            // Dynamic Grids
            // We need to set both grid and Store.
            var frgrid; // The Resultgrid
            var gridstore; // The Store which will be used in the resultgrid.

            switch (queryType) {
                case 'probe':
                    gridstore = Ext.create('Lada.store.ProbenList');
                    frgrid = Ext.create('Lada.view.grid.ProbeList');
                    break;
                case 'messprogramm':
                    gridstore = Ext.create('Lada.store.MessprogrammeList');
                    frgrid = Ext.create('Lada.view.grid.MessprogrammeList');
                    break;
            }

            if (gridstore) {
                frgrid.setStore(gridstore);
            }

            contentPanel.add(frgrid);
        }
        else {
            // Grids which are not build with dynamic columns
            // The store is configured in each grid, hence we only need to set the
            // grid
            var resultGrid;
            switch (queryType) {
                case 'messprogrammkategorie':
                    resultGrid = Ext.create('Lada.view.grid.MessprogrammKategorie');
                    break;
                case 'datensatzerzeuger':
                    resultGrid = Ext.create('Lada.view.grid.DatensatzErzeuger');
                    break;
                case 'ort':
                    resultGrid = Ext.create('Lada.view.grid.Orte');
                    break;
                case 'probenehmer':
                    resultGrid = Ext.create('Lada.view.grid.Probenehmer');
                    break;
            }
            if (resultGrid) {
                contentPanel.add(resultGrid);
            }
        }
        /* Setup Filters
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
                    multiSelect: multi,
                    displayTpl: Ext.create('Ext.XTemplate',
                     '<tpl for=".">{id} </tpl>')
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
     * To do so it replaces the store of the Resultgrids.
     */
    search: function(element) {
        var resultGrid = element.up('panel[name=main]').down('panel[name=contentpanel]').down('grid');
        var filters = element.up('panel[name=main]').down('fieldset[name=filtervariables]');
        var search = element.up('fieldset').down('combobox[name=filter]');

        //Type of the search Proben/Messprogramme/Stammdaten
        var type = search.store.getById(search.getValue()).get('type')

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

        //Store depends of the Type...
        // TODO the switchcasese should be unified withj those in SelectSql
        switch (type) {
            case 'probe':
                sname = 'Lada.store.ProbenList';
                break;
            case 'messprogramm':
                sname = 'Lada.store.MessprogrammeList';
                break;
            case 'messprogrammkategorie':
                sname = 'Lada.store.MessprogrammKategorie';
                break;
            case 'datensatzerzeuger':
                sname = 'Lada.store.DatensatzErzeuger';
                break;
            case 'ort':
                sname = 'Lada.store.Orte';
                break;
            case 'probenehmer':
                sname = 'Lada.store.Probenehmer';
                break;
        }

        // Find the store or create a new one.
        var store = Ext.StoreManager.lookup(sname);
        if (!store) {
            store = Ext.create(sname);
        }
        if (store) {
            store.addListener('beforeload', this.loadingAnimationOn, resultGrid);
            store.addListener('load', this.loadingAnimationOff, resultGrid);

            resultGrid.setStore(store);
            //TODO: Check if this is still necessary, as a Grid exists
            // for each Type.

            if (resultGrid.isDynamic) {
               //only the dynamic resultgrid can and needs to do the following:
               resultGrid.setupColumns(this.displayFields);
            }

            resultGrid.getStore().proxy.extraParams = searchParams;
            resultGrid.getStore().load();
            resultGrid.show();
        }
    },

    /**
     * Enable the Loading Animation of the Grid.
     */
    loadingAnimationOn: function(store, operation) {
        // this = resultgrid because of the scope which was set in addListener
        this.setLoading(true);
    },

    /**
     * Disable the Loading Animation of the Grid.
     */
    loadingAnimationOff: function(store, operation) {
        // this = resultgrid because of the scope which was set in addListener
        this.setLoading(false);
    },

    /**
     * This function resets the filters
     */
    reset: function(element) {
        var filters = element.up('panel[name=main]').down('fieldset[name=filtervariables]');
        for (var i = filters.items.length - 1; i >= 0; i--) {
            var filter = filters.items.items[i];
            if (filter.clearValue) {
                filter.clearValue();
            }
            else {
                filter.setValue('');
            }
        }
    },
    /**
     * This Function is supposed to handle the About action
     * It has no function yet.
     */
    about: function() {
        var win = Ext.create('Lada.view.window.About');
        win.show();
    }
});
