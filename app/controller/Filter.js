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
        'Lada.view.widget.Status',
        'Lada.view.grid.MessprogrammeList',
        'Lada.view.grid.ProbeList',
        'Lada.view.grid.MessungList',
        'Lada.view.grid.Probenehmer',
        'Lada.view.grid.DatensatzErzeuger',
        'Lada.view.grid.MessprogrammKategorie',
        'Lada.view.panel.Ort',
        'Lada.store.MessungenList',
        'Lada.view.window.FilterManagement',
        'Lada.view.window.About',
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
            'filterpanel button[action=details]': {
                click: this.showDetails
            },
            'filterpanel button[action=manage]': {
                click: this.showManagement
            },
            'filterpanel checkbox[name=favorites]': {
                change: this.triggerFilterUpdate
            },
            'filterpanel button[action=savedefault]': {
                click: this.saveFilterDefaults
            },
            'filterpanel button[action=resetdefault]': {
                click: this.resetFilterDefaults
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
        record = Array.isArray(record)? record[0]:record;
        var filters = element.up('panel[name=main]').down('panel[name=filtervariables]');
        var filterValues = element.up('panel[name=main]').down('panel[name=filtervalues]');

        var desc = element.up('fieldset').down('displayfield[name=description]');
        if (!record) {
            desc.setValue('');
            return;
        }
        // Set "Filter Auswahl" Description
        desc.setValue(record.data.description);

        this.displayFields = record.data.results;
        var filterFields = record.data.filters;
        var contentPanel = element.up('panel[name=main]').down('panel[name=contentpanel]');
        var queryType = record.get('type'); //The type of the query, might be proben, messprogramme,
            // or a stammdatendtype
        var details = element.up('panel[name=main]').down('filterdetails');
        details.setRecord(record);
        this.reset(element);
        contentPanel.removeAll(); //clear the panel: make space for new grids

        // Setup Columns
        if (this.displayFields &&
            this.displayFields.length > 0 &&
            this.displayFields[0].index <= 1) {
            this.displayFields.reverse();
        }

        if (queryType == 'probe' ||
            queryType == 'messung' ||
            queryType == 'messprogramm') {
            // Dynamic Grids
            // We need to set both grid and Store.
            var frgrid; // The Resultgrid
            var gridstore; // The Store which will be used in the resultgrid.

            switch (queryType) {
                case 'probe':
                    gridstore = Ext.create('Lada.store.ProbenList');
                    frgrid = Ext.create('Lada.view.grid.ProbeList', {
                        plugins: [{
                            ptype: 'gridrowexpander',
                            gridType: 'Lada.view.grid.Messung',
                            expandOnDblClick: false,
                            gridConfig: {
                                bottomBar: false
                            }
                        }]
                    });
                    break;
                case 'messung':
                    gridstore = Ext.create('Lada.store.MessungenList');
                    frgrid = Ext.create('Lada.view.grid.MessungList', {
                        plugins: [{
                            ptype: 'gridrowexpander',
                            gridType: 'Lada.view.grid.Messwert',
                            expandOnDblClick: false,
                            gridConfig: {
                                bottomBar: false
                            }
                        }]
                    });
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
                    resultGrid = Ext.create('Lada.view.panel.Ort');
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
        filterValues.removeAll();
        var hide = true;
        /* 2. Iterate over all configured filters */
        var j;
        for (j = 0; j < filterFields.length; j++) {
            var type = filterFields[j].type;
            var name = filterFields[j].dataIndex;
            var label = filterFields[j].label;
            var multi = filterFields[j].multiselect;
            var filterId = filterFields[j].id;
            var field = null;
            var value = filterFields[j].value;
            if (type === 'text') {
                field = Ext.create('Ext.form.field.Text', {
                    name: name,
                    fieldLabel: label,
                    filterId: filterId,
                    value: value
                });
            }
            else if (type === 'number') {
                field = Ext.create('Ext.form.field.Number', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label,
                    filterId: filterId,
                    value: value
                });
            }
            else if (type === 'datetime') {
                field = Ext.create('Lada.view.widget.Datetime', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label,
                    filterId: filterId,
                    value: value
                });
            }
            else if (type === 'bool') {
                field = Ext.create('Lada.view.widget.Testdatensatz', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label,
                    value: value,
                    filterId: filterId,
                    emptyText: ''
                });
            }
            else if (type === 'listmst') {
                field = Ext.create('Lada.view.widget.Messstelle', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label,
                    multiSelect: multi,
                    forceSelection: false,
                    filterId: filterId,
                    value: value
                });
            }
            else if (type === 'listumw') {
                field = Ext.create('Lada.view.widget.Umwelt', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label,
                    value: value,
                    filterId: filterId,
                    forceSelection: false,
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
                    forceSelection: false,
                    value: value,
                    filterId: filterId,
                    multiSelect: multi
                });
            }
            else if (type === 'listver') {
                field = Ext.create('Lada.view.widget.Verwaltungseinheit', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label,
                    forceSelection: false,
                    value: value,
                    filterId: filterId,
                    multiSelect: multi
                });
            }
            else if (type === 'listnetz') {
                field = Ext.create('Lada.view.widget.Netzbetreiber', {
                    name: name,
                    labelWidth: 135,
                    fieldLabel: label,
                    forceSelection: false,
                    value: value,
                    filterId: filterId,
                    multiSelect: multi
                });
            }
            else if (type === 'liststatus') {
                field = Ext.create('Lada.view.widget.Status', {
                    name: name,
                    store: Ext.StoreManager.get('statuswerte'),
                    labelWidth: 135,
                    fieldLabel: label,
                    forceSelection: false,
                    value: value,
                    filterId: filterId,
                    editable: false,
                    multiSelect: multi
                });
            }
            if (field) {
                filterValues.add(field);
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
        var filters = element.up('panel[name=main]').down('panel[name=filtervalues]');
        var search = element.up('fieldset').down('combobox[name=filter]');

        if (!search.getValue()) {
            return;
        }
        //Type of the search Proben/Messprogramme/Stammdaten
        var type = search.store.getById(search.getValue()).get('type');

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
            case 'messung':
                sname = 'Lada.store.MessungenList';
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
        // TODO migration. Do we need new stores here with the new filtering?
        var store;
        if (type === 'ort') {
            store = Ext.create(sname, {
                autoLoad: false
            });
            store.proxy.pageParam = undefined;
            store.proxy.startParam = undefined;
            store.proxy.limitParam = undefined;
        }
        else {
            store = Ext.create(sname, {
                pageSize: 50
            });
        }
        if (store) {
            store.addListener('beforeload', this.loadingAnimationOn, resultGrid);
            store.addListener('load', this.loadingAnimationOff, resultGrid);
            if (type === 'ort') {
                if (searchParams['netzbetreiberId'] === undefined ||
                    searchParams['netzbetreiberId'] === '') {
                    searchParams.netzbetreiberId = Lada.netzbetreiber[0];
                }
                var panel = resultGrid.up('ortpanel');
                store.addListener('load', panel.down('map').addLocations, panel.down('map'));
                panel.connectListeners();
            }

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
        var filters = element.up('panel[name=main]').down('panel[name=filtervalues]');
        var search = element.up('fieldset').down('combobox[name=filter]');

        //Type of the search Proben/Messprogramme/Stammdaten
        var qId = search.getValue();
        var query = search.store.getById(qId);
        for (var i = filters.items.length - 1; i >= 0; i--) {
            var filter = filters.items.items[i];
            for (var j = 0; j < query.data.filters.length; j++) {
                if (filter.filterId === query.data.filters[j].id) {
                    filter.setValue(query.data.filters[j].value);
                }
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
    },

    showDetails: function(element) {
        var search = element.up('fieldset').down('combobox[name=filter]');
        var details = element.up('panel[name=main]').down('filterdetails');

        //Type of the search Proben/Messprogramme/Stammdaten
        var record = search.store.getById(search.getValue());
        details.setRecord(record);
        if (element.pressed) {
            details.show();
        }
        else {
            details.hide();
        }
    },

    showManagement: function() {
        if (!this.managementWindow) {
            this.managementWindow = Ext.create('Lada.view.window.FilterManagement');
        }
        this.managementWindow.show();
    },

    triggerFilterUpdate: function(checkbox) {
        var cbox = checkbox.up('fieldset').down('combobox[name=filter]');
        this.updateFilter(cbox);
    },

    updateFilter: function(combobox) {
        var store;
        var entries;
        var fav = combobox.up('fieldset').down('checkbox[name=favorites]');
        if (this.mode === 'proben') {
            store = Ext.StoreManager.get('probequeries');
        }
        else if (this.mode === 'messprogramme') {
            store = Ext.StoreManager.get('messprogrammqueries');
        }
        else if (this.mode === 'stammdaten') {
            store = Ext.StoreManager.get('stammdatenqueries');
        }
        else if (this.mode === 'messungen') {
            store = Ext.StoreManager.get('messungqueries');
        }
        else {
            return;
        }
        var allEntries = store.queryBy(function() {
            return true;
        });
        var favorites = store.queryBy(function(record) {
            if (record.get('favorite')) {
                return true;
            }
        });
        combobox.store.removeAll();
        if (fav.checked && favorites.getCount() > 0) {
            combobox.store.add(favorites.items);
        }
        else {
            combobox.store.add(allEntries.items);
            if (favorites.getCount() === 0) {
                fav.setValue(false);
                fav.disable();
            }
            else {
                fav.enable();
            }
        }
        combobox.select(combobox.store.getAt(0));
        combobox.fireEvent('select', combobox, [combobox.store.getAt(0)]);
    },

    saveFilterDefaults: function(button) {
        var filters = button.up('fieldset').down('panel[name=filtervalues]');

        var search = button.up('fieldset').down('combobox[name=filter]');

        //Type of the search Proben/Messprogramme/Stammdaten
        var qId = search.getValue();
        var query = search.store.getById(qId);
        var ndx = 0;
        for (var i = filters.items.items.length - 1; i >= 0; i--) {
            var filter = filters.items.items[i];
            var filterId = filter.filterId;
            var value = filter.getValue();
            if (value instanceof Array) {
                value = value.join(',');
            }
            Ext.Ajax.request({
                url: 'lada-server/rest/filter',
                method: 'PUT',
                jsonData: {
                    id: filterId,
                    value: value
                },
                success: function() {
                    ndx++;
                    for (var j = 0; j < query.data.filters.length; i++) {
                        if (query.data.filters[j].id === filterId) {
                            query.data.filters[j].value = value;
                            break;
                        }
                    }
                    if (ndx < filters.items.items.length - 1) {
                        return;
                    }
                    if (query.get('type') === 'probe') {
                        Ext.StoreManager.get('probequeries').load();
                    }
                    else if (query.get('type') === 'messprogramm') {
                        Ext.StoreManager.get('messprogrammqueries').load();
                    }
                    else if (query.get('type') === 'messung') {
                        Ext.StoreManager.get('messungqueries').load();
                    }
                    else {
                        Ext.StoreManager.get('stammdatenqueries').load();
                    }
                }
            });
        }
    },

    resetFilterDefaults: function(button) {
        var filters = button.up('fieldset').down('panel[name=filtervalues]');

        var search = button.up('fieldset').down('combobox[name=filter]');

        var qId = search.getValue();
        var query = search.store.getById(qId);
        for (var i = filters.items.length - 1; i >= 0; i--) {
            var filter = filters.items.items[i];
            var filterId = filter.filterId;
            var value = filter.getValue();
            if (value instanceof Array) {
                value = value.join(',');
            }
            Ext.Ajax.request({
                url: 'lada-server/rest/filter/' + filterId,
                method: 'DELETE',
                success: function(response) {
                    var json = Ext.decode(response.responseText);
                    if (!json.success) {
                        return;
                    }
                    filter.setValue(json.data.value);
                    for (var j = 0; j < query.data.filters.length; j++) {
                        if (query.data.filters[j].id === json.data.id) {
                            query.data.filters[j].value = json.data.value;
                            break;
                        }
                    }
                    if (query.get('type') === 'probe') {
                        Ext.StoreManager.get('probequeries').reload();
                    }
                    else if (query.get('type') === 'messprogramm') {
                        Ext.StoreManager.get('messprogrammqueries').reload();
                    }
                    else if (query.get('type') === 'messung') {
                        Ext.StoreManager.get('messungqueries').reload();
                    }
                    else {
                        Ext.StoreManager.get('stammdatenqueries').reload();
                    }
                }
            });
        }
    }
});
