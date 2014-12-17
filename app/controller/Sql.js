/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for the Search
 * This controller handles all logic related to the search
 */
Ext.define('Lada.controller.Sql', {
    extend: 'Ext.app.Controller',

    requires: [
        'Lada.view.widgets.Mst',
        'Lada.view.widgets.Uwb',
        'Lada.view.widgets.Datetime',
        'Lada.view.About'
    ],

    stores: [
        'Proben',    // List of found Proben
        'ProbenList',    // List of found Proben
        'Queries',
        'Info'
    ],

    init: function() {
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            '#search': {
                // Map Doubleclick on rows of the probenlist.
                select: this.selectSql
            },
            '#SearchBtn': {
                // Map click event on Button.
                click: this.search
            },
            '#ResetBtn': {
                // Map click event on Button.
                click: this.reset
            },
            '#AboutBtn': {
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
        var result = Ext.getCmp('result');
        var filters = Ext.getCmp('queryfilters');
        var columns = Ext.getCmp('results');
        var sqldesc = Ext.getCmp('sqldesc');
        var buttons = Ext.getCmp('SearchBtnPanel');
        var displayFields = record[0].data.results;
        var filterFields = record[0].data.filters;

        this.reset();

        columnString = [];
        for (var i = 0; i < displayFields.length; i++) {
            columnString.push(displayFields[i].header);
        }
        columns.setValue(columnString.join(', '));
        sqldesc.setValue(record[0].data.description);

        // Setup Columns of the probenlist
        displayFields.reverse();
        result.setupColumns(displayFields);

        // Setup Filters of the probenlist
        //
        // Allowed types are
        // * text
        // * number
        // * datetime
        // * bool
        // * listmst
        // * listumw
        // * listver
        // * listdbasis
        // * listnetz
        //
        // Iterate over all configured filters and add filters dynamically
        //
        // 1. Empty filters
        filters.removeAll();
        var hide = true;
        // 2. Iterate over all configured filters
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
                    fieldLabel: label
                });
            }
            else if (type === 'datetime') {
                field = Ext.create('Lada.view.widgets.Datetime', {
                    name: name,
                    fieldLabel: label
                });
            }
            else if (type === 'bool') {
                field = Ext.create('Lada.view.widgets.Testdatensatz', {
                    name: name,
                    fieldLabel: label,
                    emptyText: ''
                });
            }
            else if (type === 'listmst') {
                field = Ext.create('Lada.view.widgets.Mst', {
                    name: name,
                    fieldLabel: label,
                    multiSelect: multi
                });
            }
            else if (type === 'listumw') {
                field = Ext.create('Lada.view.widgets.Uwb', {
                    name: name,
                    fieldLabel: label,
                    multiSelect: multi
                });
            }
            else if (type === 'listdbasis') {
                field = Ext.create('Lada.view.widgets.Datenbasis', {
                    name: name,
                    fieldLabel: label,
                    multiSelect: multi
                });
            }
            else if (type === 'listver') {
                field = Ext.create('Lada.view.widgets.Verwaltungseinheit', {
                    name: name,
                    fieldLabel: label,
                    multiSelect: multi
                });
            }
            else if (type === 'listnetz') {
                field = Ext.create('Lada.view.widgets.Netzbetreiber', {
                    name: name,
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
        buttons.show();
    },

    /**
     * Function is called when the user clicks the search button. The function
     * will perform a search to the server on refreshes the result list.
     */
    search: function() {
        var result = Ext.getCmp('result');
        var filters = Ext.getCmp('queryfilters');
        var search = Ext.getCmp('search');

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
        result.getStore().load({
            params: searchParams
        });
        result.show();
    },

    reset: function() {
        // var buttons = Ext.getCmp('SearchBtnPanel');
        // var result = Ext.getCmp('result');
        // for (var i = 0; i < queries.length; ++i) {
        //     var toHide = Ext.getCmp(queries[i]);
        //     toHide.hide();
        // }
        // result.hide();
        // buttons.hide();
    },

    about: function() {
        var info = this.getInfoStore();
        Ext.widget('about', {
            info: info
        });
    }
});
