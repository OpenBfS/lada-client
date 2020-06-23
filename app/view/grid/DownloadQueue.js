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
// TODO layout of parent

var controller = Lada.app.getController(
    'Lada.controller.grid.Downloads');


Ext.define('Lada.view.grid.DownloadQueue', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.downloadqueuegrid',
    requires: ['Lada.controller.grid.Downloads'],
    store: null,
    minHeight: 150,
    viewConfig: {
        deferEmptyText: true
    },
    emptyText: 'emptygrid.downloadqueue',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptygrid.downloadqueue');
        this.store = Ext.data.StoreManager.get('downloadqueue');
        this.columns = [{
            header: i18n.getMsg('export.filename'),
            dataIndex: 'filename',
            flex: 1
        }, {
            header: i18n.getMsg('print.startDate'),
            dataIndex: 'startDate',
            renderer: function(value) {
                return Lada.util.Date.formatTimestamp(value, 'hh:mm:ss');
            },
            flex: 1
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
            xtype: 'actioncolumn', // cancel/save icon
            text: ' ',
            dataIndex: 'status',
            getClass: function(value, meta, rec) {
                // see x.action-col-icon definitions at lada.css for img urls
                switch (rec.get('status')) {
                    case 'finished':
                        return 'save';
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
                } else if (status === 'finished') {
                    controller.onSaveItem(rec);
                }
            }
        }, {
            xtype: 'actioncolumn', // remove from list icon (available for finished jobs)
            text: ' ',
            dataIndex: 'status',
            getClass: function(value, meta, rec) {
                return rec.get('done') ? 'delete' : '';
            },
            handler: function(grid, rowIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                if (rec.get('done') === true) {
                    controller.onCancelItem(rec);
                }
            }

        }];
        this.callParent(arguments);
    }
});
