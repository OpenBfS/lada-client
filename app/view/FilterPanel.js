/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Panel to show available search queries
 */
Ext.define('Lada.view.FilterPanel', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.filterpanel',

    require: [
        'Ext.layout.container.Column'
    ],

    title: 'Filter',
    initComponent: function() {
        this.layout = {
            type: 'vbox',
            align: 'stretch'
        };
        var me = this;
        this.items = [{
            layout: 'hbox',
            border: false,
            items: [{
                xtype: 'combobox',
                name: 'filter',
                editable: false,
                flex: 1,
                displayField: 'name',
                valueField: 'id',
                queryMode: 'local',
                emptyText: 'Wählen Sie eine Abfrage'
            }, {
                xtype: 'button',
                action: 'details',
                enableToggle: true,
                text: 'Details',
                margin: '0 0 0 10'
            }]
        }, {
            xtype: 'checkbox',
            name: 'favorites',
            boxLabel: 'nur Favoriten',
            margin: '0, 0, 0, 5',
            checked: true
        }, {
            xtype: 'displayfield',
            name: 'description',
            shrinkWrap: 3,
            margin: '0, 0, 0 ,5',
            value: '-/-'
        }, {
            xtype: 'panel',
            border: false,
            margin: '0 0 10 0',
            items: [{
                xtype: 'button',
                action: 'search',
                text: 'Suchen',
                margin: '0 10 0 0'
            }, {
                xtype: 'button',
                action: 'reset',
                text: 'Zurücksetzen',
                margin: '0 10 0 0'
            }, {
                xtype: 'button',
                action: 'manage',
                text: 'Filterauswahl bearbeiten'
            }],
            hidden: false
        }];
        this.callParent(arguments);
        var combo = me.down('combobox[name=filter]');
        combo.store = Ext.create('Ext.data.Store', {
            model: 'Lada.model.Query'
        });
        var store = Ext.StoreManager.get('probequeries');
        store.on('load', function storeLoad () {
            var entries = store.queryBy(function(record) {
                if (record.get('favorite')) {
                    return true;
                }
            });
            combo.store.add(entries.items);
            combo.select(combo.store.getAt(0));
            combo.fireEvent('select', combo, [combo.store.getAt(0)]);
            store.un('load', storeLoad);
        });
    }
});
