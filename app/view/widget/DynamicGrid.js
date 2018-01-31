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

    requires: [
        'Lada.view.window.Map',
        'Ext.grid.column.Widget'
    ],

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
    setStore: function(store) {
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
        var cbox = Ext.create('Lada.view.widget.PagingSize');
        this.down('pagingtoolbar').add('-');
        this.down('pagingtoolbar').add(cbox);


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
        this.store.setFields(fields);
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
        var i18n = Lada.getApplication().bundle;
        var getClassFunc = function(val, meta, rec) {
            if (rec.get('readonly') === false &&
                ( rec.get('owner') === undefined ||
                    rec.get('owner') === true ||
                    rec.get('owner') === '') &&
                !rec.get('statusEdit')) {
                return 'edit';
            } else if (rec.get('readonly') === false &&
                rec.get('owner') === true &&
                rec.get('statusEdit')) {
                return 'editstatus';
            } else if (rec.get('readonly') === true &&
                rec.get('statusEdit')) {
                return 'noeditstatus';
            }
            return 'noedit';
        };
        var handlerFunc =  function(grid, rowIndex, colIndex) {
            var rec = grid.getStore().getAt(rowIndex);
            grid.fireEvent('itemdblclick', grid, rec);
        };
        switch (this.xtype) {
            case 'probelistgrid':
                var tooltiptext = i18n.getMsg('probe')+' '+i18n.getMsg('open');
                break;
            case 'messunglistgrid':
                var tooltiptext = i18n.getMsg('messung')+' '+i18n.getMsg('open');
                break;
            case 'messprogrammelistgrid':
                var tooltiptext = i18n.getMsg('messprogramm')+' '+i18n.getMsg('open');
        }

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
            tooltip: tooltiptext,
            width: 30,
            getClass: function(val, meta, rec) {
                if (rec.get('readonly') === false &&
                    ( rec.get('owner') === undefined ||
                        rec.get('owner') === true ||
                        rec.get('owner') === '') &&
                    !rec.get('statusEdit')) {
                    return 'edit';
                } else if (rec.get('readonly') === false &&
                    rec.get('owner') === true &&
                    rec.get('statusEdit')) {
                    return 'editstatus';
                } else if (rec.get('readonly') === true &&
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
            //Change id field to a valid ExtJS6 id
            cols[i].id = 'col-' + cols[i].id;

            //Check column type and set to string if unknown
            if (!cols[i].dataType.name) {
                cols[i].dataType = 'string';
            }

            var curField = {
                name: cols[i].dataIndex
            };
            if (cols[i] === 'id' || cols[i].dataIndex === 'probeId') {
                continue;
            }

            var openIconPath = 'img/document-open.png';
            //TODO: Use proper icons
            switch (cols[i].dataType.name) {
                case 'probeId':
                    colImg = Ext.getResourcePath(openIconPath, null, null);
                    cols[i].xtype =  'widgetcolumn';
                    cols[i].widget = {
                        xtype: 'button',
                        icon: colImg,
                        width: '16px',
                        height: '16px',
                        userCls: 'widget-column-button',
                        tooltip: i18n.getMsg('typedgrid.tooltip.probeid'),
                        hidden: true,
                        listeners: {
                            click: function(button) {
                                var id = Number(button.text);
                                Lada.model.Probe.load(id, {
                                    scope: this,
                                    callback: function(record, operation, success) {
                                        if (success) {
                                            var win = Ext.create('Lada.view.window.ProbeEdit', {
                                                record: record,
                                                style: 'z-index: -1;'
                                            });
                                            win.setPosition(30);
                                            win.show();
                                            win.initData();
                                        }
                                    }
                                });
                            },
                            textchange: function(button, oldval, newval) {
                                if (!newval || newval == '') {
                                    button.hide();
                                } else {
                                    button.show();
                                }
                            }
                        }
                    }
                    break;
                case 'messungId':
                    colImg = Ext.getResourcePath(openIconPath, null, null);
                    cols[i].xtype =  'widgetcolumn';
                    cols[i].widget = {
                        xtype: 'button',
                        icon: colImg,
                        width: '16px',
                        height: '16px',
                        userCls: 'widget-column-button',
                        tooltip: i18n.getMsg('typedgrid.tooltip.messungid'),
                        hidden: true,
                        listeners: {
                            click: function(button) {
                                var id = Number(button.text);
                                Lada.model.Messung.load(id, {
                                    scope: this,
                                    callback: function(record, operation, success) {
                                        if (success) {
                                            var messungRecord = record;
                                            Lada.model.Probe.load(messungRecord.get('probeid'), {
                                                scope: this,
                                                callback: function(precord, poperation, psuccess) {
                                                    var win = Ext.create('Lada.view.window.MessungEdit', {
                                                        probe: precord,
                                                        record: record,
                                                        style: 'z-index: -1;'
                                                    });
                                                    win.show();
                                                }
                                            });
                                        }
                                    }
                                });
                            },
                            textchange: function(button, oldval, newval) {
                                if (!newval || newval == '') {
                                    button.hide();
                                } else {
                                    button.show();
                                }
                            }
                        }
                    }
                    break;

                case 'ortId':
                    colImg = Ext.getResourcePath(openIconPath, null, null);
                    cols[i].xtype =  'widgetcolumn';
                    cols[i].widget = {
                        xtype: 'button',
                        icon: colImg,
                        width: '16px',
                        height: '16px',
                        userCls: 'widget-column-button',
                        tooltip: i18n.getMsg('typedgrid.tooltip.ortid'),
                        hidden: true,
                        listeners: {
                            click: function(button) {
                                var id = button.getText();
                                Lada.model.Ort.load(id, {
                                    success: function(record) {
                                        var win = Ext.create('Lada.view.window.Ort', {
                                            record: record
                                        });
                                        win.show();
                                    }
                                });
                            },
                            textchange: function(button, oldval, newval) {
                                if (!newval || newval == '') {
                                    button.hide();
                                } else {
                                    button.show();
                                }
                            }
                        }
                    }
                    break;
                case 'geom':
                    colImg = Ext.getResourcePath('img/document-open.png', null, null);
                    cols[i].xtype =  'widgetcolumn';
                    cols[i].widget = {
                        xtype: 'button',
                        icon: colImg,
                        width: '16px',
                        height: '16px',
                        userCls: 'widget-column-button',
                        tooltip: i18n.getMsg('typedgrid.tooltip.geometry'),
                        hidden: true,
                        listeners: {
                            click: function(button) {
                                var geom = button.geom;
                                var mapWin = Ext.create('Lada.view.window.Map', {
                                    geom: geom
                                });
                                mapWin.show();
                            },
                            textchange: function(button, oldval, newval) {
                                button.geom = newval;
                                button.text = '';
                                button.tooltip = newval;
                                if (!newval || newval == '') {
                                    button.hide();
                                } else {
                                    button.show();
                                }
                            }
                        }
                    }
                break;
                case 'date':
                    curField.depends = cols[i].dataIndex;

                    cols[i].xtype = 'datecolumn';
                    cols[i].format = cols[i].dataType.format;
                    cols[i].renderer = function(value, cell){
                        if (!value || value == '') {
                            return '';
                        }
                        var format = cell.column.format;
                        var dt =  Ext.Date.format(new Date(value), format);
                        return dt;
                    };

                break;
                case 'number':
                cols[i].xtype = 'numbercolumn';
                cols[i].format = cols[i].dataType.format;
                cols[i].renderer = function(value, cell) {
                    if (!value) {
                        return '';
                    }
                    var format = cell.column.format;
                    if (format === 'e') {
                        return value.toExponential();
                    } else {
                        return Ext.util.Format.number(value, format);
                    }
                }
                break;
                default:
                    switch (cols[i].dataIndex) {
                        case 'dBasis':
                        case 'pArt':
                        case 'statusSt':
                        case 'statusW':
                        case 'baId':
                        case 'mstLaborId':
                        case 'messRegime':
                        case 'intervall':
                        case 'mstId':
                        case 'netzId':
                            cols[i].filter = {type: 'list'};
                            break;
                        default:
                            cols[i].filter = {type: 'string'};
                    }
            }
            fields.push(curField);
            resultColumns.push(cols[i]);
        }
        var caf = new Array();
        caf[0] = resultColumns;
        caf[1] = fields;
        return caf;
    }
});

