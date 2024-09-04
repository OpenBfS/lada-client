/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for Queued uploads.
 */
Ext.define('Lada.model.UploadQueue', {
    extend: 'Lada.model.LadaBase',

    /**
     */
    fields: [{
        name: 'id'
    }, {
        name: 'type'
        // '', 'laf'
    }, {
        name: 'refId'
        // a unique identifier
    }, {
        name: 'filename'
    }, {
        name: 'result'
    }, {
        name: 'resultFetched'
    }, {
        name: 'startDate'
    }, {
        name: 'status'
        // possible states:
        //      waiting
        //      running
        //      finished
        //      error
    }, {
        name: 'message'
    }, {
        name: 'done',
        type: 'boolean'
    }, {
        name: 'errors',
        type: 'boolean'
    }, {
        name: 'warnings',
        type: 'boolean'
    }, {
        name: 'measFacilId'
    }, {
        name: 'encoding'
    }],
    idProperty: 'id'
});
