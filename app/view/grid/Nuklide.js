/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Grid to list Nuklide
 */
Ext.define('Lada.view.grid.Nuklide', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.nuklidegrid',

    requires: [
        'Lada.view.widget.Messgroesse'
    ],

    maxHeight: 150,
    minHeight: 150,
    viewConfig: {
        deferEmptyText: false,
        markDirty: false //Remove Dirty-Flags
    },
    //margin: '0, 0, 5, 5',

    recordId: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.nuklidgrid');

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: i18n.getMsg('add'),
                qtip: i18n.getMsg('add.qtip'),
                icon: 'resources/img/list-add.png',
                action: 'add',
                disabled: true
            }, {
                text: i18n.getMsg('delete'),
                qtip: i18n.getMsg('delete.qtip'),
                icon: 'resources/img/list-remove.png',
                action: 'remove',
                disabled: true
            }]
        }];
        this.columns = [{
            header: i18n.getMsg('nuklid'),
            dataIndex: 'id',
            flex: 1,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var store = Ext.data.StoreManager.get('messgroessen');
                if (!store) {
                    store = Ext.create('Lada.store.Messgroessen');
                }
                return store.findRecord('id', value, 0, false, false, true).get('messgroesse');
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('messgroessen'),
                valueField: 'id',
                allowBlank: false,
                editable: true,
                forceSelection: true,
                autoSelect: true,
                //multiSelect: true, // TODO
                queryMode: 'local',
                minChars: 0,
                typeAhead: false,
                triggerAction: 'all',
                tpl: Ext.create("Ext.XTemplate",
                    '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
                    '{messgroesse}</div></tpl>'),
                displayTpl: Ext.create('Ext.XTemplate',
                    '<tpl for=".">{messgroesse}</tpl>'),
            }
        }];

        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,
            disabled: false,
            pluginId: 'nuklidrowedit',
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

        this.initData();
        this.callParent(arguments);
    },
    initData: function() {
        if (this.store) {
            this.store.reload();
        }
    },
    setData: function(store) {
       this.setLoading(true);
       this.reconfigure(store);
       this.setLoading(false);
    },
    setReadOnly: function(b) {
        if (b == true){
            //Readonly
            if (this.getPlugin('rowedit')){
                this.getPlugin('rowedit').disable();
            }
            this.down('button[action=add]').disable();
            this.down('button[action=remove]').disable();
        }else{
            //Writable
            if (this.getPlugin('rowedit')){
                this.getPlugin('rowedit').enable();
            }
            this.down('button[action=add]').enable();
            this.down('button[action=remove]').enable();
         }
    }
});
