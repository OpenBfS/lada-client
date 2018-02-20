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

    printable: true,
    exportable: true,
    title: 'messprogramme.gridTitle',
    emptyText: 'messprogramme.emptyGrid',

    toolbarbuttons: [{
        text: 'messprogramme.button.create',
        icon: 'resources/img/list-add.png',
        action: 'addMessprogramm',
        disabled: true
    }, {
        text: 'messprogramme.button.generate',
        icon: 'resources/img/view-time-schedule-insert.png',
        action: 'genProbenFromMessprogramm',
        disabled: true // disabled on startup, will be enabled by controller if necessary
    }]
});


