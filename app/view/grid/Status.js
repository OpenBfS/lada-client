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
        var statusWerteStore = Ext.create('Lada.store.StatusWerte');
        statusWerteStore.load({
            params: {
                messungsId: this.recordId
            }
        });
        var statusStufeStore = Ext.create('Lada.store.StatusStufe');
        statusStufeStore.load();

        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,
            disabled: true, //has no effect... but why?
            pluginId: 'rowedit',
            listeners: {
                beforeedit: function(editor, context, eOpts) {
                    if (context.record.get('id') ||
                        ! context.grid.up('window').record.get('statusEdit')) {
                    //Check if edit is allowed, this is true, when the selected
                    // Record has an id (=is not new)
                    // or is not allowed to add records.

                        return false;
                    }


                }
            }
        });
        this.plugins = [this.rowEditing];

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: 'Zurücksetzen',
                icon: 'resources/img/edit-redo.png',
                action: 'reset',
                probeId: this.probeId,
                parentId: this.parentId
            }, {
                text: 'Hinzufügen',
                icon: 'resources/img/list-add.png',
                action: 'add',
                probeId: this.probeId,
                parentId: this.parentId
            }]
        }];
        this.columns = [{
            header: 'erstellt',
            dataIndex: 'datum',
            xtype: 'datecolumn',
            format: 'd.m.Y H:i',
            width: 110,
            sortable: false
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
                store: Ext.data.StoreManager.get('messstellenFiltered'),
                displayField: 'messStelle',
                valueField: 'id',
                allowBlank: false,
                editable: false
            },
            sortable: false
        }, {
            header: 'Stufe',
            dataIndex: 'statusStufe',
            renderer: function(value) {
                var sta = Ext.data.StoreManager.get('statusstufe');
                var r;
                if (value===null || value === '') {
                    r = 'Error';
                }
                var item = sta.getById(value);
                if (item) {
                    r = item.get('stufe');
                }
                return r;
            },
            sortable: false
        }, {
            header: 'Status',
            dataIndex: 'statusWert',
            renderer: function(value) {
                var sta = Ext.data.StoreManager.get('statuswerte');
                //This store is NOT used in the editor...
                var r;
                if (value===null || value === '') {
                    r = 'Error';
                }
                var item = sta.getById(value);
                if (item) {
                    r = item.get('wert');
                }
                return r;
            },
            editor: {
                xtype: 'combobox',
                store: statusWerteStore,
                queryMode: 'local',
                displayField: 'wert',
                valueField: 'id',
                allowBlank: false,
                editable: false
            },
            sortable: false
        }, {
            header: 'Text',
            dataIndex: 'text',
            flex: 1,
            editor: {
                allowBlank: true,
                maxLength: 1000,
                enforceMaxLength: true
            },
            sortable: false
        }];
        this.initData();
        this.callParent(arguments);
        this.setReadOnly(true); //Grid is always initialised as RO
    },

    initData: function() {
        if (this.store) {
            this.store.removeAll();
        }
        else {
            this.store = Ext.create('Lada.store.Status',{
                sorters: [{
                    property: 'datum',
                    direction: 'ASC'
                }]
            });
        }
        this.store.load({
            params: {
                messungsId: this.recordId,
            }
        });
    },

    setReadOnly: function(b) {
        if (b == true){
            //Readonly
            this.down('button[action=add]').disable();
        }else{
            //Writable
            this.down('button[action=add]').enable();
        }
    },

    setResetable: function(b) {
        if (b == true){
            this.down('button[action=reset]').enable();
        }else{
            this.down('button[action=reset]').disable();
        }
    }
});
