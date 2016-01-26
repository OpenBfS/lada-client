/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Ortszuordnungen
 */
Ext.define('Lada.view.grid.Ortszuordnung', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ortszuordnunggrid',

    maxHeight: 350,
    emptyText: 'Keine Orte gefunden.',
        // minHeight and deferEmptyText are needed to be able to show the
        // emptyText message.
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
            header: 'Typ',
            dataIndex: 'ortszuordnungTyp',
            width: 50,
            editor: {
                allowBlank: false
            }
        }, {
            header: 'Staat',
            dataIndex: 'ortId',
            width: 70,
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('orte');
                var staaten = Ext.data.StoreManager.get('staaten');
                var record =
                    staaten.getById(store.getById(value).get('staatId'));
                return record.get('staatIso');
            }
        }, {
            header: 'Gemeindeschlüssel',
            dataIndex: 'ortId',
            width: 120,
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('orte');
                var record = store.getById(value);
                return record.get('gemId');
            }
        }, {
            header: 'Gemeindename',
            dataIndex: 'ortId',
            flex: 1,
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('orte');
                var gemeinden =
                    Ext.data.StoreManager.get('verwaltungseinheiten');
                var record = store.getById(value);
                var gemid = record.get('gemId');
                var record2 = gemeinden.getById(gemid);
                return record2.get('bezeichnung');
            }
        }, {
            header: 'Ortszusatztext',
            dataIndex: 'ortszusatztext'
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
        this.store = Ext.create('Lada.store.Ortszuordnung');
        this.store.load({
            params: {
                probeId: this.recordId
            }
        });
        Ext.ClassManager.get('Lada.model.Probe').load(this.recordId, {
            failure: function(record, action) {
                // TODO
            },
            success: function(record, response) {
                var json = Ext.decode(response.response.responseText);
                if (json) {
                    this.warnings = json.warnings;
                    this.errors = json.errors;
                }
            },
            scope: this
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
