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
    mixins: ['Lada.view.mixins.StatusKombi'],
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
            flex: 0.5,
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('minSampleId'),
            dataIndex: 'minSampleId',
            flex: 0.5,
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('mmt_id'),
            dataIndex: 'mmtId',
            flex: 0.5,
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('measm_start_date'),
            dataIndex: 'measmStartDate',
            xtype: 'datecolumn',
            format: 'd.m.Y H:i',
            flex: 1.2,
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
            header: i18n.getMsg('statusMp'),
            flex: 2,
            dataIndex: 'statusMp',
            renderer: function(value, meta, record) {
                var kombi = this.determineKombi(record);
                var st = kombi.get('statusLev').lev + ' - '
                            + kombi.get('statusVal').val;
                return Ext.htmlEncode(st);
            }
        }, {
            header: i18n.getMsg('isCompleted'),
            dataIndex: 'isCompleted',
            flex: 0.6,
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
                    (!value || value === '')
                ) {
                    var mId = record.get('id');
                    this.updateNuklide(mId, record);
                    return 'Lade...';
                }
                return Ext.htmlEncode(value);
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

    initData: function(parentId) {
        this.setLoading(true);
        parentId = parentId ? parentId : this.getParentRecordId();
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
            for (var i = 0; i < grid.length; i++) {
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

    updateNuklide: function(id, record) {
        var messwerte = Ext.create('Lada.store.Messwerte');
        var me = this;
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
        var editableGrid = !this.readOnly;
        var isEditableRecord = record.getStatusProt().get('statusMpId') === 1;
        var hasOwner = record.get('owner');
        if (editableGrid && isEditableRecord && hasOwner) {
            this.down('button[action=delete]').enable();
        }
    },
    /**
     * Dectivate the Remove Button
     */
    deactivateRemoveButton: function() {
        this.down('button[action=delete]').disable();
    }
});
