/* Copyright (C) 2025 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Mixin providing helper to determine statuskombi from a record
 */
Ext.define('Lada.view.mixins.StatusKombi', {
    determineKombi: function(record) {
        var statusProt = record.getStatusProt();
        var statusMpId = null;
        if (statusProt) {
            statusMpId = statusProt.get('statusMpId');
        } else {
            // Fallback for the rare case that after a POST the
            // Statusprot wasn't correctly deserialized and ended
            // up as an Object on the record
            statusProt = record.get('statusProt');
            if (!statusProt) {
                // in case everything went south tell someone
                throw new Error('No StatusProt found!');
            }
            statusMpId = statusProt['statusMpId'];
        }
        var kombis = Ext.data.StoreManager.get('statuskombi');
        var kombi = kombis.getById(statusMpId);
        return kombi;
    }
});
