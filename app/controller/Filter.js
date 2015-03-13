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

    init: function() {
        this.control({
            // CSS like selector to select element in the viewport. See
            // ComponentQuery documentation for more details.
            'combobox[name=filter]': {
                // Map Doubleclick on rows of the probenlist.
                select: this.selectSql
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
        var resultGrid = element.up('panel[name=main]').down('filterresultgrid');
        var filters = element.up('panel[name=main]').down('fieldset[name=filtervariables]');
        var columns = element.up('fieldset').down('displayfield[name=columns]');
        var desc = element.up('fieldset').down('displayfield[name=description]');
        var displayFields = record[0].data.results;
        var filterFields = record[0].data.filters;

        this.reset();

        var columnString = [];
        for (var i = 0; i < displayFields.length; i++) {
            columnString.push(displayFields[i].header);
        }
        columns.setValue(columnString.join(', '));
        desc.setValue(record[0].data.description);

        // Setup Columns of the probenlist
        displayFields.reverse();
        resultGrid.setupColumns(displayFields);

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
        resultGrid.getStore().load({
            params: searchParams
        });
        resultGrid.show();
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
