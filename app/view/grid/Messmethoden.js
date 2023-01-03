/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Messmethoden and Messgroessen
 */
Ext.define('Lada.view.grid.Messmethoden', {
    extend: 'Lada.view.grid.BaseGrid',
    alias: 'widget.messmethodengrid',

    requires: [
        'Lada.store.MmtMessprogramm',
        'Lada.store.Messmethoden',
        'Lada.store.Messgroessen',
        'Lada.view.widget.Messmethode'
    ],

    maxHeight: 150,
    minHeight: 150,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 5, 5',

    recordId: null,
    allowDeselect: true,
    mmtStore: null,
    mmtUnfilteredStore: null,

    initComponent: function() {
        var mmtstore = Ext.data.StoreManager.get('messmethoden');
        if (!mmtstore) {
            Ext.create('Lada.store.Messmethoden', {storeId: 'messmethoden'});
        }
        var mmustore = Ext.data.StoreManager.get('messgroessenunfiltered');
        if (!mmustore) {
            Ext.create('Lada.store.Messgroessen', {
                storeId: 'messgroessenunfiltered'});
        }
        this.mmtStore = Ext.data.StoreManager.get('messmethoden');
        this.mmtUnfilteredStore = Ext.data.StoreManager.get(
            'messgroessenunfiltered');
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.mmtgrid');
        var me = this;

        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,
            disabled: false,
            pluginId: 'mmtrowedit',
            errorSummary: false,
            listeners: {
                // Make row ineditable when readonly is set to true
                // Normally this would belong into a controller an not the view.
                // But the RowEditPlugin is not handled there.
                beforeedit: function(e, o) {
                    var readonlywin = o.grid.up('window')
                        .record.get('readonly');
                    var readonlygrid = o.record.get('readonly');
                    if (
                        readonlywin === true ||
                        readonlygrid === true ||
                        this.disabled
                    ) {
                        return false;
                    }
                    if (o.field === 'mmtId') {
                        if (o.value !== undefined ) {
                            return true;
                        }
                    }
                    var nuklidfield = o.grid.columns[1].getEditor();
                    var newVal = o.record.get('mmtId');
                    var params = newVal ? {mmtId: newVal} : {};
                    nuklidfield.getStore().proxy.extraParams = params;
                    nuklidfield.getStore().load();
                    return true;
                }
            }
        });

        this.plugins = [this.rowEditing];

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: i18n.getMsg('add'),
                icon: 'resources/img/list-add.png',
                action: 'add',
                recordId: this.recordId
            }, {
                text: i18n.getMsg('delete'),
                icon: 'resources/img/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = [{
            header: i18n.getMsg('messmethode'),
            dataIndex: 'mmtId',
            flex: 1,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var store = me.mmtStore;
                return value + ' - ' + store.findRecord(
                    'id', value, 0, false, false, true).get('messmethode');
            },
            editor: {
                xtype: 'combobox',
                store: me.mmtStore,
                valueField: 'id',
                displayField: 'messmethode',
                allowBlank: false,
                editable: true,
                disableKeyFilter: false,
                forceSelection: true,
                autoSelect: true,
                queryMode: 'local',
                minChars: 0,
                typeAhead: false,
                triggerAction: 'all',
                tpl: Ext.create('Ext.XTemplate',
                    '<tpl for=".">' +
                    '<div class="x-combo-list-item  x-boundlist-item" >' +
                    '{id} - {messmethode}</div></tpl>'),
                displayTpl: Ext.create('Ext.XTemplate',
                    '<tpl for=".">{id} - {messmethode}</tpl>'),
                listeners: {
                    change: me.setNuklide
                }
            }
        }, {
            header: i18n.getMsg('nuklide'),
            dataIndex: 'messgroessen',
            flex: 2,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var store = me.mmtUnfilteredStore;
                var returnvalues = '';
                for (var i = 0; i < value.length; i++) {
                    if (i) {
                        returnvalues = returnvalues + ', ';
                    }
                    var record = store.getById(value[i]);
                    returnvalues = returnvalues + record.get('name');
                }
                return returnvalues;
            },
            editor: {
                xtype: 'tagfield',
                store: 'messgroessen',
                displayField: 'name',
                valueField: 'id',
                autoSelect: false,
                queryMode: 'local'
            }
        }];
        this.initData();
        this.callParent(arguments);
    },
    initData: function() {
        if (this.store) {
            this.store.removeAll();
        } else {
            this.store = Ext.create('Lada.store.MmtMessprogramm');
        }
        // Only load the Store when a Record ID is Present
        if (this.recordId) {
            this.addLoadingFailureHandler(this.store);
            this.store.load({
                params: {
                    messprogrammId: this.recordId
                }
            });
        }
    },

    /**
     * Reload this grid
     */
    reload: function() {
        if (!this.store) {
            this.initData();
            return;
        }
        this.hideReloadMask();
        this.store.reload();
    },

    setReadOnly: function(b) {
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
            this.down('button[action=delete]').enable();
            this.down('button[action=add]').enable();
        }
    },

    /* changes the nuklide store to reflect available nuklide for
    * the method selected
    */
    setNuklide: function(cbox, newVal, oldVal) {
        if (oldVal && oldVal === newVal) {
            return;
        }
        var grid = cbox.up('messmethodengrid');
        if (grid) {
            var nuklidfield = grid.columns[1].getEditor();
            var params = newVal ? {mmtId: newVal} : {};
            nuklidfield.getStore().proxy.extraParams = params;
            nuklidfield.getStore().load();
            nuklidfield.setValue('');
        }
    }
});
