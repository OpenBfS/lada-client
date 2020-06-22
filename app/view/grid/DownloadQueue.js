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
    minHeight: 20,
    store: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
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
            xtype: 'actioncolumn',
            text: '',
            dataIndex: 'status',
            renderer: function(value) {
                switch (value) {
                    case 'finished':
                        return 'SAVE';
                        // TODO save button
                    case 'running':
                    case 'waiting':
                        return 'CANCEL';
                        // TODO cancel button
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
        }];
        this.callParent(arguments);
    }
});
