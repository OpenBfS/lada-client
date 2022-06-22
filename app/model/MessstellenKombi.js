/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for MessstellenKombi aus den Stammdaten.
 */
Ext.define('Lada.model.MessstellenKombi', {
    extend: 'Lada.model.LadaBase',

    /**
     * Fields are:
     *  - id: The unique identifier (Primary key).
     *  - messStelle
     *  - laborMst
     */
    fields: [{
        name: 'id'
    }, {
        name: 'funktionId',
        type: 'int',
        allowNull: true
    }, {
        name: 'laborMstId',
        allowNull: true
    }, {
        name: 'ladaGroup'
    }, {
        name: 'mstId',
        allowNull: true
    }, {
        name: 'netzbetreiberId',
        allowNull: true
    }],

    idProperty: 'id',

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/messstellenkombi',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
