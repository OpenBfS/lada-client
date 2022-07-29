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
        name: 'funktionId'
    }, {
        name: 'laborMstId'
    }, {
        name: 'ladaGroup'
    }, {
        name: 'mstId'
    }, {
        name: 'netzbetreiberId'
    }, {
        name: 'displayCombi',
        calculate: function(record) {
            if (record.mstId || record.laborMstId) {
                var mstStore = Ext.data.StoreManager.get('messstellen');
                var mst = mstStore.getById(record.mstId);
                var mstName = mst ? mst.get('messStelle') : '';
                if (record.mstId === record.laborMstId) {
                    return mstName;
                }
                var laborMst = mstStore.getById(record.laborMstId);
                var laborMstName = laborMst ? laborMst.get('messStelle') : '';
                return mstName + (laborMstName ? '/' + laborMstName : '');
            }
            return '';
        }
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
