/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Grid to list Probenzusatzwerte
 */
Ext.define('Lada.view.grid.Probenzusatzwert', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.probenzusatzwertgrid',
    requires: [
        'Lada.view.widget.Probenzusatzwert'
    ],

    maxHeight: 350,
    emptyText: 'Keine Zusatzwerte gefunden.',
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 5, 5',

    recordId: null,

    initComponent: function() {
        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,
            pluginId: 'rowedit',
            listeners:{
                // Make row ineditable when readonly is set to true
                // Normally this would belong into a controller an not the view.
                beforeedit: function(e, o) {
                    if (o.record.get('readonly') == true) {
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
            header: 'PZW-ID',
            dataIndex: 'id',
            flex: 1,
        }, {
            header: 'PZW-Größe',
            dataIndex: 'pzsId',
            flex: 3,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var store = Ext.data.StoreManager.get('probenzusaetze');
                var record = store.getById(value);
                return record.get('beschreibung');
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('probenzusaetze'),
                displayField: 'beschreibung',
                valueField: 'id',
                allowBlank: false,
                editable: false
            }
        }, {
            header: 'Messwert',
            dataIndex: 'messwertPzs',
            xtype: 'numbercolumn',
            flex: 1,
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                maxLength: 10,
                enforceMaxLength: true,
                allowExponential: false
            }
        }, {
            header: '< NWG',
            flex: 1,
            renderer: function(value, meta, record) {
                var nwg = record.get('nwgZuMesswert');
                var mw = record.get('messwertPzs');
                if ( mw < nwg) {
                    return '<';
                }
                return '';
            }
        }, {
            header: 'Nachweisgrenze',
            dataIndex: 'nwgZuMesswert',
            xtype: 'numbercolumn',
            format: '0',
            flex: 1,
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                maxLength: 10,
                enforceMaxLength: true,
                allowExponential: false
            }
        }, {
            header: 'Maßeinheit',
            dataIndex: 'pzsId',
            flex: 1,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var zstore = Ext.data.StoreManager.get('probenzusaetze');
                var mstore = Ext.data.StoreManager.get('messeinheiten');
                var mehId = zstore.getById(value).get('mehId');
                var record = mstore.findRecord('id', mehId);
                return record.get('einheit');
            }
        }, {
            header: 'rel. Unsich.[%]',
            dataIndex: 'messfehler',
            xtype: 'numbercolumn',
            format: '0',
            flex: 1,
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                maxLength: 3,
                enforceMaxLength: true,
                allowExponential: false,
                allowDecimal: false
            }
        }];
        this.initData();
        this.callParent(arguments);
    },

    initData: function() {
        this.store = Ext.create('Lada.store.Zusatzwerte');
        this.store.load({
            params: {
                probeId: this.recordId
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
