/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid for the upload queue.
 */
Ext.define('Lada.view.grid.UploadQueue', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.uploadqueuegrid',
    requires: [
        'Lada.controller.grid.Uploads'
    ],

    controller: 'upload',

    viewConfig: {
        deferEmptyText: true,
        markDirty: false
    },
    emptyText: 'emptygrid.uploadqueue',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var controller = this.controller;
        this.emptyText = i18n.getMsg('emptygrid.uploadqueue');
        this.columns = [{
            header: i18n.getMsg('export.filename'),
            dataIndex: 'filename',
            renderer: function(value) {
                return '<div style="white-space: normal !important;">' +
                    Ext.htmlEncode(value) + '</div>';
            },
            flex: 1.2
        }, {
            header: i18n.getMsg('print.startDate'),
            dataIndex: 'startDate',
            width: 80,
            renderer: function(value) {
                return Lada.util.Date.formatTimestamp(value, 'HH:mm:ss');
            }
        }, {
            header: i18n.getMsg('print.status'),
            dataIndex: 'status',
            width: 80,
            renderer: function(value) {
                return i18n.getMsg( 'print.status.' + value.toLowerCase());
            }
        }, {
            header: i18n.getMsg('print.message'),
            dataIndex: 'message',
            renderer: function(value) {
                return '<div style="white-space: normal !important;">' +
                    Ext.htmlEncode(value) + '</div>';
            },
            flex: 2
        }, {
            xtype: 'actioncolumn',
            text: ' ',
            dataIndex: 'warningsAndErrors',
            menuText: i18n.getMsg('note'),
            width: 20,
            getTip: function(value, meta, rec) {
                if (rec.get('status').toLowerCase() === 'error') {
                    return i18n.getMsg('importResponse.failure.true');
                }
                if (!rec.get('warnings')
                    && !rec.get('errors')
                    && !rec.get('notifications')
                ) {
                    return ' ';
                }
                if (!rec.get('warnings') && !rec.get('notifications')) {
                    return i18n.getMsg('importResponse.failure.true');
                }
                if (!rec.get('errors')
                    && !rec.get('warnings')
                    && rec.get('notifications')
                ) {
                    return i18n.getMsg('importResponse.notifications.true');
                }
                if (!rec.get('errors')
                    && rec.get('warnings')
                    && rec.get('notifications')
                ) {
                    return i18n.getMsg(
                        'importResponse.warningsANDnotifications.true');
                }
                if (!rec.get('errors')
                    && rec.get('warnings')
                    && !rec.get('notifications')
                ) {
                    return i18n.getMsg('importResponse.warnings.warninglist');
                }
                if (rec.get('errors')
                    && rec.get('warnings')
                    && rec.get('notifications')
                ) {
                    return i18n.getMsg(
                        'importResponse.failureAndWarningsAndNotifications.true'
                    );
                }
                if (rec.get('errors')
                    && !rec.get('warnings')
                    && rec.get('notifications')
                ) {
                    return i18n.getMsg(
                        'importResponse.failureAndNotifications.true');
                }
                if (rec.get('errors')
                    && rec.get('warnings')
                    && !rec.get('notifications')
                ) {
                    return i18n.getMsg(
                        'importResponse.failureAndWarnings.true');
                }
            },
            getClass: function(value, meta, rec) {
                // see x.action-col-icon definitions at lada.css for img urls
                if (rec.get('errors') || rec.get('status').toLowerCase() === 'error') {
                    return 'error';
                }
                if (rec.get('warnings')) {
                    return 'warning';
                }
                return rec.get('notifications') ? 'notification' : ' ';
            }
        }, {
            // cancel/download icon
            xtype: 'actioncolumn',
            text: ' ',
            dataIndex: 'status',
            menuText: i18n.getMsg('save'),
            getTip: function(value, meta, rec) {
                switch (rec.get('status').toLowerCase()) {
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
                switch (rec.get('status').toLowerCase()) {
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
                var status = rec.get('status').toLowerCase();
                if (status === 'running' || status === 'waiting') {
                    controller.onCancelItem(rec);
                } else if (
                    rec.get('status').toLowerCase() === 'finished'
                ) {
                    controller.onSaveItem(rec);
                }
            }
        }, {
            // remove from list icon (available for finished jobs)
            xtype: 'actioncolumn',
            text: ' ',
            menuText: i18n.getMsg('delete'),
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
