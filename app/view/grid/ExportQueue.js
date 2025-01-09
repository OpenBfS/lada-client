/* Copyright (C) 2024 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid for the export queue.
 */
Ext.define('Lada.view.grid.ExportQueue', {
    extend: 'Lada.view.grid.DownloadQueue',
    alias: 'widget.exportqueue',
    requires: [
        'Lada.controller.grid.Downloads'
    ],

    controller: 'export'
});
