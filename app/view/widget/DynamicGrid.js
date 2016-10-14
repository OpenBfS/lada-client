/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list the result of the Filter
 */
Ext.define('Lada.view.widget.DynamicGrid', {
    extend: 'Ext.grid.Panel',

    store: null,

    border: false,
    multiSelect: true,
    allowDeselect: true,

    isDynamic: true,

    viewConfig: {
        deferEmptyText: false
    },

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.callParent(arguments);
    },

    /**
     * This sets the Store of the DynamicGrid
     */
    setStore: function(store){
        var i18n = Lada.getApplication().bundle;

        this.reconfigure(store);
        var ptbar = this.down('pagingtoolbar');
        if (ptbar) {
            this.removeDocked(ptbar);
        }

        this.addDocked([{
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            store: store,
            displayInfo: true
        }]);

    },

    /**
     * Setup columns of the Grid dynamically based on a list of given cols.
     * The function is called from the {@link Lada.controller.Filter#search
     * search event}
     * The Images for the Read-Write Icon are defined in CSS
     */
    setupColumns: function(cols) {
        var caf = this.generateColumnsAndFields(cols);
        var columns = caf[0];
        var fields = caf[1];
        this.store.model.setFields(fields);
        this.reconfigure(this.store, columns);
    },

    /**
     * generateColumnsAndFields
     * generates an array of columns which are used for the dynamic grid
     * @return an array of two arrays: [0] is an array of colums [1] an array
     *   of fields
     **/
    generateColumnsAndFields: function(cols) {
        var resultColumns = [];
        var fields = [];

        fields.push(new Ext.data.Field({
            name: 'owner'
        }));
        fields.push(new Ext.data.Field({
            name: 'readonly'
        }));
        fields.push(new Ext.data.Field({
            name: 'statusEdit'
        }));
        fields.push(new Ext.data.Field({
            name: 'id'
        }));

        resultColumns.push({
            xtype: 'actioncolumn',
            text: 'RW',
            dataIndex: 'readonly',
            sortable: false,
            tooltip: 'Probe öffnen',
            width: 30,
            getClass: function (val, meta, rec) {
                if (rec.get('readonly') === false &&
                    rec.get('owner') === true &&
                    !rec.get('statusEdit')) {
                        return 'edit';
                }
                else if (rec.get('readonly') === false &&
                    rec.get('owner') === true &&
                    rec.get('statusEdit')) {
                        return 'editstatus';
                }
                else if (rec.get('readonly') === true &&
                    rec.get('statusEdit')) {
                        return 'noeditstatus';
                }
                return 'noedit';
            },
            handler: function(grid, rowIndex, colIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                grid.fireEvent('itemdblclick', grid, rec);
             }
        });

        for (var i = cols.length - 1; i >= 0; i--) {
            fields.push(new Ext.data.Field({
                name: cols[i].dataIndex
            }));
            if (cols[i] === 'id' || cols[i].dataIndex === 'probeId') {
                continue;
            }
            resultColumns.push(cols[i]);
        }
        var caf = new Array();
        caf[0] = resultColumns;
        caf[1] = fields;
        return caf;
     }
});

