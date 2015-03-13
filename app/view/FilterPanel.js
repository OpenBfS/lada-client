/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Panel to show available search queryies
 */
Ext.define('Lada.view.FilterPanel', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.filterpanel',

    require: [
        'Ext.layout.container.Column'
    ],

    title: 'Filter-Auswahl',
    initComponent: function() {
        this.layout = {
            type: 'vbox',
            align: 'stretch'
        };
        this.items = [{
            xtype: 'combobox',
            name: 'filter',
            editable: false,
            store: Ext.create('Lada.store.Queries'),
            displayField: 'name',
            valueField: 'id',
            emptyText: 'Wählen Sie eine Abfrage'
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
                text: 'Zurücksetzen'
            }],
            hidden: false
        }, {
            xtype: 'panel',
            maxWidth: '500',
            border: false,
            margin: '0 10',
            items: [{
                xtype: 'displayfield',
                name: 'description',
                fieldLabel: 'Beschreibung',
                shrinkWrap: 3,
                value: '-/-'
            }, {
                xtype: 'displayfield',
                name: 'columns',
                fieldLabel: 'Spalten',
                value: '-/-'
            }]
        }];
        this.callParent(arguments);
    }
});
