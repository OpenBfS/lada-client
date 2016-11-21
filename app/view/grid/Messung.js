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
    extend: 'Ext.grid.Panel',
    alias: 'widget.messunggrid',

    maxHeight: 350,
    emptyText: 'Keine Messungen gefunden',
    minHeight: 44,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 15, 5',

    recordId: null,

    warnings: null,
    errors: null,
    readOnly: true,
    bottomBar: true,
    allowDeselect: true,

    initComponent: function() {
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: 'Hinzufügen',
                icon: 'resources/img/list-add.png',
                action: 'add',
                probeId: this.probeId
            }, {
                text: 'Löschen',
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
            getClass: function (val, meta, rec) {
                if (rec.get('readonly') === false) {
                        return 'edit';
                }
                return 'noedit';
            },
            handler: function(grid, rowIndex, colIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                grid.fireEvent('itemdblclick', grid, rec);
            }
        }, {
            header: 'Nebenproben-Nr.',
            dataIndex: 'nebenprobenNr',
            flex: 1,
            editor: {
                allowBlank: false
            }
        }, {
            header: 'MMT',
            dataIndex: 'mmtId',
            flex: 1,
            editor: {
                allowBlank: false
            }
        }, {
            header: 'Messzeit',
            dataIndex: 'messzeitpunkt',
            xtype: 'datecolumn',
            format: 'd.m.Y H:i',
            flex: 2,
            editor: {
                xtype: 'datefield',
                allowBlank: false,
                format: 'd.m.Y H:i',
                // minValue: '01.01.2001', //todo: gibt es das?
                // minText: 'Das Datum der Messung darf nicht vor dem 01.01.2001 liegen.',
                maxValue: Ext.Date.format(new Date(), 'd.m.Y H:i')
            }
        }, {
            header: 'Status',
            flex: 1,
            dataIndex: 'statusKombi',
            renderer: function(value, meta, record, rNdx, cNdx) {
                var statusId = record.get('status');
                var mId = record.get('id');
                //also fwd the record to the asynchronous loading of statuswerte
                // in order to add the statuswert to the record,
                // after the grid was rendered...
                if (!value || value === '') {
                    this.updateStatus(mId, statusId, record);
                    return 'Lade...';
                }
                var kombis = Ext.data.StoreManager.get('statuskombi');
                var kombi = kombis.getById(value);
                var st = kombi.raw.statusWert.wert
                return st;
            }
        }, {
            header: 'Stufe',
            flex: 1,
            dataIndex: 'statusKombi',
            renderer: function(value, meta, record, rNdx, cNdx) {
                var statusId = record.get('status');
                var mId = record.get('id');
                //also fwd the record to the asynchronous loading of statuswerte
                // in order to add the statuswert to the record,
                // after the grid was rendered...
                if (!value || value === '') {
                    this.updateStatus(mId, statusId, record);
                    return 'Lade...';
                }
                var kombis = Ext.data.StoreManager.get('statuskombi');
                var kombi = kombis.getById(value);
                var st = kombi.raw.statusStufe.stufe
                return st;
            }
        }, {
            header: 'OK-Flag',
            dataIndex: 'fertig',
            flex: 1,
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
            header: 'Anzahl Nuklide',
            // Gibt die Anzahl der Messwerte wieder,
            // NICHT die Anzahl der verschiedenen Nukleide
            // Eventuell ist die Bezeichnug daher irreführend
            dataIndex: 'messwerteCount',
            flex: 1,
            renderer: function(value, meta, record) {
                if (value === '') {
                    var mId = record.get('id');
                    this.updateNuklide(mId, record);
                    return 'Lade...';
                }
                return value;
            }
        }, {
            header: 'Anzahl Kommentare',
            flex: 1,
            dataIndex: 'kommentarCount',
            renderer: function(value, meta, record) {
                if (value === '') {
                    var mId = record.get('id');
                    this.updateKommentare(mId, record);
                    return 'Lade...';
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
        this.initData();
        this.callParent(arguments);
        if (!this.bottomBar) {
            this.down('toolbar[dock=bottom]').hide();
        }
        this.setReadOnly(true); //Grid is always initialised as RO
    },

    initData: function() {
        this.setLoading(true);
        this.store = Ext.create('Lada.store.Messungen');
        this.store.load({
            params: {
                probeId: this.recordId
            },
            callback: function (records, operation, success) {
                this.setLoading(false);
            },
            scope: this
        });
    },

    /**
     * Load the statusstore,
     * afterwards: retrieve the statusid
     */
    updateStatus: function(value, statusId, record) {
        var statusStore = Ext.create('Lada.store.Status');
        statusStore.on('load',
            this.updateStatusColumn,
            this,
            {statusId: statusId, record: record});
        statusStore.load({
            params: {
                messungsId: value
            }
        });
    },

    updateNuklide: function(id, record) {
        var messwerte = Ext.create('Lada.store.Messwerte');
        messwerte.on('load',
            this.updateColumn,
            this,
            {record: record, type: 'messwerteCount'});
        messwerte.load({
            params: {
                messungsId: id
            }
        });
    },

    updateKommentare: function(id, record) {
        var kommentare = Ext.create('Lada.store.MKommentare');
        kommentare.on('load',
            this.updateColumn,
            this,
            {record: record, type: 'kommentarCount'});
        kommentare.load({
            params: {
                messungsId: id
            }
        });
    },

    updateColumn: function(store, record, success, opts) {
        var value;
        if (success) {
            if (store.getTotalCount() === 0) {
                value = '0';
            }
            else {
                value = store.getTotalCount();
            }
        }
        else {
            value = '-';
        }
        opts.record.beginEdit();
        opts.record.set(opts.type, value);
        opts.record.endEdit();
    },

    /**
     * Retrieve Statuswert and update the column
     */
    updateStatusColumn: function(sstore, record, success, opts) {
        var value = 0;
        if (sstore.getTotalCount() === 0 || !opts.statusId) {
            value = 0;
        }
        else {
            var rec = sstore.getById(opts.statusId);
            if (rec) {
                value = rec.get('statusKombi');
                //add the determined statuswert to the record.
                // this is necessary to let the controller determine
                // which actions are allowed.
                opts.record.beginEdit();
                opts.record.set('statusKombi', value);
                opts.record.endEdit();
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
        }
        else {
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
            record.get('statusWert') === 0 &&
            record.get('owner')) {
            grid.down('button[action=delete]').enable();
        }
    },
    /**
     * Activate the Remove Button
     */
    deactivateRemoveButton: function(selection, record) {
        var grid = this;
        //only enable the remove buttone, when the grid is editable.
        if (! grid.readOnly) {
            grid.down('button[action=delete]').disable();
        }
    }
});
