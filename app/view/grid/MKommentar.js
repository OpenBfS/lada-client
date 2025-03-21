/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Kommentare for Messunge
 */
Ext.define('Lada.view.grid.MKommentar', {
    extend: 'Lada.view.grid.BaseGrid',
    alias: 'widget.mkommentargrid',
    controller: 'mkommentargrid',
    requires: [
        'Lada.controller.grid.MKommentar',
        'Lada.store.MKommentare'
    ],

    maxHeight: 350,
    minHeight: 130,
    viewConfig: {
        deferEmptyText: false
    },

    readOnly: true,
    allowDeselect: true,

    initComponent: function() {
        this.store = Ext.create('Lada.store.MKommentare');

        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.kommentare');
        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,
            disabled: false,
            errorSummary: false,
            pluginId: 'rowedit',
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
                header: i18n.getMsg('header.datum'),
                dataIndex: 'date',
                xtype: 'datecolumn',
                format: 'd.m.Y H:i',
                width: 110,
                renderer: function(value, metaData, record) {
                    this.validationResultRenderer(value, metaData, record);
                    if (!value || value === '') {
                        return '';
                    }
                    var format = 'd.m.Y H:i';
                    var dt = '';
                    if (!isNaN(value)) {
                        dt = Lada.util.Date.formatTimestamp(
                            value, format, true);
                    }
                    return dt;
                }
            }, {
                header: i18n.getMsg('erzeuger'),
                dataIndex: 'measFacilId',
                renderer: function(value, metaData, gridRec) {
                    this.validationResultRenderer(value, metaData, gridRec);
                    var r = '';
                    if (!value || value === '') {
                        r = 'Error';
                    }
                    var store = Ext.data.StoreManager.get('messstellen');
                    var record = store.getById(value);
                    if (record) {
                        r = record.get('name');
                    }
                    return Ext.htmlEncode(r);
                },
                editor: {
                    xtype: 'combobox',
                    store: Ext.data.StoreManager.get('messstellenFiltered'),
                    displayField: 'name',
                    valueField: 'id',
                    allowBlank: false,
                    editable: false,
                    matchFieldWidth: false
                }
            }, {
                header: i18n.getMsg('text'),
                dataIndex: 'text',
                flex: 1,
                renderer: function(value, metaData, record) {
                    var val = '<div style="white-space: normal !important;">' +
                    Ext.htmlEncode(value) + '</div>';
                    this.validationResultRenderer(val, metaData, record);
                    return val;
                },
                editor: {
                    xtype: 'textfield',
                    allowBlank: false,
                    maxLength: 1000,
                    enforceMaxLength: true
                }
            }],
            defaults: {
                renderer: this.validationResultRenderer
            }
        };
        this.listeners = {
            select: {
                fn: function() {
                    this.activateRemoveButton(true);
                },
                scope: this
            },
            deselect: {
                fn: function() {
                    this.activateRemoveButton(false);
                },
                scope: this
            }
        };
        this.callParent(arguments);
        this.setReadOnly(true); //Grid is always initialised as RO
    },

    initData: function() {
        var parentId = this.getParentRecordId();
        if (parentId) {
            this.store.load({
                params: {
                    measmId: parentId
                }
            });
        }
        Ext.on('timezonetoggled', function() {
            var grid = Ext.ComponentQuery.query('mkommentargrid');
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
     * Reload the grid
     */
    reload: function() {
        this.hideReloadMask();
        this.store.reload();
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
            this.down('button[action=add]').enable();
        }
    },

    /**
     * De-/Activate the Remove Button
     */
    activateRemoveButton: function(activate) {
        // Only enable the remove buttone, if the grid is editable.
        if (!this.readOnly) {
            this.down('button[action=delete]').setDisabled(!activate);
        }
    }
});
