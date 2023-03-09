/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Messungen
 */
Ext.define('Lada.view.grid.Messung', {
    extend: 'Lada.view.grid.BaseGrid',
    alias: 'widget.messunggrid',
    requires: [
        'Lada.store.Messungen',
        'Lada.store.Status',
        'Lada.store.Messwerte'
    ],

    maxHeight: 350,
    minHeight: 44,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 15, 5',

    warnings: null,
    errors: null,
    readOnly: true,
    bottomBar: true,
    allowDeselect: true,

    ignoreNextDblClick: false,

    lastClickTime: 0,

    messwerteLoading: false,

    initComponent: function() {
        this.store = Ext.create('Lada.store.Messungen');

        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.emptyText = i18n.getMsg('emptytext.messungen');
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: i18n.getMsg('add'),
                icon: 'resources/img/list-add.png',
                action: 'add',
                probeId: this.probeId
            }, {
                text: i18n.getMsg('delete'),
                icon: 'resources/img/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = [{
            xtype: 'actioncolumn',
            text: '',
            dataIndex: 'readonly',
            sortable: false,
            width: 30,
            getClass: function(val, meta, rec) {
                if (rec.get('readonly') === false) {
                    return 'edit';
                }
                return 'noedit';
            },
            handler: function(grid, rowIndex, colIndex, item, event) {
                var eventInst = event.browserEvent;
                var rec = grid.getStore().getAt(rowIndex);
                //Check if event is a pointer event
                if (eventInst instanceof PointerEvent) {
                    //We are using IE11
                    var lastTimeStamp = me.lastClickTime;
                    me.lastClickTime = eventInst.timeStamp;
                    if (
                        eventInst.timeStamp - lastTimeStamp >
                            Lada.$application.dblClickTimeout
                    ) {
                        grid.fireEvent('itemdblclick', grid, rec);
                    } else {
                        grid.ignoreNextDblClick = true;
                    }
                } else if (eventInst instanceof MouseEvent) {
                    //We are in chrome/firefox etc.
                    //Check if its not the second click of a doubleclick
                    if (event.browserEvent.detail === 1) {
                        grid.fireEvent('itemdblclick', grid, rec);
                    } else if (event.browserEvent.detail) {
                        //else tell the grid to ignore the next doubleclick as
                        // the edit window should already be open
                        grid.ignoreNextDblClick = true;
                    }
                }
            }
        }, {
            header: i18n.getMsg('measm.ext_id'),
            dataIndex: 'extId',
            flex: 0.7,
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('nebenprobenNr'),
            dataIndex: 'minSampleId',
            flex: 0.8,
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('mmt_id'),
            dataIndex: 'mmtId',
            flex: 1,
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('measm_start_date'),
            dataIndex: 'measmStartDate',
            xtype: 'datecolumn',
            format: 'd.m.Y H:i',
            flex: 2,
            editor: {
                xtype: 'datefield',
                allowBlank: false,
                format: 'd.m.Y H:i',
                maxValue: Lada.util.Date.formatTimestamp(
                    new Date(), 'd.m.Y H:i', true)
            },
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var format = 'd.m.Y H:i';
                var dt = '';
                if (!isNaN(value)) {
                    dt = Lada.util.Date.formatTimestamp(value, format, true);
                }
                return dt;
            }
        }, {
            header: i18n.getMsg('header.statuskombi'),
            flex: 2,
            dataIndex: 'statusKombi',
            renderer: function(value, meta, record) {
                var statusId = record.get('status');
                var mId = record.get('id');
                //also fwd the record to the async loading of statuswerte
                // in order to add the statuswert to the record,
                // after the grid was rendered...
                if (!value || value === '') {
                    // the loading happens in linked 'status' column
                    this.updateStatus(mId, statusId, record);
                    return 'Lade...';
                }
                var kombis = Ext.data.StoreManager.get('statuskombi');
                var kombi = kombis.getById(value);
                var st = kombi.get('statusLev').lev + ' - '
                            + kombi.get('statusVal').val;
                return st;
            }
        }, {
            header: i18n.getMsg('header.fertig'),
            dataIndex: 'isCompleted',
            flex: 0.8,
            renderer: function(value) {
                if (value) {
                    return 'Ja';
                }
                return 'Nein';
            },
            editor: {
                xtype: 'checkboxfield',
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('number_of_nuclids'),
            // Gibt die Anzahl der Messwerte wieder,
            // NICHT die Anzahl der verschiedenen Nukleide
            // Eventuell ist die Bezeichnug daher irreführend
            dataIndex: 'messwerteCount',
            flex: 1,
            renderer: function(value, meta, record) {
                if (
                    (!value || value === '') &&
                    this.messwerteLoading === false
                ) {
                    var mId = record.get('id');
                    this.updateNuklide(mId, record);
                    return 'Lade...';
                } else {
                    this.messwerteLoading = false;
                }
                return value;
            }
        }];
        this.listeners = {
            select: {
                fn: this.activateRemoveButton,
                scope: this
            },
            deselect: {
                fn: this.deactivateRemoveButton,
                scope: this
            }
        };
        this.callParent(arguments);
        if (!this.bottomBar) {
            this.down('toolbar[dock=bottom]').hide();
        }
        this.setReadOnly(true); //Grid is always initialised as RO
    },

    initData: function() {
        this.setLoading(true);
        var parentId = this.getParentRecordId();
        if (parentId) {
            this.store.load({
                params: {
                    sampleId: parentId
                },
                callback: function() {
                    this.setLoading(false);
                },
                scope: this
            });
        }
        Ext.on('timezonetoggled', function() {
            var grid = Ext.ComponentQuery.query('messunggrid');
            for (i=0; i<grid.length; i++) {
                grid[i].reload(function() {
                    Ext.ComponentQuery.query(
                        'timezonebutton[action=toggletimezone]')[0]
                        .requestFinished();
                });
            }
        });
    },

    /**
     * Reload this grid
     */
    reload: function() {
        this.hideReloadMask();
        this.store.reload();
    },

    /**
     * Load the statusstore,
     * afterwards: retrieve the statusid
     */
    updateStatus: function(value, statusId, record) {
        var statusStore = Ext.create('Lada.store.Status');
        statusStore.onAfter({
            load: {
                fn: this.updateStatusColumn,
                scope: this,
                options: {statusId: statusId, record: record}
            }
        });
        statusStore.load({
            params: {
                measmId: value
            }
        });
    },

    updateNuklide: function(id, record) {
        var messwerte = Ext.create('Lada.store.Messwerte');
        var me = this;
        me.messwerteLoading = true;
        /*messwerte.onAfter('load',
            this.updateColumn,
            this,
            {record: record, type: 'messwerteCount'});*/
        messwerte.load({
            params: {
                measmId: id
            },
            callback: function(records, operation, success) {
                me.updateColumn(
                    messwerte,
                    record,
                    success,
                    operation,
                    {record: record, type: 'messwerteCount'}
                );
            }
        });
    },

    updateColumn: function(store, record, success, operation, opts) {
        var value;
        if (success) {
            var amount = store.count();
            if ( amount === 0 ) {
                value = '0';
            } else {
                value = amount;
            }
        } else {
            value = '-';
        }
        opts.record.beginEdit();
        opts.record.set(opts.type, value);
        opts.record.endEdit();
    },

    /**
     * Retrieve Statuswert and update the column
     */
    updateStatusColumn: function(sstore, record, success, operation, options) {
        var opts = options.options;
        var value = 0;
        if (sstore.getTotalCount() === 0 || !opts.statusId) {
            value = 0;
        } else {
            var rec = sstore.getById(opts.statusId);
            if (rec) {
                value = rec.get('statusMpId');
                //add the determined statuswert to the record.
                // this is necessary to let the controller determine
                // which actions are allowed.
                opts.record.beginEdit();
                opts.record.set('statusKombi', value);
                opts.record.endEdit();
                opts.record.commit();
            }
        }
    },

    setReadOnly: function(b) {
        this.readOnly = b;
        if (b === true) {
            //Readonly
            if (this.getPlugin('rowedit')) {
                this.getPlugin('rowedit').disable();
            }
            this.down('button[action=delete]').disable();
            this.down('button[action=add]').disable();
        } else {
            //Writable
            if (this.getPlugin('rowedit')) {
                this.getPlugin('rowedit').enable();
            }
            //this.down('button[action=delete]').enable();
            //always disabled, unless a row was selected
            this.down('button[action=add]').enable();
        }
    },
    /**
     * Activate the Remove Button
     */
    activateRemoveButton: function(selection, record) {
        var grid = this;
        //only enable the remove buttone, when the grid is editable.
        if (! grid.readOnly &&
            record.get('statusKombi') === 1 &&
            record.get('owner')) {
            grid.down('button[action=delete]').enable();
        }
    },
    /**
     * Activate the Remove Button
     */
    deactivateRemoveButton: function() {
        var grid = this;
        //only enable the remove buttone, when the grid is editable.
        if (! grid.readOnly) {
            grid.down('button[action=delete]').disable();
        }
    }
});
