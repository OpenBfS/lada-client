/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for Umweltbereiche
 */
Ext.define('Lada.store.Umwelt', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.Umwelt',
    sorters: [{
        property: 'id',
        direction: 'ASC'
    }, {
        property: 'umweltBereich',
        direction: 'ASC',
        transform: function(val) {
            if (val) {
                return val.toLowerCase();
            }
            return '';
        }
    }],
    sortOnLoad: true,
    remoteSort: false,
    autoLoad: true,


    setExtraParams: function(params, oldVal, umweltcombo, reicombo) {
        var backupRecord = this.getById(oldVal);
        if (backupRecord) {
            this.on({
                load: {
                    fn: function(store, records) {
                        reicombo.up('reiprogpunktgruppe').setUmweltWarningVisible(false);
                        reicombo.up('reiprogpunktgruppe').clearWarningOrError();
                        umweltcombo.up('umwelt').clearWarningOrError();
                        umweltcombo.up('umwelt').setReiWarningVisible(false);
                        var found = false;
                        for (var i = 0; i < records.length; i++) {
                            if (records[i].id === backupRecord.id) {
                                found = true;
                            }
                        }
                        if (!found) {
                            store.add(backupRecord);
                            umweltcombo.suspendEvents();
                            umweltcombo.select(backupRecord);
                            umweltcombo.resumeEvents();
                            umweltcombo.up('umwelt').setReiWarningVisible(true);
                            reicombo.up('reiprogpunktgruppe').setUmweltWarningVisible(true);
                        }
                    },
                    single: true,
                    scope: this,
                    options: {
                        priority: 999
                    }
                }
            });
        }
        this.proxy.extraParams = params;
        this.load();
    }
});
