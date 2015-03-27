/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Grid to list Status
 */
Ext.define('Lada.view.grid.Status', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.statusgrid',

    maxHeight: 350,
    emptyText: 'Keine Statusangaben gefunden.',
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },

    recordId: null,

    initComponent: function() {
        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,
            disabled: false,
            pluginId: 'rowedit',
            listeners:{
                // Make row ineditable when readonly is set to true
                // Normally this would belong into a controller an not the view.
                // But the RowEditPlugin is not handled there.
                beforeedit: function(e, o) {
                    var readonlywin = o.grid.up('window').record.get('readonly');
                    var readonlygrid = o.record.get('readonly');
                    if (readonlywin == true || readonlygrid == true || this.disabled)  {
                        return false;
                    }
                    return true;
                }
            }
         });
        this.plugins = [this.rowEditing];

        var statusStore = Ext.create('Ext.data.Store', {
            fields: ['display', 'id'],
            data: [{
                display: 'unbekannt', id: 0
            }, {
                display: 'nicht vergeben', id: 1
            }, {
                display: 'plausibel', id: 2
            }, {
                display: 'nicht repräsentativ', id: 3
            }, {
                display: 'nicht plausibel', id: 4
            }]
        });
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: 'Hinzufügen',
                icon: 'resources/img/list-add.png',
                action: 'add',
                probeId: this.probeId,
                parentId: this.parentId
            }, {
                text: 'Löschen',
                icon: 'resources/img/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = [{
            header: 'Erzeuger',
            dataIndex: 'erzeuger',
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var mstore = Ext.data.StoreManager.get('messstellen');
                return mstore.getById(value).get('messStelle');
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('messstellen'),
                displayField: 'messStelle',
                valueField: 'id',
                allowBlank: false,
                editable: false
            }
        }, {
            header: 'Status',
            dataIndex: 'status',
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                return statusStore.getById(value).get('display');
            },
            editor: {
                xtype: 'combobox',
                store: statusStore,
                displayField: 'display',
                valueField: 'id',
                allowBlank: false,
                editable: false
            }
        }, {
            header: 'Datum',
            dataIndex: 'sdatum',
            xtype: 'datecolumn',
            format: 'd.m.Y',
            editor: {
                xtype: 'datefield',
                allowBlank: false,
                format: 'd.m.Y',
                maxValue: Ext.Date.format(new Date(), 'd.m.Y')
            }
        }, {
            header: 'Text',
            dataIndex: 'skommentar',
            flex: 1,
            editor: {
                allowBlank: true,
                maxLength: 1000,
                enforceMaxLength: true
            }
        }];
        this.initData();
        this.callParent(arguments);
    },

    initData: function() {
        if (this.store) {
            this.store.removeAll();
        }
        else {
            this.store = Ext.create('Lada.store.Status');
        }
        this.store.load({
            params: {
                messungsId: this.recordId
            }
        });
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
            this.down('button[action=delete]').enable();
            this.down('button[action=add]').enable();
        }
    }
});
