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
        'Lada.view.window.Map',
        'Ext.grid.column.Widget',
        'Lada.view.grid.Messung',
        'Lada.view.grid.Messwert',
        'Lada.view.plugin.GridRowExpander'
    ],

    store: null,

    /** toggle for the button and option "print grid"*/
    printable: true,

    /** toggle for the button and option "export data"*/
    exportable: true,

    /** additional non-generic buttons */
    toolbarbuttons: [],

    /** The untranslated i18n-Message for a grid title*/
    title: null,

    border: false,
    multiSelect: true,
    allowDeselect: true,
    sortable: false,

    // the dataType to be used on generic doubleclik/add/delete buttons.
    rowHierarchy: ['messungId', 'probeId', 'mpId', 'ortId'],
    rowtarget: null,

    isDynamic: true,

    viewConfig: {
        deferEmptyText: false
    },

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg(this.emptyText);
        this.selModel = Ext.create('Ext.selection.CheckboxModel', {
            checkOnly: true,
            injectCheckbox: 1
        });
        this.callParent(arguments);
    },

    setToolbar: function() {
        var i18n = Lada.getApplication().bundle;
        var tbcontent = [];
        if (this.title) {
            this.title = i18n.getMsg(this.title);
        }
        tbcontent.push('->');
        if (this.toolbarbuttons && this.toolbarbuttons.length) {
            for (var i= 0; i < this.toolbarbuttons.length; i++) {
                tbcontent.push(this.toolbarbuttons[i]);
            }
        }

        if (this.printable) {
            tbcontent.push({
                text: i18n.getMsg('button.print'),
                icon: 'resources/img/printer.png',
                action: 'print',
                needsSelection: true,
                disabled: true
            });
        }
        if (this.exportable) {
            tbcontent.push({
                text: i18n.getMsg('export.button'),
                icon: 'resources/img/svn-update.png',
                action: 'gridexport',
                needsSelection: true,
                disabled: true
            });
        }

        //generic "add" button
        if (this.rowtarget.dataType === 'probeId' ||
            ( this.rowtarget.dataType === 'mpId' && Ext.Array.contains(
                Lada.funktionen, 4))) {
            tbcontent.push({
                text: i18n.getMsg('button.addselected'),
                icon: 'resources/img/svn-update.png',
                action: 'genericadd',
                needsSelection: true,
                disabled: false
            });
        }

        // generic 'delete' button
        if (this.rowtarget.dataType === 'probeId' ||
            ( this.rowtarget.dataType === 'mpId' && Ext.Array.contains(
                Lada.funktionen, 4))) {
            tbcontent.push({
                text: i18n.getMsg('add'),
                icon: 'resources/img/svn-update.png',
                action: 'genericdelete',
                needsSelection: true,
                disabled: true
            });
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
        var cbox = Ext.create('Lada.view.widget.PagingSize');
        this.down('pagingtoolbar').add('-');
        this.down('pagingtoolbar').add(cbox);


    },

    /**
     * Setup columns of the Grid dynamically.
     * @param data The result of a search request //TODO
     * @param columnstore: store with currently available Lada.model.Column
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

        if (this.rowtarget.dataType === 'probeId') {
            this.addPlugin({
                ptype: 'gridrowexpander',
                gridType: 'Lada.view.grid.Messung',
                idRow: this.rowtarget.dataIndex,
                expandOnDblClick: false,
                gridConfig: {
                    bottomBar: false
                }
            });
        } else if (this.rowtarget.dataType === 'messungId') {
            this.addPlugin({
                ptype: 'gridrowexpander',
                gridType: 'Lada.view.grid.Messwert',
                idRow: this.rowtarget.dataIndex,
                expandOnDblClick: false,
                gridConfig: {
                    bottomBar: false
                }
            });
        }
        this.setToolbar();
    },

    /**
     * generateColumnsAndFields
     * generates an array of columns which are used for the dynamic grid
     * @return an array of two arrays: [0] is an array of colums [1] an array
     *   of fields
     **/
    generateColumnsAndFields: function(current_columns, fixedColumnStore) {
        this.toolbarbuttons = [];
        this.column_definitions = [];
        this.rowtarget = {};
        var resultColumns = [];
        var fields = [];
        var i18n = Lada.getApplication().bundle;
        fields.push(new Ext.data.Field({
            name: 'readonly'
        }));

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
                }
                return 'noedit';
            },
            handler: function(grid, rowIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                grid.fireEvent('itemdblclick', grid, rec);
            }
        });

        var cc = current_columns.getData().items;
        for (var i = 0; i < cc.length; i++) {
            if (cc[i].get('visible') !== true) {
                continue;
            }
            var col = {}; //TODO dataIndex Model etc?
            var orig_column = fixedColumnStore.findRecord(
                'id', cc[i].get('gridColumnId'), false, false, false, true);
            this.column_definitions.push(orig_column);
            col.dataIndex = orig_column.get('dataIndex');
            col.text = orig_column.get('name');
            col.maxWidth = orig_column.get('width');
            col.sortable = false;
            //Check column type and set to string if unknown
            var datatype = orig_column.get('dataType');
            if (!datatype) {
                datatype = {name: 'text'};
            }
            var curField = {
                dataIndex: orig_column.get('dataIndex'),
                name: orig_column.get('name')
            };
            var openIconPath = 'img/document-open.png';
            var colImg = null;
            //TODO: Use proper icons
            this.setrowtarget(col.dataIndex, datatype.name);
            switch (datatype.name) {
                case 'probeId':
                    this.toolbarbuttons.push({
                        text: i18n.getMsg('button.import'),
                        icon: 'resources/img/svn-commit.png',
                        action: 'importprobe',
                        needsSelection: false,
                        disabled: false
                    });
                    this.toolbarbuttons.push({
                        text: i18n.getMsg('button.printsheet'),
                        icon: 'resources/img/printer.png',
                        action: 'printSheet',
                        needsSelection: true,
                        disabled: true
                    });
                    colImg = Ext.getResourcePath(openIconPath, null, null);
                    col.xtype = 'widgetcolumn';
                    col.widget = {
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
                                button.getEl().swallowEvent(['click', 'dblclick'], true);
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
                                if (!newval || newval === '') {
                                    button.hide();
                                } else {
                                    button.show();
                                }
                            }
                        }
                    };
                    break;
                case 'messungId':
                    this.toolbarbuttons.push({
                        text: i18n.getMsg('statusSetzen'),
                        icon: 'resources/img/mail-mark-notjunk.png',
                        action: 'setstatus',
                        needsSelection: true,
                        disabled: true
                    });
                    colImg = Ext.getResourcePath(openIconPath, null, null);
                    col.xtype = 'widgetcolumn';
                    col.widget = {
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
                                button.getEl().swallowEvent(['click', 'dblclick'], true);
                                Lada.model.Messung.load(id, {
                                    scope: this,
                                    callback: function(record, operation, success) {
                                        if (success) {
                                            var messungRecord = record;
                                            Lada.model.Probe.load(messungRecord.get('probeId'), {
                                                scope: this,
                                                callback: function(precord, poperation, psuccess) {
                                                    var win = Ext.create('Lada.view.window.MessungEdit', {
                                                        probe: precord,
                                                        record: record,
                                                        style: 'z-index: -1;'
                                                    });
                                                    win.initData();
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
                    };
                    break;
                case 'mpId':
                    this.toolbarbuttons.push({
                        text: i18n.getMsg('messprogramme.button.create'),
                        icon: 'resources/img/list-add.png',
                        action: 'addMessprogramm',
                        needsSelection: false,
                        disabled: true
                    });
                    this.toolbarbuttons.push({
                        text: i18n.getMsg('messprogramme.button.generate'),
                        icon: 'resources/img/view-time-schedule-insert.png',
                        action: 'genProbenFromMessprogramm',
                        needsSelection: true,
                        disabled: true
                    });
                    colImg = Ext.getResourcePath(openIconPath, null, null);
                    col.xtype = 'widgetcolumn';
                    col.widget = {
                        xtype: 'button',
                        icon: colImg,
                        width: '16px',
                        height: '16px',
                        userCls: 'widget-column-button',
                        tooltip: i18n.getMsg('typedgrid.tooltip.mprid'),
                        hidden: true,
                        listeners: {
                            click: function(button) {
                                var id = button.getText();
                                button.getEl().swallowEvent(['click', 'dblclick'], true);
                                Lada.model.Messprogramm.load(id, {
                                    success: function(record) {
                                        var win = Ext.create(
                                            'Lada.view.window.Messprogramm', {
                                                record: record});
                                        win.show();
                                    }
                                });
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
                    break;
                case 'ortId':
                    colImg = Ext.getResourcePath(openIconPath, null, null);
                    col.xtype = 'widgetcolumn';
                    col.widget = {
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
                                button.getEl().swallowEvent(['click', 'dblclick'], true);
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
                                if (!newval || newval === '') {
                                    button.hide();
                                } else {
                                    button.show();
                                }
                            }
                        }
                    };
                    break;
                case 'geom':
                    colImg = Ext.getResourcePath('img/document-open.png', null, null);
                    col.xtype = 'widgetcolumn';
                    col.widget = {
                        xtype: 'button',
                        icon: colImg,
                        width: '16px',
                        height: '16px',
                        userCls: 'widget-column-button',
                        tooltip: i18n.getMsg('typedgrid.tooltip.geometry'),
                        hidden: true,
                        listeners: {
                            click: function(button) {
                                button.getEl().swallowEvent(['click', 'dblclick'], true);
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
                    };
                    break;
                case 'date':
                    curField.depends = orig_column.dataIndex;

                    col.xtype = 'datecolumn';
                    col.format = orig_column.get('dataType').format;
                    col.renderer = function(value, cell) {
                        if (!value || value === '') {
                            return '';
                        }
                        var format = cell.column.format;
                        var dt='';
                        if (!isNaN(value)) {
                            dt = Ext.Date.format(new Date(value), format);
                        }
                        return dt;
                    };

                    break;
                case 'number':
                    col.xtype = 'numbercolumn';
                    col.format = orig_column.get('dataType').format;
                    col.renderer = function(value, cell) {
                        if (!value) {
                            return '';
                        }
                        var format = cell.column.format;
                        if (format === 'e') {
                            return value.toExponential();
                        } else {
                            return Ext.util.Format.number(value, format);
                        }
                    };
                    break;
                case 'boolean':
                    col.xtype='gridcolumn';
                    col.renderer = function(value) {
                        if (value === true) {
                            return i18n.getMsg('true');
                        } else if (value === false) {
                            return i18n.getMsg('false');
                        } else {
                            return '';
                        }
                    };
                    break;
                case 'statusstfe':
                    col.xtype='gridcolumn';
                    var st = Ext.data.StoreManager.get('statusstufe');
                    if (!st) {
                        st = Ext.create('Lada.store.StatusStufe', {
                            storeId: 'statusstufe',
                            autoLoad: true
                        });
                    }
                    col.renderer = function(value) {
                        var rec = st.findRecord('id', value, false,false,
                            false,true);
                        if (rec.get('stufe') !== undefined) {
                            return rec.get('stufe');
                        }
                        return '';
                    };
                    break;
                case 'umwbereich':
                    col.xtype='gridcolumn';
                    var st = Ext.data.StoreManager.get('umwelt');
                    if (!st) {
                        st = Ext.create('Lada.store.Umwelt', {
                            storeId: 'umwelt',
                            autoload: true
                        });
                    }
                    col.renderer = function(value) {
                        var rec = st.findRecord('id', value, false,false,
                            false,true);
                        if (rec.get('umweltBereich') !== undefined) {
                            return rec.get('umweltBereich');
                        }
                        return '';
                    };
                    break;
                case 'status':
                    col.xtype='gridcolumn';
                    var st = Ext.data.StoreManager.lookup('statuswerte');
                    if (!st) {
                        st =Ext.create('Lada.store.StatusWerte', {
                            storeId: 'statuswerte',
                            autoLoad: true
                        });
                    }
                    col.renderer = function(value) {
                        var rec = st.findRecord('id', value, false,false,
                            false,true);
                        if (rec.get('wert') !== undefined) {
                            return rec.get('wert');
                        }
                        return '';
                    };
                    break;
                case 'egem':
                    col.xtype='gridcolumn';
                    var st = Ext.data.StoreManager.get(
                        'verwaltungseinheitenwidget');
                    if (!st) {
                        st = Ext.create(
                            'Lada.store.VerwaltungseinheitenUnfiltered', {
                            storeId: 'verwaltungseinheitenwidget'
                        });
                    }
                    col.renderer = function(value) {
                        var rec = st.findRecord('id', value, false, false,
                            false, true);
                        if (rec && rec.get('bezeichnung') !== undefined) {
                            return rec.get('bezeichnung');
                        }
                        return '';
                    };
                    break;
                case 'netzbetr':
                    col.xtype='gridcolumn';
                    var st = Ext.data.StoreManager.get('netzbetreiber');
                    if (!st) {
                        st = Ext.create('Lada.store.Netzbetreiber', {
                            storeId: 'netzbetreiber'
                        });
                    }
                    col.renderer = function(value) {
                        var rec = st.findRecord('id', value, false,false,
                            false,true);
                        if (rec.get('netzbetreiber') !== undefined) {
                            return rec.get('netzbetreiber');
                        }
                        return '';
                    };
                    break;
                case 'datenbasis':
                    col.xtype='gridcolumn';

                    var st = Ext.data.StoreManager.get('datenbasis');
                    if (!st) {
                        st = Ext.create('Lada.store.Datenbasis', {
                            storeId: 'datenbasis'
                        });
                    }
                    col.renderer = function(value) {
                        var rec = st.findRecord('id', value, false,false,
                            false,true);
                        if (rec.get('datenbasis') !== undefined) {
                            return rec.get('datenbasis');
                        }
                        return '';
                    };
                    break;
                case 'probenart':
                    col.xtype='gridcolumn';
                    var st = Ext.data.StoreManager.lookup('probenarten');
                    if (!st) {
                        st = Ext.create('Lada.store.Probenarten', {
                            storeId: 'probenarten'
                        });
                    }
                    col.renderer = function(value) {
                        var rec = st.findRecord('id', value, false,false,
                            false,true);
                        if (rec.get('datenbasis') !== undefined) {
                            return rec.get('datenbasis');
                        }
                        return '';
                    };
                    break;

                case 'staat':
                    col.xtype='gridcolumn';
                    var st = Ext.data.StoreManager.lookup('staaten');
                    if (!st) {
                        st = Ext.create('Lada.store.Staaten', {
                            storeId: 'staaten'
                        });
                    }
                    col.renderer = function(value) {
                        var rec = st.findRecord('id', value, false,false,
                            false,true);
                        if (rec.get('staatIso') !== undefined) {
                            return rec.get('staatIso');
                        }
                        return '';
                    };
                    break;
                default:
                    col.xtype = 'gridcolumn';
                    col.renderer = function(value) {
                        return value || '';
                    };
            }
            fields.push(curField);
            col.hideable = false;
            col.draggable = false;
            resultColumns.push(col);
        }
        var caf = new Array();
        caf[0] = resultColumns;
        caf[1] = fields;
        return caf;
    },

    setrowtarget: function(dataIndex, datatypename) {
        if (this.rowHierarchy.indexOf(datatypename) < 0) {
            return false;
        }

        if (!this.rowtarget.hasOwnProperty('dataType')) {
            this.rowtarget = {
                dataType: datatypename,
                dataIndex: dataIndex
            };
            return true;
        } else {
            var currentIndex = this.rowHierarchy.indexOf(
                this.rowtarget.dataType);
            var newIndex = this.rowHierarchy.indexOf(datatypename);
            if (newIndex < currentIndex) {
                this.rowtarget = {
                    dataType: datatypename,
                    dataIndex: dataIndex
                };
            }

            return true;
        }
    }
});

