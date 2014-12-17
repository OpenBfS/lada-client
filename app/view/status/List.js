/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Grid to list Status
 */
Ext.define('Lada.view.status.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.statuslist',

    store: 'Status',
    viewConfig: {
        maxHeight: 350,
        emptyText: 'Keine Statusangaben gefunden.',
        // minHeight and deferEmptyText are needed to be able to show the
        // emptyText message.
        minHeight: 65,
        deferEmptyText: false
    },

    parentId: null,
    probeId: null,

    initComponent: function() {
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });
        this.plugins = [rowEditing];
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: 'Details',
                icon: 'gfx/document-open.png',
                action: 'open'
            }, {
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
            header: 'Erzeuger',
            dataIndex: 'erzeuger',
            editor: {
                allowBlank: false
            }
        }, {
            header: 'Status',
            dataIndex: 'status',
            editor: {
                allowBlank: false
            }
        }, {
            header: 'Datum',
            dataIndex: 'datum',
            editor: {
                xtype: 'datefield',
                allowBlank: false,
                format: 'd.m.Y',
                maxValue: Ext.Date.format(new Date(), 'd.m.Y')
            }
        }, {
            header: 'Text',
            dataIndex: 'kommentar',
            flex: 1,
            editor: {
                allowBlank: true
            }
        }];
        this.callParent(arguments);
    }
});
