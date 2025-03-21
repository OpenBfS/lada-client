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
    controller: 'messmethodengrid',

    requires: [
        'Lada.store.MmtMessprogramm',
        'Lada.store.Messmethoden',
        'Lada.store.Messgroessen',
        'Lada.controller.grid.Messmethode',
        'Lada.view.widget.Messmethode'
    ],

    maxHeight: 150,
    minHeight: 150,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 5, 5',

    allowDeselect: true,
    mmtStore: null,
    mmtUnfilteredStore: null,

    initComponent: function() {
        this.store = Ext.create('Lada.store.MmtMessprogramm');

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
                action: 'add'
            }, {
                text: i18n.getMsg('delete'),
                icon: 'resources/img/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = {
            items: [{
                header: i18n.getMsg('mmtId'),
                dataIndex: 'mmtId',
                flex: 1,
                renderer: function(value, metaData, record) {
                    this.validationResultRenderer(value, metaData, record);
                    if (!value || value === '') {
                        return '';
                    }
                    var store = me.mmtStore;
                    var result = Ext.htmlEncode(value) + ' - ';
                    return result + Ext.htmlEncode(store.findRecord(
                        'id', value, 0, false, false, true).get('name'));
                },
                editor: {
                    xtype: 'combobox',
                    store: me.mmtStore,
                    valueField: 'id',
                    displayField: 'name',
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
                    '{id:htmlEncode} - {name:htmlEncode}</div></tpl>'),
                    displayTpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">{id:htmlEncode} - ' +
                        '{name:htmlEncode}</tpl>'),
                    listeners: {
                        change: me.setNuklide
                    }
                }
            }, {
                header: i18n.getMsg('nuklide'),
                dataIndex: 'measds',
                flex: 2,
                renderer: function(value, metaData, gridRec) {
                    this.validationResultRenderer(value, metaData, gridRec);
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
                    return Ext.htmlEncode(returnvalues);
                },
                editor: {
                    xtype: 'tagfield',
                    store: 'messgroessen',
                    displayField: 'name',
                    valueField: 'id',
                    autoSelect: false,
                    queryMode: 'local'
                }
            }],
            defaults: {
                renderer: this.validationResultRenderer
            }
        };

        this.callParent(arguments);
    },

    initData: function() {
        var parentId = this.getParentRecordId();
        if (parentId) {
            this.store.load({
                params: {
                    mpgId: parentId
                }
            });
        }
    },

    /**
     * Reload this grid
     */
    reload: function() {
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
