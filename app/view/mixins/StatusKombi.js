/* Copyright (C) 2025 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Mixin providing special functions for handling Deskriptor fieldset.
 */
Ext.define('Lada.view.mixins.StatusKombi', {
    determineKombi: function(record) {
        var statusProt = record.getStatusProt();
        var statusMpId = statusProt.get('statusMpId');
        var kombis = Ext.data.StoreManager.get('statuskombi');
        var kombi = kombis.getById(statusMpId);
        return kombi;
    }
});
