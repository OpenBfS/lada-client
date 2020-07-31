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
    requires: ['Lada.view.grid.DownloadQueue'],
    collapsible: true,
    maximizable: true,
    resizable: true,
    width: 550,
    layout: 'fit',
    items: [{
        xtype: 'downloadqueuegrid',
        width: '100%'

    }],

    initComponent: function() {
        this.callParent(arguments);
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('downloadqueue.title');
    }
});
