/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for SollIstMmtGruppe
 */

Ext.define('Lada.store.SollIstMmtGruppe', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.SollIstMmtGruppe',
    sorters: [{
        property: 'id',
        direction: 'ASC'
    }],
    autoLoad: true
});