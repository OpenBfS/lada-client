/* Copyright (C) 2024 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid for the print queue.
 */
Ext.define('Lada.view.grid.PrintQueue', {
    extend: 'Lada.view.grid.DownloadQueue',
    alias: 'widget.printqueue',
    requires: [
        'Lada.controller.Print'
    ],

    controller: 'print'
});
