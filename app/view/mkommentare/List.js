/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/*
 * Grid to list Kommentare for Messunge
 */
Ext.define('Lada.view.mkommentare.List' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.mkommentarelist',
    store: 'MKommentare',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Kommentare gefunden.',
        // minHeight and deferEmptyText are needed to be able to show the
        // emptyText message.
        minHeight: 35,
        deferEmptyText: false
    },
    probeId: null,
    parentId: null,
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
                        probeId: this.probeId,
                        parentId: this.parentId
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
            {header: 'Erzeuger', dataIndex: 'erzeuger'},
            {header: 'Datum', dataIndex: 'kdatum'},
            {header: 'Text', dataIndex: 'ktext', flex: 1}
        ];
        this.callParent(arguments);
    }
});

