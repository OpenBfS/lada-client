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
        this.clearListeners();
        if (!oldVal) {
            this.proxy.extraParams = params;
            this.load();
            return;
        }
        this.proxy.extraParams = params;
        var fieldset = umweltcombo.up('umwelt').up('fieldset[title=Medium]');
        fieldset.setLoading(true);
        this.load({
            scope: this,
            callback: function(records, op, success) {
                reicombo.up('reiprogpunktgruppe').clearWarningOrError();
                umweltcombo.up('umwelt').clearWarningOrError();
                var found = false;
                for (var i = 0; i < records.length; i++) {
                    if (records[i].id === oldVal) {
                        found = true;
                        umweltcombo.select(records[i]);
                    }
                }
                if (!found) {
                    Lada.model.Umwelt.load(oldVal, {
                        scope: this,
                        callback: function(record, op, success) {
                            if (record && success) {
                                this.add(record);
                                umweltcombo.select(record);
                                umweltcombo.up('umwelt').setReiWarningVisible(true);
                                reicombo.up('reiprogpunktgruppe').setUmweltWarningVisible(true);

                                this.onAfter({
                                    load: {
                                        fn: function(store, records) {
                                            store.add(record);
                                            umweltcombo.select(record);
                                            umweltcombo.up('umwelt').setReiWarningVisible(true);
                                            reicombo.up('reiprogpunktgruppe')
                                                    .setUmweltWarningVisible(true);
                                        },
                                        single: true,
                                        scope: this,
                                        options: {
                                            priority: 999
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
                fieldset.setLoading(false);
            }
        });
    }
});
