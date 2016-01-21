/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list DatensatzErzeuger Stammdaten
 */
Ext.define('Lada.view.grid.DatensatzErzeuger', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.datensatzerzeugergrid',

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
    border: false,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('de.emptyGrid');

        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,
            disabled: false,
            pluginId: 'rowedit'
        });
        this.plugins = [this.rowEditing];

        // TODO: Which docked Items are required?
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'tbtext',
                id: 'tbtitle',
                text: i18n.getMsg('de.gridTitle')
            },
            '->',
            {
                text: i18n.getMsg('de.button.add'),
                icon: 'resources/img/list-add.png',
                action: 'add',
                disabled: true // disabled on startup, will be enabled by setStore
            }, {
                text: i18n.getMsg('de.button.delete'),
                icon: 'resources/img/list-remove.png',
                action: 'delete',
                disabled: true // disabled on startup, will be enabled by controller if necessary
            }]
        }];

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
            header: i18n.getMsg('daErzeugerId'),
            dataIndex: 'daErzeugerId',
            editor: {
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('bezeichnung'),
            dataIndex: 'bezeichnung',
            editor: {
                allowBlank: false,
                xtype: 'textfield'
            }
        }, {
            header: i18n.getMsg('mstId'),
            dataIndex: 'mstId',
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
                store: Ext.data.StoreManager.get('messstellen'),
                displayField: 'messStelle',
                valueField: 'id',
                allowBlank: false
            }
        }, {
            header: i18n.getMsg('letzteAenderung'),
            dataIndex: 'letzteAenderung'
        }];
        this.callParent(arguments);
    },

    /**
     * This sets the Store of this Grid
     */
    setStore: function(store){
        var i18n = Lada.getApplication().bundle;

        if (store) {
            this.removeDocked(Ext.getCmp('ptbar'), true);
            this.reconfigure(store);
            this.down('button[action=add]').enable();
            this.addDocked([{
                xtype: 'pagingtoolbar',
                id: 'ptbar',
                dock: 'bottom',
                store: store,
                displayInfo: true
            }]);
        }
    }
});
