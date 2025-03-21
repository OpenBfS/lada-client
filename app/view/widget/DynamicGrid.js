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
    alias: 'widget.dynamicgrid',
    requires: [
        'Ext.grid.column.Widget',
        'Lada.controller.grid.DynamicGrid',
        'Lada.view.grid.Messung',
        'Lada.view.grid.Messwert',
        'Lada.view.window.Probenehmer',
        'Lada.view.window.DatensatzErzeuger',
        'Lada.view.window.MessprogrammKategorie',
        'Lada.view.panel.Map'
    ],
    controller: 'dynamicgridcontroller',

    store: null,

    /** toggle for the button and option "print grid"*/
    printable: true,

    /** toggle for the button and option "export data"*/
    exportable: true,

    bufferedRenderer: false,

    /** additional non-generic buttons */
    toolbarbuttons: [],
    hidebuttons: [],

    /** path to an icon used for 'open' buttons */
    openIconPath: 'img/document-open.png',

    /** The untranslated i18n-Message for a grid title*/
    title: null,

    /** If true, the export row expander option will be checked by default,
     * defaults to false
    */
    exportRowexp: false,

    border: false,
    multiSelect: true,
    allowDeselect: true,
    sortable: false,

    // the dataType to be used on generic doubleclik/add/delete buttons.
    rowtarget: null,

    isDynamic: true,

    showMap: false,

    viewConfig: {
        deferEmptyText: false
    },

    currentParams: null,

    /**List of userids that can set a messung's status */
    statusUser: [1, 2, 3],

    initComponent: function() {
        this.i18n = Lada.getApplication().bundle;
        this.emptyText = this.i18n.getMsg(this.emptyText);
        this.selModel = Ext.create('Ext.selection.CheckboxModel', {
            checkOnly: true,
            injectCheckbox: 1,
            // Handle header checkbox clicks to only send one select event
            onHeaderClick: function() {
                var selectionCount = this.getCount();
                var grid = this.view.grid;
                var recordCount = grid.getStore().getCount();
                if (recordCount === selectionCount) {
                    this.deselectAll();
                } else {
                    this.selectAll(true);
                    var records = this.getSelection();
                    grid.fireEvent('selectall', grid, records);
                }
            }
        });
        this.callParent(arguments);
    },

    setToolbar: function() {
        //Clear current toolbar buttons
        this.toolbarbuttons = [];

        this.i18n = Lada.getApplication().bundle;
        var tbcontent = [];
        if (this.title) {
            this.title = this.i18n.getMsg(this.title);
        }

        // fill the toolbar in the appropiate order of buttons
        this.genericAddButton();
        this.genericDeleteButton();
        this.toolbarbuttons.push('->');
        if (this.rowtarget.dataType === 'mpId') {
            this.addMessprogrammButtons();
        }
        if (this.rowtarget.dataType === 'probeId') {
            this.addProbeButtons();
        }
        if (this.rowtarget.dataType === 'messungId') {
            this.addMessungButtons();
        } else if (this.rowtarget.messungIdentifier) {
            var mI = this.rowtarget.messungIdentifier;
            if (this.getVisibleColumns().find(function(item) {
                return item.dataIndex === mI;
            })) {
                this.addSetStatusButton();
            }
        }
        if (this.rowtarget.dataType === 'ortId') {
            this.addOrtButtons();
        }
        this.addExportButton();
        this.addPrintButton();

        if (this.toolbarbuttons && this.toolbarbuttons.length) {
            for (var i = 0; i < this.toolbarbuttons.length; i++) {
                if (this.hidebuttons.indexOf(
                    this.toolbarbuttons[i].action) < 0) {
                    tbcontent.push(this.toolbarbuttons[i]);
                }
            }
        }
        this.addDocked({
            xtype: 'toolbar',
            dock: 'top',
            items: tbcontent
        });
    },

    /**
     * This sets the Store of the DynamicGrid
     */
    setStore: function(store) {
        if (store) {
            this.reconfigure(store);
        }
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
        if (this.down('map') !== null) {
            this.removeDocked(this.down('map'));
        }
        if (this.showMap) {
            this.i18n = Lada.getApplication().bundle;
            var map = Ext.create('Lada.view.panel.Map', {
                collapsible: true,
                multiSelect: true,
                minWidth: 400,
                maxWidth: 900,
                width: 400,
                resizable: true,
                dock: 'right',
                collapseDirection: 'right',
                title: this.i18n.getMsg('map.title'),
                externalOrteStore: false
            });
            map.on({
                featureselected: {
                    fn: this.selectRowByFeature,
                    scope: this
                },
                featureadded: {
                    fn: this.addOrt,
                    scope: this
                }
            });
            this.addDocked(map);
        }
        var cbox = Ext.create('Lada.view.widget.PagingSize');
        this.down('pagingtoolbar').add('-');
        this.down('pagingtoolbar').add(cbox);
        this.down('pagingtoolbar').down('#refresh').hide();
        //If timezone is toggled, reload to update time strings
        Ext.on('timezonetoggled', function() {
            var grid = Ext.ComponentQuery.query('dynamicgrid');
            if (grid.length === 1) {
                grid[0].reload(function() {
                    Ext.ComponentQuery.query(
                        'timezonebutton[action=toggletimezone]')[0]
                        .requestFinished();
                });
            }
        });
    },

    selectRowByFeature: function(map, features) {
        if (!Array.isArray(features)) {
            features = [features];
        }
        var records = [];
        for (var i = 0; i < features.length;i++) {
            var id = features[i].get ? features[i].get('id') : features[i];
            if (id !== undefined) {
                records.push(this.store.findRecord(
                    this.rowtarget.dataIndex, id, false, false, false, true));
            }
        }
        this.getSelectionModel().select(records, map.multiSelect);
    },

    addOrt: function(event) {
        var clone = event.feature.clone();
        clone.getGeometry().transform('EPSG:3857', 'EPSG:4326');
        var koord_x = Math.round(
            clone.getGeometry().getCoordinates()[0] * 100000)
            / 100000;
        var koord_y = Math.round(
            clone.getGeometry().getCoordinates()[1] * 100000)
            / 100000;
        Ext.create('Lada.view.window.Ort', {
            record: Ext.create('Lada.model.Site', {
                coordXExt: koord_x.toString(),
                coordYExt: koord_y.toString(),
                spatRefSysId: 4,
                siteClassId: 'DYN',
                plausibleReferenceCount: 0,
                referenceCountMp: 0,
                referenceCount: 0
            })
        }).show();
    },

    /**
     * Setup columns of the Grid dynamically.
     * @param data The result of a search request //TODO
     * @param columnstore: store with currently available Lada.model.GridColumn
     * definitions
     * The function is called from the {@link Lada.controller.Query#search
     * search event}
     * The Images for the Read-Write Icon are defined in CSS
     */
    setup: function(data, columnstore) {
        var caf = this.generateColumnsAndFields(data, columnstore);
        this.columns = caf[0];
        var fields = caf[1];
        this.store.setFields(fields);
        this.reconfigure(this.store, this.columns);
        this.setToolbar();
    },

    /**
     * generateColumnsAndFields
     * generates an array of columns which are used for the dynamic grid
     * @return an array of two arrays: [0] is an array of colums [1] an array
     *   of fields
     **/
    generateColumnsAndFields: function(current_columns, fixedColumnStore) {
        this.i18n = Lada.getApplication().bundle;

        this.showMap = false;

        // Initialize first field
        var fields = [];
        fields.push(new Ext.data.Field({
            name: 'readonly'
        }));

        // Initialize column for first field as 'actioncolumn'
        var resultColumns = [];
        resultColumns.push({
            xtype: 'actioncolumn',
            text: 'RW',
            dataIndex: 'readonly',
            hideable: false,
            sortable: false,
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
                } else if (rec.store.data.length > 500) {
                    return 'noauthorisation';
                }
                return 'noedit';
            },
            handler: function(grid, rowIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                grid.fireEvent('itemdblclick', grid, rec);
            }
        });

        this.currentParams = {
            sorting: [],
            filters: []
        };
        this.toolbarbuttons = [];

        var filterMap = this.getFilterValues();

        current_columns.sort('colIndex', 'ASC');
        var cc = current_columns.getData().items;
        for (var i = 0; i < cc.length; i++) {
            var orig_column = fixedColumnStore.findRecord(
                'id', cc[i].get('gridColMpId'), false, false, false, true);
            var dataIndex = orig_column.get('dataIndex');
            if (cc[i].get('isVisible') === true) {
                var col = {
                    dataIndex: dataIndex,
                    dataType: orig_column.get('disp'),
                    text: orig_column.get('gridCol'),
                    width: cc[i].get('width'),
                    sortable: false
                };
                //Check column type and set to string if unknown
                var datatype = orig_column.get('disp');
                if (!datatype) {
                    datatype = {name: 'text'};
                }
                var curField = {
                    dataIndex: dataIndex,
                    name: orig_column.get('gridCol')
                };
                switch (datatype.name) {
                    case 'probeId':
                        this.generateProbeColumn(col);
                        break;
                    case 'messungId':
                        this.generateMessungColumns(col);
                        break;
                    case 'mpId':
                        this.generateMessprogrammColumns(col);
                        break;
                    case 'ortId':
                        this.generateOrtColumns(col);
                        break;
                    case 'geom':
                        this.generateGeomColumns(col);
                        break;
                    case 'date':
                        this.generateDateColumns(orig_column, col);
                        break;
                    case 'number':
                        this.generateNumberColumns(orig_column, col);
                        break;
                    case 'boolean':
                        this.generateBooleanColumns(col);
                        break;
                    case 'statusstufe':
                        this.generateStatusStufeColumns(col);
                        break;
                    case 'umwbereich':
                        this.generateUmweltbereichColumns(col);
                        break;
                    case 'statuswert':
                        this.generateStatusWertColumns(col);
                        break;
                    case 'statuskombi':
                        this.generateStatusKombiColumns(col);
                        break;
                    case 'egem':
                        this.generateEgemColumns(col);
                        break;
                    case 'netzbetr':
                        this.generateNetzbetreiberColumns(col);
                        break;
                    case 'datenbasis':
                        this.generateDatenbasisColumns(col);
                        break;
                    case 'probenart':
                        this.generateProbenartColumns(col);
                        break;
                    case 'staat':
                        this.generateStaatColumns(col);
                        break;
                    case 'probenehmer':
                    case 'dsatzerz':
                    case 'mprkat':
                        this.generateStammColumn(col, datatype);
                        break;
                    case 'textLineBr':
                        col.xtype = 'gridcolumn';
                        col.renderer = function(value) {
                            if (value === 0 || value === null) {
                                return null;
                            }
                            return '<div style="white-space: normal !important;">' +
                                Ext.htmlEncode(value) + '</div>' || '';
                        };
                        break;
                    default:
                        col.xtype = 'gridcolumn';
                        col.renderer = function(value) {
                            if (value === 0 || value === null) {
                                return value;
                            }
                            return Ext.htmlEncode(value) || '';
                        };
                }

                fields.push(curField);

                if (cc[i].sort) {
                    this.currentParams.sorting.push({
                        name: dataIndex,
                        sort: cc[i].get('sort')
                    });
                }

                col.hideable = false;
                col.draggable = false;
                resultColumns.push(col);
            }
            if (cc[i].get('isFilterActive')) {
                this.currentParams.filters.push({
                    //dataindex
                    name: dataIndex,
                    //Readable name
                    displayName: cc[i].get('gridCol'),
                    //Filter value
                    filterVal: cc[i].get('filterVal'),
                    //Readable filter value
                    filterDisplay: filterMap.get(dataIndex) ?
                        filterMap.get(dataIndex) :
                        cc[i].get('filterVal'),
                    isFilterRegex: cc[i].get('isFilterRegex'),
                    isFilterNegate: cc[i].get('isFilterNegate'),
                    isFilterNull: cc[i].get('isFilterNull')
                });
            }
        }
        var caf = new Array();
        caf[0] = resultColumns;
        caf[1] = fields;
        return caf;
    },

    generateProbeColumn: function(col) {
        col.xtype = 'widgetcolumn';
        col.widget = {
            xtype: 'button',
            icon: Ext.getResourcePath(this.openIconPath, null, null),
            width: '16px',
            height: '16px',
            userCls: 'widget-column-button',
            tooltip: this.i18n.getMsg('typedgrid.tooltip.probeid'),
            hidden: true,
            listeners: {
                click: function(button) {
                    var id = Number(button.text);
                    button.getEl().swallowEvent(['click', 'dblclick'], true);
                    var win = Ext.create('Lada.view.window.Probe', {
                        style: 'z-index: -1;',
                        recordId: id
                    });
                    //Window may not be shown if another instance is open
                    if (win.show()) {
                        win.setPosition(30);
                        win.loadRecord(id, this,
                            function(record, operation, success) {
                                if (success) {
                                    win.setRecord(record);
                                    win.initData(record);
                                }
                            });
                    }
                },
                textchange: function(button, oldval, newval) {
                    if (!newval || newval === '') {
                        button.hide();
                    } else {
                        button.show();
                    }
                }
            }
        };
    },
    generateMessungColumns: function(col) {
        col.xtype = 'widgetcolumn';
        col.widget = {
            xtype: 'button',
            icon: Ext.getResourcePath(this.openIconPath, null, null),
            width: '16px',
            height: '16px',
            userCls: 'widget-column-button',
            tooltip: this.i18n.getMsg('typedgrid.tooltip.messungid'),
            hidden: true,
            listeners: {
                click: function(button) {
                    var id = Number(button.text);
                    button.getEl().swallowEvent(['click', 'dblclick'], true);
                    var win = Ext.create(
                        'Lada.view.window.Messung', {
                            style: 'z-index: -1;',
                            recordId: id
                        });
                    if (win.show()) {
                        win.loadRecord(id,
                            this,
                            function(record, operation, success) {
                                if (success) {
                                    var messungRecord = record;
                                    var probeWin = Ext.create(
                                        'Lada.view.window.Probe', {
                                            style: 'z-index: -1;',
                                            recordId: messungRecord.get(
                                                'sampleId')
                                        });
                                    if (!probeWin.show()) {
                                        //If there is already a probe window,
                                        //use this instead of a new one
                                        probeWin.destroy();
                                        probeWin = Ext.ComponentQuery.query(
                                            'probenedit[recordId=' +
                                            messungRecord.get('sampleId') +
                                            ']')[0];
                                    }
                                    probeWin.addChild(win);
                                    win.parentWindow = probeWin;
                                    probeWin.setPosition(30);
                                    win.setPosition(35 + probeWin.width);
                                    probeWin.loadRecord(
                                        messungRecord.get('sampleId'),
                                        this,
                                        function(precord) {
                                            probeWin.setRecord(precord);
                                            probeWin.initData(precord);
                                            win.setProbe(precord);
                                            win.setRecord(record);
                                            win.initData(record);
                                        });
                                }
                            });
                    }
                },
                textchange: function(button, oldval, newval) {
                    if (!newval || newval === '') {
                        button.hide();
                    } else {
                        button.show();
                    }
                }
            }
        };
    },

    generateMessprogrammColumns: function(col) {
        col.xtype = 'widgetcolumn';
        col.widget = {
            xtype: 'button',
            icon: Ext.getResourcePath(this.openIconPath, null, null),
            width: '16px',
            height: '16px',
            userCls: 'widget-column-button',
            tooltip: this.i18n.getMsg('typedgrid.tooltip.mprid'),
            hidden: true,
            listeners: {
                click: function(button) {
                    var id = button.getText();
                    button.getEl().swallowEvent(['click', 'dblclick'], true);
                    var win = Ext.create(
                        'Lada.view.window.Messprogramm', {
                            recordId: id});
                    if (win.show()) {
                        win.loadRecord(
                            id,
                            this,
                            function(record, operation, success) {
                                if (success) {
                                    win.setRecord(record);
                                    win.initData(record);
                                }
                            });
                    }

                },
                textchange: function(button, oldval, newval) {
                    if (!newval || newval === '') {
                        button.hide();
                    } else {
                        button.show();
                    }
                }
            }
        };
    },

    generateOrtColumns: function(col) {
        col.xtype = 'widgetcolumn';
        col.widget = {
            xtype: 'button',
            icon: Ext.getResourcePath(this.openIconPath, null, null),
            width: '16px',
            height: '16px',
            userCls: 'widget-column-button',
            tooltip: this.i18n.getMsg('typedgrid.tooltip.ortid'),
            hidden: true,
            listeners: {
                click: function(button) {
                    var id = button.getText();
                    button.getEl().swallowEvent(['click', 'dblclick'], true);
                    var win = Ext.create('Lada.view.window.Ort', {
                        recordId: id
                    });
                    if (win.show()) {
                        win.loadRecord(
                            id,
                            this,
                            function(record, operation, success) {
                                if (success) {
                                    win.initData(record);
                                }
                            });
                    }

                },
                textchange: function(button, oldval, newval) {
                    if (!newval || newval === '') {
                        button.hide();
                    } else {
                        button.show();
                    }
                }
            }
        };
    },

    generateGeomColumns: function(col) {
        this.showMap = true;
        col.xtype = 'gridcolumn';
        col.renderer = function(value) {
            if (!value) {
                return '';
            }
            return Ext.htmlEncode(value);
        };
    },

    generateDateColumns: function(orig_column, col) {
        col.xtype = 'datecolumn';
        col.format = orig_column.get('disp').format;
        col.renderer = function(value) {
            var date = Ext.Date.parse(value, Ext.data.field.Date.DATE_FORMAT);
            return Lada.util.Date.formatTimestamp(date, col.format, true);
        };
    },

    generateNumberColumns: function(orig_column, col) {
        col.xtype = 'numbercolumn';
        col.format = orig_column.get('disp').format;
        col.renderer = function(value) {
            if (value === null) {
                return '';
            }
            var format = col.format;
            if (isNaN (value)) {
                if (value[0] === '<' ) {
                    if (format === 'e') {
                        return '< ' + String(parseInt(
                            value.substring(1), 10).toExponential());
                    } else {
                        return '< ' + String(
                            Ext.util.Format.number(value, format));
                    }
                } else {
                    return value;
                }
            }
            if (format === 'e') {
                //Check if value is already a string representation
                var strValue = value;
                if (typeof(value) !== 'string') {
                    strValue = Lada.getApplication().toExponentialString(
                        value, 2)
                        .replace('.', Ext.util.Format.decimalSeparator);
                }
                var splitted = strValue.split('e');
                var exponent = parseInt(splitted[1], 10);
                return splitted[0] + 'e'
                    + ((exponent < 0) ? '-' : '+')
                    + ((Math.abs(exponent) < 10) ? '0' : '')
                    + Math.abs(exponent).toString();

            } else {
                return Ext.util.Format.number(value, format);
            }
        };
    },
    generateBooleanColumns: function(col) {
        col.xtype = 'gridcolumn';
        col.renderer = function(value) {
            if (value === true) {
                return Lada.getApplication().bundle.getMsg('true');
            } else if (value === false) {
                return Lada.getApplication().bundle.getMsg('false');
            } else {
                return '';
            }
        };
    },
    generateStatusStufeColumns: function(col) {
        col.xtype = 'gridcolumn';
        col.renderer = function(value) {
            if (!value) {
                return '';
            }
            // var st = Ext.data.StoreManager.get('statusstufe');
            // var rec = st.findRecord('id', value, false,false,
            //     false,true);
            // if (!rec) {
            return Ext.htmlEncode(value);
            // }
            // if (rec.get('stufe') !== undefined) {
            //     return rec.get('stufe');
            // }
            // return '';
        };
    },
    generateUmweltbereichColumns: function(col) {
        col.xtype = 'gridcolumn';
        col.renderer = function(value) {
            if (!value) {
                return '';
            } else {
                return Ext.htmlEncode(value);
            }
        };
    },
    generateStatusWertColumns: function(col) {
        col.xtype = 'gridcolumn';
        col.renderer = function(value) {
            if (!value) {
                return '';
            }
            // var st = Ext.data.StoreManager.get('statuswerte');
            // var rec = st.findRecord('id', value, false,false,
            //     false,true);
            // if (!rec) {
            return Ext.htmlEncode(value);
            // }
            // if (rec.get('wert') !== undefined) {
            //     return rec.get('wert');
            // }
            // return '';
        };
    },

    generateStatusKombiColumns: function(col) {
        col.xtype = 'gridcolumn';
        col.renderer = function(value) {
            if (!value) {
                return '';
            }
            var st = Ext.data.StoreManager.get('statuskombi');
            var rec = st.findRecord('id', value, false, false,
                false, true);
            if (!rec) {
                return Ext.htmlEncode(value);
            }
            if (rec.get('statusLev') !== undefined
                && rec.get('statusVal') !== undefined
            ) {
                return rec.get('statusLev').lev + ' - '
                    + rec.get('statusVal').val;
            }
            return '';
        };
    },

    generateEgemColumns: function(col) {
        col.xtype = 'gridcolumn';
        col.renderer = function(value) {
            if (!value) {
                return '';
            } else {
                return Ext.htmlEncode(value);
            }
        };
    },

    generateNetzbetreiberColumns: function(col) {
        col.xtype = 'gridcolumn';
        col.renderer = function(value) {
            if (!value) {
                return '';
            } else {
                return Ext.htmlEncode(value);
            }
        };
    },

    generateDatenbasisColumns: function(col) {
        col.xtype = 'gridcolumn';
        col.renderer = function(value) {
            if (!value) {
                return '';
            }
            // var st = Ext.data.StoreManager.get('datenbasis');
            // var rec = st.findRecord('id', value, false,false,
            //     false,true);
            // if (!rec) {
            return Ext.htmlEncode(value);
            // }
            // if (rec.get('datenbasis') !== undefined) {
            //     return rec.get('datenbasis');
            // }
            // return '';
        };
    },

    generateProbenartColumns: function(col) {
        col.xtype = 'gridcolumn';
        col.renderer = function(value) {
            if (!value) {
                return '';
            }
            // var st = Ext.data.StoreManager.get('probenarten');
            // var rec = st.findRecord('id', value, false,false,
            //     false,true);
            // if (!rec) {
            return Ext.htmlEncode(value);
            // }
            // if (rec.get('datenbasis') !== undefined) {
            //     return rec.get('datenbasis');
            // }
            // return '';
        };
    },

    generateStaatColumns: function(col) {
        col.xtype = 'gridcolumn';

        col.renderer = function(value) {
            if (!value) {
                return '';
            }
            // var st = Ext.data.StoreManager.get('staaten');
            //var rec = st.findRecord('id', value, false,false,
            //    false,true);
            // if (!rec) {
            return Ext.htmlEncode(value);
            // }
            // if (rec.get('staatIso') !== undefined) {
            //     return rec.get('staatIso');
            // }
            // return '';
        };
    },

    generateStammColumn: function(col, datatype) {
        var clicklistener = null;
        var tooltip = '';

        if (datatype.name === 'probenehmer') {
            tooltip = this.i18n.getMsg('typedgrid.tooltip.probenehmer');
            clicklistener = function(button) {
                var id = Number(button.text);
                button.getEl().swallowEvent(['click', 'dblclick'], true);
                var win = Ext.create('Lada.view.window.Probenehmer', {
                    recordId: id,
                    style: 'z-index: -1;'
                });
                if (win.show()) {
                    win.setPosition(30);
                    win.loadRecord(
                        id,
                        this,
                        function(record, operation, success) {
                            if (success) {
                                win.initData(record);
                            }
                        });
                }
            };
        } else if (datatype.name === 'dsatzerz') {
            tooltip = this.i18n.getMsg('typedgrid.tooltip.dsatzerz');
            clicklistener = function(button) {
                var id = Number(button.text);
                button.getEl().swallowEvent(['click', 'dblclick'], true);
                var win = Ext.create('Lada.view.window.DatensatzErzeuger', {
                    style: 'z-index: -1;',
                    recordId: id
                });
                if (win.show()) {
                    win.setPosition(30);
                    win.loadRecord(
                        id,
                        this,
                        function(record, operation, success) {
                            if (success) {
                                win.initData(record);
                            }
                        });
                }
            };
        } else if (datatype.name === 'mprkat') {
            tooltip = this.i18n.getMsg('typedgrid.tooltip.mprkat');
            clicklistener = function(button) {
                var id = Number(button.text);
                button.getEl().swallowEvent(['click', 'dblclick'], true);
                var win = Ext.create('Lada.view.window.MessprogrammKategorie', {
                    recordId: id,
                    style: 'z-index: -1;'
                });
                if (win.show()) {
                    win.setPosition(30);
                    win.loadRecord(
                        id,
                        this,
                        function(record, operation, success) {
                            if (success) {
                                win.initData(record);
                            }
                        });
                }

            };
        }
        col.xtype = 'widgetcolumn';
        col.widget = {
            xtype: 'button',
            icon: Ext.getResourcePath(this.openIconPath, null, null),
            width: '16px',
            height: '16px',
            userCls: 'widget-column-button',
            tooltip: tooltip,
            listeners: {
                click: clicklistener,
                textchange: function(button, oldval, newval) {
                    if (!newval || newval === '') {
                        button.hide();
                    } else {
                        button.show();
                    }
                }
            }
        };
    },

    addProbeButtons: function() {
        this.addAssignTagsButton();
    },

    addMessungButtons: function() {
        this.addSetStatusButton();
        this.addAssignTagsButton();
    },

    addSetStatusButton: function() {
        if (!this.tbuttonExists('setstatus')) {
            //Disable status button if user has no status role
            var needsSelection = false;
            for (var i = 0; i < Lada.funktionen.length; i++ ) {
                if (Ext.Array.contains(this.statusUser, Lada.funktionen[i])) {
                    needsSelection = true;
                }
            }
            this.toolbarbuttons.push({
                text: this.i18n.getMsg('statusSetzen'),
                icon: 'resources/img/mail-mark-notjunk.png',
                action: 'setstatus',
                needsSelection: needsSelection,
                disabled: true
            });
        }
    },

    addAssignTagsButton: function() {
        // Only users with associated Messstelle can (un)assign tags
        if (Lada.mst.length > 0 && !this.tbuttonExists('assigntags')) {
            this.toolbarbuttons.push({
                text: this.i18n.getMsg('tag.toolbarbutton.assigntags'),
                iconCls: 'x-fa fa-tag',
                action: 'assigntags',
                needsSelection: true,
                disabled: true
            });
        }
    },

    addMessprogrammButtons: function() {
        if ( Ext.Array.contains(Lada.funktionen, 4)) {
            if (!this.tbuttonExists('setActive')) {
                var me = this;
                this.toolbarbuttons.push({
                    xtype: 'splitbutton',
                    icon: 'resources/img/dialog-ok-apply.png',
                    action: 'setActive',
                    text: this.i18n.getMsg('button.setActive'),
                    menu: new Ext.menu.Menu({
                        items: [{
                            text: me.i18n.getMsg('button.active'),
                            action: 'setActiveYes',
                            needsSelection: true
                        }, {
                            text: me.i18n.getMsg('button.notActive'),
                            action: 'setActiveNo',
                            needsSelection: true
                        }]
                    }),
                    needsSelection: true,
                    disabled: true
                });
            }
        }
        if (!this.tbuttonExists('genProbenFromMessprogramm')) {
            this.toolbarbuttons.push({
                text: this.i18n.getMsg('button.generateProben'),
                icon: 'resources/img/view-time-schedule-insert.png',
                action: 'genProbenFromMessprogramm',
                needsSelection: true,
                disabled: true
            });
        }
    },

    addOrtButtons: function() {
        if (Ext.Array.contains(Lada.funktionen, 4) && !this.tbuttonExists(
            'addMap') && this.showMap
        ) {
            this.toolbarbuttons.push({
                text: this.i18n.getMsg('orte.frommap'),
                icon: 'resources/img/svn-commit.png',
                action: 'addMap',
                needsSelection: false,
                disabled: false
            });
        }
    },

    genericAddButton: function() {
        if (
            ['probeId', 'tagId'].indexOf(this.rowtarget.dataType) >= 0 ||
            ( ['mpId', 'probenehmer', 'dsatzerz', 'mprkat', 'ortId'].indexOf(
                this.rowtarget.dataType) >= 0
                && Ext.Array.contains(Lada.funktionen, 4)
            )
        ) {
            var isProbeGrid = this.rowtarget.dataType === "probeId";
            var userHasNoMsts = Lada.mst.length == 0;
            if (!this.tbuttonExists('genericadd')) {
                this.toolbarbuttons.push({
                    text: this.i18n.getMsg('add'),
                    icon: 'resources/img/list-add.png',
                    action: 'genericadd',
                    needsSelection: false,
                    disabled: isProbeGrid && userHasNoMsts,
                });
            }
        }
        if (
            this.rowtarget.dataType === 'probeId' ||
            this.rowtarget.dataType === 'messungId'
        ) {
            this.addRowExpanderButton();
        }
    },

    genericDeleteButton: function() {
        if (
            ['probeId', 'mpId', 'ortId', 'messungId', 'tagId']
                .indexOf(this.rowtarget.dataType) >= 0 ||
            ( ['probenehmer', 'dsatzerz', 'mprkat'].indexOf(
                this.rowtarget.dataType) >= 0
                && Ext.Array.contains(Lada.funktionen, 4)
            )
        ) {
            if (!this.tbuttonExists('genericdelete')) {
                this.toolbarbuttons.push({
                    text: this.i18n.getMsg('button.deleteseleted'),
                    icon: 'resources/img/svn-update.png',
                    action: 'genericdelete',
                    needsSelection: true,
                    disabled: true
                });
            }
        }
    },

    addPrintButton: function() {
        if (this.printable && !this.tbuttonExists('print')) {
            this.toolbarbuttons.push({
                text: this.i18n.getMsg('button.print'),
                icon: 'resources/img/printer.png',
                handler: 'openPrintDialog',
                needsSelection: true,
                disabled: true
            });
        }
    },

    addExportButton: function() {
        if (this.exportable && !this.tbuttonExists('gridexport')) {
            this.toolbarbuttons.push({
                text: this.i18n.getMsg('export.button'),
                icon: 'resources/img/svn-update.png',
                action: 'gridexport',
                needsSelection: false,
                disabled: false
            });
        }
    },

    tbuttonExists: function(action) {
        for (var i = 0; i < this.toolbarbuttons.length; i++) {
            if (this.toolbarbuttons[i].action === action) {
                return true;
            }
        }
        return false;
    },

    /**
     * Reload the grid.
     * @param {Object} callback Additional callback function to call after
     * reloading
     */
    reload: function(callback) {
        var selection = this.getSelection();
        var store = this.getStore();
        var options = store.lastOptions;
        options.scope = this;
        options.callback = function() {
            this.setStore(store);
            //If map is not already rendered:
            //Wait for render, then fire reload event
            var map = this.down('map');
            if (map) {
                if (map.rendered) {
                    this.fireEvent('gridreload');
                    this.select(selection);
                } else {
                    map.onAfter(
                        'afterrender',
                        function() {
                            var querypanel = Ext.getCmp('querypanelid');
                            querypanel.fireEvent('gridreload');
                            this.select(selection);
                        },
                        this,
                        {
                            single: true,
                            //Set to minimum priority to ensure the handler is
                            //called after map panel afterrender handler
                            priority: -999
                        }
                    );
                }
            } else {
                this.select(selection);
            }
            if (callback) {
                callback();
            }
        };
        store.load(options);
    },

    /**
     * Get array of IDs of selected rows.
     */
    getSelection: function() {
        var selection = [];
        var me = this;
        this.getSelectionModel().getSelection().forEach(function(item) {
            selection.push(item.get(me.rowtarget.dataIndex));
        });
        return selection;
    },

    /**
     * Select rows by given IDs.
     */
    select: function(ids) {
        var records = [];
        var me = this;
        ids.forEach(function(id) {
            var rec = me.store.findRecord(
                me.rowtarget.dataIndex, id, false, false, false, true);
            if (rec) {
                records.push(rec);
            }
        });
        this.getSelectionModel().select(records);
    },

    addRowExpanderButton: function() {
        if (this.getRowExpander() && !this.tbuttonExists('expand')) {
            this.toolbarbuttons.push({
                xtype: 'button',
                action: 'expand',
                text: this.i18n.getMsg('grid.expandDetails'),
                handler: function(button) {
                    var grid = button.up('dynamicgrid');
                    var expander = grid.getRowExpander();
                    // for performance reasons, set a maximum for rowexpander
                    // instances which to open simultaneously in one action
                    var maxEntries = 100;
                    if ( grid.store.data.length <= maxEntries ) {
                        var newStatus = expander.toggleAllRows();
                        if (!newStatus) {
                            button.setText(
                                grid.i18n.getMsg('grid.expandDetails'));
                        } else {
                            button.setText(
                                grid.i18n.getMsg('grid.unexpandDetails'));
                        }
                    } else {
                        Ext.Msg.alert(' ',
                            grid.i18n.getMsg('err.pagingsize', maxEntries));
                    }
                }
            });
        }
    },

    getRowExpander: function() {
        if (!this.plugins) {
            return;
        }
        for (var i = 0; i < this.plugins.length; i++) {
            if (this.plugins[i].ptype === 'gridrowexpander') {
                return this.plugins[i];
            }
        }
    },

    /**
     * Get filter values as readable strings in a map.
     * @return {Ext.util.HashMap} A map containg the filter values using the
     * respective dataindex as key
     */
    getFilterValues: function() {
        var i18n = Lada.getApplication().bundle;
        var filterMap = Ext.create('Ext.util.HashMap');
        //Get fieldsets containing the filter widgets
        var filters = Ext.ComponentQuery.query(
            'panel[name=filtervalues]')[0].items.items;
        if (!filters) {
            return filterMap;
        }
        Ext.Array.each(filters, function(item) {
            var widget = item.down('component[name=' + item.dataIndex + ']');
            //Get readable value depending on the widget type
            var datefield, value;
            switch (Ext.getClassName(widget)) {
                case 'Lada.view.widget.base.DateField':
                    datefield = widget.down('datefield');
                    value = datefield.getValue();
                    filterMap.add(item.dataIndex, value);
                    break;
                case 'Lada.view.widget.base.Datetime':
                    datefield = widget.down('datetime');
                    value = datefield.getValue();
                    filterMap.add(item.dataIndex, value);
                    break;
                case 'Lada.view.widget.base.DateTimeRange':
                    var fromField = widget.down(
                        'component[name=' + item.dataIndex + 'From]');
                    var toField = widget.down(
                        'component[name=' + item.dataIndex + 'To]');
                    var fromValue = Lada.util.Date.formatTimestamp(
                        fromField.getValue(), 'DD.MM.YYYY HH:mm');
                    var toValue = Lada.util.Date.formatTimestamp(
                        toField.getValue(), 'DD.MM.YYYY HH:mm');
                    if (toValue !== null) {
                        filterMap.add(
                            item.dataIndex,
                            i18n.getMsg('print.daterange', fromValue, toValue));
                    } else {
                        filterMap.add(item.dataIndex, fromValue);
                    }
                    break;
                case 'Lada.view.widget.TagFilter':
                    // Join values of both tagwidgets
                    value = widget.down('tagwidget[name=' + item.dataIndex + ']')
                        .getDisplayValue();
                    var readonly = widget.down('tagwidget[name=readonly]')
                        .getDisplayValue();
                    if (value) {
                        value += readonly ? ',' + readonly : '';
                    } else {
                        value = readonly;
                    }
                    filterMap.add(item.dataIndex, value);
                    break;
                default:
                    //Widget can be a textfield or a combobx
                    var displayValue;
                    if (widget.down('combobox')) {
                        displayValue = widget.down('combobox')
                            .getDisplayValue();
                    } else if (widget.down('textfield')) {
                        displayValue = widget.down('textfield').getValue();
                    }
                    filterMap.add(item.dataIndex, displayValue);
            }
        });
        return filterMap;
    }
});

