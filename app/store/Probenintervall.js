/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a Store which maps between the identifiers
 * of a probenintervall and their meanings.
 */

Ext.define('Lada.store.Probenintervall', {
    extend: 'Ext.data.Store',
    fields: ['probenintervall',
            {
                name: 'piTexti18nId',
                convert: function(v, record) {
                    var i18n = Lada.getApplication().bundle;
                    return i18n.getMsg(v);
                }
            },
            'periodstart',
            'periodend'],
    storeId: 'probenintervall',
    data: [{
        'probenintervall': 'J',
        'piTexti18nId': 'pi.yearly',
        'periodstart': 1,
        'periodend': 365
    }, {
        'probenintervall': 'H',
        'piTexti18nId': 'pi.halfyearly',
        'periodstart': 1,
        'periodend': 183
    }, {
        'probenintervall': 'Q',
        'piTexti18nId': 'pi.quarteryearly',
        'periodstart': 1,
        'periodend': 91
    }, {
        'probenintervall': 'M',
        'piTexti18nId': 'pi.monthly',
        'periodstart': 1,
        'periodend': 30
    }, {
        'probenintervall': 'W4',
        'piTexti18nId': 'pi.fourweekly',
        'periodstart': 1,
        'periodend': 28
    }, {
        'probenintervall': 'W2',
        'piTexti18nId': 'pi.twoweekly',
        'periodstart': 1,
        'periodend': 14
    }, {
        'probenintervall': 'W',
        'piTexti18nId': 'pi.weekly',
        'periodstart': 1,
        'periodend': 7
    }, {
        'probenintervall': 'T',
        'piTexti18nId': 'pi.daily',
        'periodstart': 1,
        'periodend': 1
    }],
    sorters: [{
        property: 'periodend',
        direction: 'DESC'
    }],
    sortOnLoad: true,
    remoteSort: false
});


