/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid for the export and print queues.
 *
 * Subclasses use different controllers.
 */
Ext.define('Lada.view.grid.DownloadQueue', {
    extend: 'Ext.grid.Panel',

    viewConfig: {
        deferEmptyText: true,
        markDirty: false
    },
    maxHeight: 200,
    emptyText: 'emptygrid.downloadqueue',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var controller = this.controller;
        this.emptyText = i18n.getMsg('emptygrid.downloadqueue');
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
                return i18n.getMsg( 'print.status.' + value);
            }
        }, {
            header: i18n.getMsg('print.message'),
            dataIndex: 'message',
            flex: 2
        }, {
            // cancel/download icon
            xtype: 'actioncolumn',
            text: ' ',
            dataIndex: 'status',
            getTip: function(value, meta, rec) {
                // Show tooltip for finished and not yet downloaded items
                if (rec.get('status') === 'finished'
                    && !rec.get('downloadRequested')
                ) {
                    return i18n.getMsg('print.download');
                }
                // Return whitespace since an empty string will have no effect,
                // i.e. leave the tooltip string as is:
                return ' ';
            },
            width: 20,
            getClass: function(value, meta, rec) {
                // see x.action-col-icon definitions at lada.css for img urls
                switch (rec.get('status')) {
                    case 'finished':
                        if (!rec.get('downloadRequested')) {
                            return 'saveas';
                        } else {
                            return '';
                        }
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
                } else if (
                    rec.get('status') === 'finished' &&
                    rec.get('downloadRequested') === false
                ) {
                    controller.onSaveItem(rec);
                }
            }
        }, {
            // remove from list icon (available for finished jobs)
            xtype: 'actioncolumn',
            text: ' ',
            dataIndex: 'status',
            tooltip: i18n.getMsg('downloadqueue.delete'),
            width: 20,
            getClass: function(value, meta, rec) {
                return rec.get('done') ? 'delete' : '';
            },
            handler: function(grid, rowIndex) {
                var store = grid.getStore();
                var rec = store.getAt(rowIndex);
                if (rec.get('done') === true) {
                    controller.onDeleteItem(rec, store);
                }
            }

        }];
        this.callParent(arguments);
    }
});
