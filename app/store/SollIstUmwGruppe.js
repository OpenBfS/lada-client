/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for SollIstUmwGruppe
 */

Ext.define('Lada.store.SollIstUmwGruppe', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.SollIstUmwGruppe',
    sorters: [{
        property: 'id',
        direction: 'ASC'
    }],
    autoLoad: true,
    filters: [function(item) {
        if (item.data.beschreibung !== 'Summe') {
            return true;
        }
        return false;
    }]
});
