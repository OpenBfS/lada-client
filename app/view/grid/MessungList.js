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
Ext.define('Lada.view.grid.MessungList', {
    extend: 'Lada.view.widget.DynamicGrid',
    alias: 'widget.messunglistgrid',
    title: 'messung.gridTitle',
    emptyText: 'emptygrid.messungen',
    toolbarbuttons: [{
        text: 'statusSetzen',
        icon: 'resources/img/mail-mark-notjunk.png',
        action: 'setstatus',
        disabled: true //disabled on start, enabled by the controller
    }]
});
