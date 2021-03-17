/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for Queued Downloads and print jobs.
 */
Ext.define('Lada.model.DownloadQueue', {
    extend: 'Ext.data.Model',

    /**
     */
    fields: [{
        name: 'id'
    }, {
        name: 'type'
        // 'lada-print', 'laf'
    }, {
        name: 'refId'
        // a unique identifier
    }, {
        name: 'filename'
    }, {
        name: 'mapfish_statusURL'
    }, {
        name: 'mapfish_downloadURL'
    }, {
        name: 'startDate'
    }, {
        name: 'status'
        // possible states:
        //      preparation
        //      waiting
        //      running
        //      finished
        //      cancelled
        //      error
    }, {
        name: 'message'
    }, {
        name: 'done',
        type: 'boolean'
    }, {
        name: 'autodownload',
        type: 'boolean'
    }, {
        name: 'downloadRequested',
        type: 'boolean'
    }],
    idProperty: 'id'
});
