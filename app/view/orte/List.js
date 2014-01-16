/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/*
 * Grid to list Orte
 */
Ext.define('Lada.view.orte.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.ortelist',
    store: 'Orte',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Orte gefunden.',
        // minHeight and deferEmptyText are needed to be able to show the
        // emptyText message.
        minHeight: 35,
        deferEmptyText: false
    },
    probeId: null,
    initComponent: function() {
        this.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    {
                        text: 'Hinzufügen',
                        icon: 'gfx/list-add.png',
                        action: 'add',
                        probeId: this.probeId
                    },
                    {
                        text: 'Löschen',
                        icon: 'gfx/list-remove.png',
                        action: 'delete'
                    }
                ]
            }
        ];
        this.columns = [
            {
                header: 'Typ',
                dataIndex: 'ortsTyp'
            },
            {
                header: 'Staat',
                dataIndex: 'ortId',
                renderer: function(value) {
                    var store = Ext.getStore('Ortedetails');
                    var staaten = Ext.getStore('Staaten');
                    var record = staaten.getById(store.getById(value).get('staatId'));
                    return record.get('staatIso');
                }

            },
            {
                header: 'Gemeineschlüssel',
                dataIndex: 'ortId',
                renderer: function(value) {
                    var store = Ext.getStore('Ortedetails');
                    var record = store.getById(value);
                    return record.get('gemId');
                }

            },
            {
                header: 'Gemeindename',
                dataIndex: 'ortId',
                flex: 1,
                renderer: function(value) {
                    var store = Ext.getStore('Ortedetails');
                    var gemeinden = Ext.getStore('Verwaltungseinheiten');
                    var record = store.getById(value);
                    var gemid = record.get('gemId');
                    var record2 = gemeinden.findRecord("gemId", gemid);
                    return record2.get('bezeichnung');
                }

            },
            {
                header: 'Messpunkt',
                dataIndex: 'ortId',
                renderer: function(value) {
                    var store = Ext.getStore('Ortedetails');
                    var record = store.getById(value);
                    return record.get('bezeichnung');
                }

            }
        ];
        this.callParent(arguments);
    }
});

