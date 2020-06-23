/* Copyright (C) 2013-2020 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * A vindow for viewing the queue for asynchronous actions
 */
Ext.define('Lada.view.window.Downloads', {
    extend: 'Ext.window.Window',
    alias: 'widget.downloadqueuewin',
    // TODO clear 'old' jobs (controller.onDeleteItem(item)) -> automated ?
    collapsible: true,
    margin: '0, 5, 15, 5',
    maximizable: true,
    layout: 'fit',
    requires: ['Lada.view.grid.DownloadQueue'],
    items: [{
        xtype: 'downloadqueuegrid'
    }, {
        xtype: 'checkbox',
        name: 'autodownload',
        value: true
    }],

    initComponent: function() {
        this.callParent(arguments);
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('printqueue.title');
        this.down('checkbox[name=autodownload]').boxLabel = i18n.getMsg(
            'print.autodownload');
    }
});
