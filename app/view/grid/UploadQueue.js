/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid for the UploadQueue - Stores, listing all uploads that have been
 * initiated and might have pending results
 */


Ext.define('Lada.view.grid.UploadQueue', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.uploadueuegrid',
    // requires: ['Lada.controller.grid.Uploads'],
    store: null, //TODO needs to be set
    viewConfig: {
        deferEmptyText: true,
        markDirty: false
    },
    emptyText: 'emptygrid.uploadqueue',
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var controller = Lada.app.getController(
            'Lada.controller.grid.Uploads');
        this.emptyText = i18n.getMsg('emptygrid.uploadqueue');
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
            xtype: 'actioncolumn',
            text: ' ',
            dataIndex: 'warningsAndErrors',
            width: 20,
            getTip: function(value, meta, rec) {
                if (rec.get('status') === 'error') {
                    return i18n.getMsg('importResponse.failure.true');
                }
                if (!rec.get('warnings') && !rec.get('errors')) {
                    return ' ';
                }
                if (!rec.get('warnings')) {
                    return i18n.getMsg('importResponse.failure.true');
                }
                if (!rec.get('errors')){
                    return i18n.getMsg('importResponse.warnings.true');
                }
                return i18n.getMsg('importResponse.failureAndWarnings.true');
            },
            getClass: function (value, meta, rec) {
                // see x.action-col-icon definitions at lada.css for img urls
                if (rec.get('errors') || rec.get('status') === 'error'){
                    return 'error';
                }
                return rec.get('warnings') ? 'warning' : ' ';
            }
        }, {
            // cancel/download icon
            xtype: 'actioncolumn',
            text: ' ',
            dataIndex: 'status',
            getTip: function(value, meta, rec) {
                switch (rec.get('status')) {
                    case 'finished':
                        if (!rec.get('downloadRequested')) {
                            return i18n.getMsg('import.showresult');
                        } else {
                            return false;
                        }
                    case 'running':
                    case 'waiting':
                        return i18n.getMsg('cancel');
                    default:
                        return ' ';
                }
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
                    rec.get('status') === 'finished'
                ) {
                    controller.getResult(rec);
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
