/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
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
    readOnly: true,
    allowDeselect: true,

    initComponent: function() {
        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,
            disabled: true,
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

        var statusWerteStore = Ext.create('Lada.store.StatusWerte');
        statusWerteStore.load({
            //params: {
            //    messungsId: this.recordId
            //}
        });
        var statusStufeStore = Ext.create('Lada.store.StatusStufe');
        statusStufeStore.load({
            //params: {
            //    messungsId: this.recordId
            //}
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
            header: 'erstellt',
            dataIndex: 'datum',
            xtype: 'datecolumn',
            format: 'd.m.Y H:i',
            width: 110,
            sortable: false,
        }, {
            header: 'Erzeuger',
            dataIndex: 'erzeuger',
            renderer: function(value) {
                var r = '';
                if (!value || value === '') {
                    r = 'Error';
                }
                var mstore = Ext.data.StoreManager.get('messstellen');
                var item = mstore.getById(value);
                if (item) {
                    r = item.get('messStelle');
                }
                return r;
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('messstellen'),
                displayField: 'messStelle',
                valueField: 'id',
                allowBlank: false,
                editable: false
            },
            sortable: false,
        }, {
            header: 'Stufe',
            dataIndex: 'statusStufe',
            renderer: function(value) {
                var r;
                if (value===null || value === '') {
                    r = 'Error';
                }
                var item = statusStufeStore.getById(value);
                if (item) {
                    r = item.get('stufe');
                }
                return r;
            },
            sortable: false,
        }, {
            header: 'Status',
            dataIndex: 'statusWert',
            renderer: function(value) {
                var r;
                if (value===null || value === '') {
                    r = 'Error';
                }
                var item = statusWerteStore.getById(value);
                if (item) {
                    r = item.get('wert');
                }
                return r;
            },
            editor: {
                xtype: 'combobox',
                store: statusWerteStore,
                displayField: 'wert',
                valueField: 'id',
                allowBlank: false,
                editable: false
            },
            sortable: false,
        }, {
            header: 'Text',
            dataIndex: 'text',
            flex: 1,
            editor: {
                allowBlank: true,
                maxLength: 1000,
                enforceMaxLength: true
            },
            sortable: false,
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
            //this.down('button[action=delete]').enable();
            this.down('button[action=add]').enable();
        }
    },
    /**
     * Activate the "Remove Button"
     */
    activateRemoveButton: function(selection, record) {
        var grid = this;
        //only enable the remove buttone, when the grid is editable.
        if (! grid.readOnly) {
            grid.down('button[action=delete]').enable();
        }
    },
    /**
     * Deactivate the "Remove Button"
     */
    deactivateRemoveButton: function(selection, record) {
        var grid = this;
        //only enable the remove buttone, when the grid is editable.
        if (! grid.readOnly) {
            grid.down('button[action=delete]').disable();
        }
    }
});
