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
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 5, 5',

    recordId: null,

    warnings: null,
    errors: null,
    readOnly: true,
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
            header: 'Mess-ID',
            dataIndex: 'id',
            flex: 1,
            editor: {
                allowBlank: false
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
            dataIndex: 'id',
            renderer: function(value) {
                var statusId = this.store.getById(value).get('status');
                var divId = 'messung-status-item' + value;
                this.updateStatus(value, divId, statusId);
                return '<div id="' + divId + '">Lade...</div>';
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
            dataIndex: 'id',
            flex: 1,
            renderer: function(value) {
                var id = 'messung-nuklid-item' + value;
                this.updateNuklide(value, id);
                return '<div id="' + id + '">Lade...</div>';
            }
        }, {
            header: 'Anzahl Kommentare',
            flex: 1,
            dataIndex: 'id',
            renderer: function(value) {
                var id = 'messung-kommentar-item' + value;
                this.updateKommentare(value, id);
                return '<div id="' + id + '">Lade...</div>';
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
        this.setReadOnly(true); //Grid is always initialised as RO
    },

    initData: function() {
        this.store = Ext.create('Lada.store.Messungen');
        this.store.load({
            params: {
                probeId: this.recordId
            }
        });
    },

    /**
     * Load the statusstore,
     * afterwards: retrieve the statusid
     */
    updateStatus: function(value, divId, statusId) {
        var statusStore = Ext.create('Lada.store.Status');
        statusStore.on('load',
            this.updateStatusColumn,
            this,
            {divId: divId, statusId: statusId});
        statusStore.load({
            params: {
                messungsId: value
            }
        });
    },

    updateNuklide: function(value, divId) {
        var messwerte = Ext.create('Lada.store.Messwerte');
        messwerte.on('load',
            this.updateColumn,
            this,
            {divId: divId});
        messwerte.load({
            params: {
                messungsId: value
            }
        });
    },

    updateKommentare: function(value, divId) {
        var kommentare = Ext.create('Lada.store.MKommentare');
        kommentare.on('load',
            this.updateColumn,
            this,
            {divId: divId});
        kommentare.load({
            params: {
                messungsId: value
            }
        });
    },

    updateColumn: function(store, record, success, opts) {
        var value;
        if (store.getTotalCount() === 0) {
            value = 'Keine';
        }
        else {
            value = store.getTotalCount();
        }
        Ext.fly(opts.divId).update(value);
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
            value = sstore.getById(opts.statusId).get('statusWert');
        }
        if (Ext.fly(opts.divId)) {
            var sta = Ext.StoreManager.lookup('StatusWerte');
            if (!sta) {
                var sta = Ext.create('Lada.store.StatusWerte');
            }
            var val = 'error';
            sta.load({
                scope: this,
                callback: function(records, operation, success) {
                    if (success) {
                        val = sta.getById(value).get('wert');
                    }
                    Ext.fly(opts.divId).update(val);
                }
            });
        }
    },

    setReadOnly: function(b) {
        if (b == true){
            //Readonly
            if (this.getPlugin('rowedit')){
                this.getPlugin('rowedit').disable();
            }
            this.down('button[action=delete]').disable();
            this.down('button[action=add]').disable();
        }else{
            //Writable
            if (this.getPlugin('rowedit')){
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
        if (! grid.readOnly) {
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
