/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid for the store 'downloadqueue', listing all open and recently failed
 * print jobs for the current session
 */

// TODO layout, esp. if updates come in


Ext.define('Lada.view.grid.DownloadQueue', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.downloadqueuegrid',
    requires: ['Lada.controller.grid.Downloads'],
    store: null,
    viewConfig: {
        deferEmptyText: true,
        markDirty: false
    },
    emptyText: 'emptygrid.downloadqueue',
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var controller = Lada.app.getController(
            'Lada.controller.grid.Downloads');
        this.emptyText = i18n.getMsg('emptygrid.downloadqueue');
        this.store = Ext.data.StoreManager.get('downloadqueue');
        this.columns = [{
            header: i18n.getMsg('export.filename'),
            dataIndex: 'filename',
            flex: 1
        }, {
            header: i18n.getMsg('print.startDate'),
            dataIndex: 'startDate',
            width: 85,
            renderer: function(value) {
                return Lada.util.Date.formatTimestamp(value, 'HH:mm:ss');
            }
        }, {
            header: i18n.getMsg('print.status'),
            dataIndex: 'status',
            flex: 1,
            renderer: function(value) {
                return i18n.getMsg( 'print.status.'+ value);
            }
        }, {
            header: i18n.getMsg('print.message'),
            dataIndex: 'message',
            flex: 2
        }, {
            // cancel icon
            xtype: 'actioncolumn',
            text: ' ',
            dataIndex: 'status',
            width: 20,
            getClass: function(value, meta, rec) {
                // see x.action-col-icon definitions at lada.css for img urls
                switch (rec.get('status')) {
                    case 'finished':
                        return 'okay';
                    case 'running':
                    case 'waiting':
                        return 'cancel';
                    default:
                        return '';
                }
            },
            handler: function(grid, rowIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                var status = rec.get('status');
                if (status === 'running' || status === 'waiting') {
                    controller.onCancelItem(rec);
                }
            }
        }, {
            // remove from list icon (available for finished jobs)
            xtype: 'actioncolumn',
            text: ' ',
            dataIndex: 'status',
            width: 20,
            getClass: function(value, meta, rec) {
                return rec.get('done') ? 'delete' : '';
            },
            handler: function(grid, rowIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                if (rec.get('done') === true) {
                    controller.onDeleteItem(rec);
                }
            }

        }];
        this.callParent(arguments);
    }
});
