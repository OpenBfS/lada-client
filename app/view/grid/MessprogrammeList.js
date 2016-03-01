/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid to list the result of the Filter
 */
Ext.define('Lada.view.grid.MessprogrammeList', {
    extend: 'Lada.view.widget.DynamicGrid',
    alias: 'widget.messprogrammelistgrid',

    requires: 'Lada.view.window.DeleteProbe',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('messprogramme.emptyGrid');

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'tbtext',
                text: i18n.getMsg('messprogramme.gridTitle')
            },
            '->',
            {
                text: i18n.getMsg('messprogramme.button.create'),
                icon: 'resources/img/list-add.png',
                action: 'addMessprogramm'
            }, {
                text: i18n.getMsg('messprogramme.button.generate'),
                icon: 'resources/img/view-time-schedule-insert.png',
                action: 'genProbenFromMessprogramm',
                disabled: true // disabled on startup, will be enabled by controller if necessary
            }]
        }];
        this.columns = [];
        this.callParent(arguments);
    }
});


