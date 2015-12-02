/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list Probenehmer Stammdaten
 */
Ext.define('Lada.view.grid.Probenehmer', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.probenehmergrid',

    // minHeight and deferEmptyText are needed to be able to show the
    // emptyText message.
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },

    warnings: null,
    errors: null,
    readOnly: true,
    allowDeselect: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('pn.emptyGrid');

        // TODO: Which docked Items are required?
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'tbtext',
                id: 'tbtitle',
                text: i18n.getMsg('pn.gridTitle')
            }]
        /*
            //bottom toolbar?
            }, {
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
        */
        }];
     /*
     // Do we have row-editing
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
    */
        this.columns = [{
            header: i18n.getMsg('netzbetreiberId'),
            dataIndex: 'netzbetreiberId',
            renderer: function(value) {
                var r = '';
                if (!value || value === '') {
                    r = 'Error';
                }
                var store = Ext.data.StoreManager.get('netzbetreiber');
                var record = store.getById(value);
                if (record) {
                  r = record.get('netzbetreiber');
                }
                return r;
            },
            editor: {
                xtype: 'combobox',
                store: Ext.data.StoreManager.get('netzbetreiber'),
                displayField: 'netzbetreiber',
                valueField: 'id',
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('bearbeiter'),
            dataIndex: 'bearbeiter',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('prnId'),
            dataIndex: 'prnId',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('bemerkung'),
            dataIndex: 'bemerkung',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('kurzBezeichnung'),
            dataIndex: 'kurzBezeichnung',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('ort'),
            dataIndex: 'ort',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('plz'),
            dataIndex: 'plz',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('strasse'),
            dataIndex: 'strasse',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('telefon'),
            dataIndex: 'telefon',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('tp'),
            dataIndex: 'tp',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('typ'),
            dataIndex: 'typ',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('letzteAenderung'),
            dataIndex: 'letzteAenderung'
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
        // this.initData(); //This will be called by the Query Component.
        this.callParent(arguments);
        //TODO this.setReadOnly(true); //Grid is always initialised as RO
    },

    initData: function() {
        this.store = Ext.create('Lada.store.DatensatzErzeuger');
        this.store.load(); //TODO: Params?
    },

    setReadOnly: function(b) {
        if (b == true){
            //Readonly
            if (this.getPlugin('rowedit')){
                this.getPlugin('rowedit').disable();
            }
            try {
                this.down('button[action=delete]').disable();
                this.down('button[action=add]').disable();
            }
            catch(e) {
                //TODO: Do Nothing...
            }
        }else{
            //Writable
            if (this.getPlugin('rowedit')){
                this.getPlugin('rowedit').enable();
            }
            try {
                this.down('button[action=delete]').enable();
                this.down('button[action=add]').enable();
            }
            catch(e) {
                //TODO: Do Nothing...
            }
        }
    },
    /**
     * Activate the Remove Button
     */
    activateRemoveButton: function(selection, record) {
        var grid = this;
        //only enable the remove buttone, when the grid is editable.
        if (! grid.readOnly) {
            try {
                grid.down('button[action=delete]').enable();
            }
            catch(e) {
                //TODO: Do Nothing
            }
        }
    },
    /**
     * deactivate the Remove Button
     */
    deactivateRemoveButton: function(selection, record) {
        var grid = this;
        //only enable the remove buttone, when the grid is editable.
        if (! grid.readOnly) {
            try {
                grid.down('button[action=delete]').disable();
            }
            catch(e) {
                //TODO: Do Nothing
            }
        }
    }
});

