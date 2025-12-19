/* Copyright (C) 2025 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Mixin providing helper to determine statusMpId of last StatusProt
 * from a record.
 */
Ext.define('Lada.view.mixins.StatusKombi', {
    determineKombi: function(record) {
        var statusProts = record.statusProts();
        const statusMpIdKey = 'statusMpId';
        var statusMpId = null;
        if (statusProts.count() > 0) {
            statusMpId = statusProts.last().get(statusMpIdKey);
        } else {
            // Fallback for the rare case that after a POST the
            // association wasn't correctly deserialized and ended
            // up as an array on the record
            var statusProtArray = record.get('statusProts');
            if (!statusProtArray || statusProtArray.length === 0) {
                // in case everything went south tell someone
                throw new Error('No statusProts found!');
            }
            statusMpId = statusProtArray[statusProtArray.length - 1][
                statusMpIdKey];
        }
        var kombis = Ext.data.StoreManager.get('statuskombi');
        var kombi = kombis.getById(statusMpId);
        return kombi;
    }
});
