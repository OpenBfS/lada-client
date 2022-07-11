/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for Messstelle Stammdaten.
 */
Ext.define('Lada.model.MessstelleLabor', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'messStelle'
    }, {
        name: 'laborMst'
    }, {
        name: 'netzbetreiberId'
    }, {
        name: 'displayCombi'
    }]
});
