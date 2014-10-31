/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/*
 * Grid to list Kommentare
 */
Ext.define('Lada.view.kommentare.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.kommentarelist',

    store: 'KommentareP',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Kommentaregefunden.',
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
            header: 'Erzeuger',
            dataIndex: 'erzeuger'
        }, {
            header: 'Datum',
            dataIndex: 'kdatum'
        }, {
            header: 'Text',
            dataIndex: 'ktext',
            flex: 1
        }];
        this.callParent(arguments);
    }
});

