/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/*
 * Grid to list Messwerte
 */
Ext.define('Lada.view.messwerte.List' ,{
    extend: 'Ext.grid.Panel',
    require: ['Lada.store.StaMesseinheit'],
    alias: 'widget.messwertelist',

    store: 'Messwerte',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Messwerte gefunden.',
        // minHeight and deferEmptyText are needed to be able to show the
        // emptyText message.
        minHeight: 35,
        deferEmptyText: false
    },

    probeId: null,
    parentId: null,

    initComponent: function() {
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                text: 'Hinzufügen',
                icon: 'gfx/list-add.png',
                action: 'add',
                probeId: this.probeId,
                parentId: this.parentId
            }, {
                text: 'Löschen',
                icon: 'gfx/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = [{
            header: '&lt;NWG',
            dataIndex: 'messwertNwg'
        }, {
            header: 'Messwert',
            dataIndex: 'messwert'
        }, {
            header: 'Messfehler',
            dataIndex: 'messfehler'
        }, {
            header: 'Messgröße',
            dataIndex: 'messgroesseId',
            renderer: function(value) {
                var store = Ext.data.StoreManager.get('staMessgroessen');
                return store.findRecord('id', value).get('messgroesse');
            }
        }, {
            header: 'Messeinheit',
            dataIndex: 'mehId',
            renderer: function(value) {
                console.log('einheit: ' + value);
                var store = Ext.data.StoreManager.get('staMesseinheiten');
                return store.findRecord('id', value).get('einheit');
            }
        }, {
            header: 'Grenzwertüberschreitung',
            dataIndex: 'grenzwertueberschreitung',
            flex: 1,
            renderer: function(value) {
                if (value === true) {
                    return "Ja";
                } else {
                    return "Nein";
                }
            }
        }];
        this.callParent(arguments);
    }
});

