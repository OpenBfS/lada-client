/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Kommentare
 */
Ext.define('Lada.view.grid.PKommentar', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.pkommentargrid',

    requires: [
        'Ext.toolbar.Toolbar',
        'Lada.store.PKommentare'
    ],

    maxHeight: 350,
    emptyText: 'Keine Kommentare gefunden.',
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
            disabled: false,
            pluginId: 'rowedit',
            errorSummary: false,
            listeners: {
                // Make row ineditable when readonly is set to true
                // Normally this would belong into a controller an not the view.
                // But the RowEditPlugin is not handled there.
                beforeedit: function(e, o) {
                    var readonlywin = o.grid.up('window').record.get('readonly');
                    var readonlygrid = o.record.get('readonly');
                    if (readonlywin == true || readonlygrid == true || this.disabled) {
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
            header: 'erstellt',
            dataIndex: 'datum',
            xtype: 'datecolumn',
            format: 'd.m.Y H:i',
            width: 110
        }, {
            header: 'Erzeuger',
            dataIndex: 'mstId',
            width: 140,
            renderer: function(value) {
                var r = '';
                if (!value || value === '') {
                    r = 'Error';
                }
                var store = Ext.data.StoreManager.get('messstellen');
                var record = store.getById(value);
                if (record) {
                    r = record.get('messStelle');
                }
                return r;
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('messstellenFiltered'),
                displayField: 'messStelle',
                valueField: 'id',
                allowBlank: false
            }
        }, {
            header: 'Text',
            dataIndex: 'text',
            flex: 1,
            renderer: function(value) {
                return '<div style="white-space: normal !important;">' +
                    value + '</div>';
            },
            editor: {
                xtype: 'textfield',
                allowBlank: false
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
        this.store = Ext.create('Lada.store.PKommentare');
        this.store.load({
            params: {
                probeId: this.recordId
            }
        });
    },

    setReadOnly: function(b) {
        this.readOnly = b;
        if (b) {
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
