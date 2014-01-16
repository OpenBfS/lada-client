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
Ext.define('Lada.view.search.List' ,{
    extend: 'Ext.form.FieldSet',
    title: 'SQL-Auswahl',
    alias: 'widget.queryselector',
    initComponent: function() {
        this.layout = 'column',
        this.items = [
            {
                id: 'search',
                xtype: 'combobox',
                editable: false,
                store: 'Queries',
                displayField:'name',
                valueField:'id',
                emptyText:'Wählen Sie eine Abfrage'
            },
            {
                xtype: 'panel',
                maxWidth: '500',
                border: false,
                margin: '0 10',
                items: [
                    {
                        id: 'sqldesc',
                        xtype: 'displayfield',
                        fieldLabel: 'Beschreibung',
                        value: '-/-'
                    },
                    {
                        id: 'sqlquery',
                        xtype: 'displayfield',
                        fieldLabel: 'Abfrage',
                        value: '-/-'
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }
});
