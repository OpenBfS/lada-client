/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Grid to list available search queryies
 */
Ext.define('Lada.view.search.List', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.queryselector',

    require: [
        'Ext.layout.container.Column'
    ],

    title: 'SQL-Auswahl',
    initComponent: function() {
        this.layout = {
            type: 'vbox',
            align: 'stretch'
        };
        this.items = [{
            id: 'search',
            xtype: 'combobox',
            editable: false,
            store: 'Queries',
            displayField: 'name',
            valueField: 'id',
            emptyText: 'Wählen Sie eine Abfrage'
        }, {
        // Buttons to trigger the search.
            id: 'SearchBtnPanel',
            xtype: 'panel',
            border: false,
            margin: '0 0 10 0',
            items: [{
                id: 'SearchBtn',
                text: 'Suchen',
                xtype: 'button',
                margin: '0 10 0 0'
            }, {
                id: 'ResetBtn',
                text: 'Zurücksetzen',
                xtype: 'button'
            }],
            hidden: false
        }, {
            xtype: 'panel',
            maxWidth: '500',
            border: false,
            margin: '0 10',
            items: [{
                id: 'sqldesc',
                xtype: 'displayfield',
                fieldLabel: 'Beschreibung',
                shrinkWrap: 3,
                value: '-/-'
            }, {
                id: 'results',
                xtype: 'displayfield',
                fieldLabel: 'Spalten',
                value: '-/-'
            }]
        }];
        this.callParent(arguments);
    }
});
