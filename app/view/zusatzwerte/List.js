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
Ext.define('Lada.view.zusatzwerte.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.zusatzwertelist',

    store: 'Zusatzwerte',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Zusatzwerte gefunden.',
        // minHeight and deferEmptyText are needed to be able to show the
        // emptyText message.
        minHeight: 35,
        deferEmptyText: false
    },

    probeId: null,

    initComponent: function() {
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                text: 'Hinzufügen',
                icon: 'gfx/list-add.png',
                action: 'add',
                probeId: this.probeId
            }, {
                text: 'Löschen',
                icon: 'gfx/list-remove.png',
                action: 'delete'
            }]
        }];
        this.columns = [{
            header: 'PZW-ID',
            dataIndex: 'id'
        }, {
            header: 'PZW-Größe',
            dataIndex: 'pzsId',
            renderer: function(value) {
                var store = Ext.getStore('StaProbenzusaetze');
                var record = store.getById(value);
                return record.get('beschreibung');
            },
            flex: 1
        }, {
            header: 'Messwert',
            dataIndex: 'id',
            renderer: function(value) {
                var store = Ext.getStore('Zusatzwerte');
                var record = store.getById(value);
                var messwert = record.get('messwertPzs');
                var nwg = record.get('nwgZuMesswert');
                if (messwert < nwg ) {
                    return "<"+messwert;
                } else {
                    return messwert;
                }
            }
        }, {
            header: 'rel. Unsich.[%]',
            dataIndex: 'messfehler'
        }, {
            header: 'Maßeinheit',
            dataIndex: 'pzsId',
            renderer: function(value) {
                var zstore = Ext.getStore('StaProbenzusaetze');
                var mstore = Ext.getStore('StaMesseinheiten');
                console.log('store: ' + mstore);
                var mehId = zstore.getById(value).get('mehId');
                var record = mstore.findRecord('id', mehId);
                return record.get('einheit');
            }
        }];
        this.callParent(arguments);
    }
});
