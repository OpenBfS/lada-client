/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.Auth', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'authFunctId',
        type: 'int',
        allowNull: true
    }, {
        name: 'apprLabId',
        allowNull: true
    }, {
        name: 'ldapGr'
    }, {
        name: 'measFacilId',
        allowNull: true
    }, {
        name: 'networkId',
        allowNull: true
    }, {
        name: 'displayCombi',
        calculate: function(record) {
            if (record.measFacilId || record.apprLabId) {
                var mstStore = Ext.data.StoreManager.get('messstellen');
                var mst = mstStore.getById(record.measFacilId);
                var mstName = mst ? mst.get('name') : '';
                if (record.measFacilId === record.apprLabId) {
                    return mstName;
                }
                var laborMst = mstStore.getById(record.apprLabId);
                var laborMstName = laborMst ? laborMst.get('name') : '';
                return mstName + (laborMstName ? '/' + laborMstName : '');
            }
            return '';
        }
    }]
});
