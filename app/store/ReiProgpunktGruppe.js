/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Store for KtaGruppe
 */
Ext.define('Lada.store.ReiProgpunktGruppe', {
    extend: 'Ext.data.Store',
    model: 'Lada.model.ReiProgpunktGruppe',
    sorters: [
        {
            property: 'id',
            direction: 'ASC'
        }, {
            property: 'reiProgPunktGruppe',
            direction: 'ASC'
        }
    ],
    autoLoad: true,
    sortOnLoad: true,
    proxy: {
        type: 'rest',
        url: 'lada-server/rest/reiprogpunktgruppe',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    },


    setExtraParams: function(params, oldVal, reicombo, umweltcombo) {
        this.clearListeners();
        if (!oldVal) {
            this.proxy.extraParams = params;
            this.load();
            return;
        }
        this.proxy.extraParams = params;
        this.load({
            scope: this,
            callback: function(records) {

                var found = false;
                for (var i = 0; i < records.length; i++) {
                    if (records[i].id === oldVal) {
                        found = true;
                        reicombo.select(records[i]);
                    }
                }
                if (!found) {
                    Lada.model.ReiProgpunktGruppe.load(oldVal, {
                        scope: this,
                        callback: function(record, op, success) {
                            if (record && success) {
                                this.add(record);
                                reicombo.select(record);
                                reicombo.up('reiprogpunktgruppe')
                                    .setUmweltWarningVisible(true);
                                umweltcombo.up('umwelt')
                                    .setReiWarningVisible(true);

                                this.onAfter({
                                    load: {
                                        fn: function(store) {
                                            store.add(record);
                                            reicombo.select(record);
                                            reicombo.up('reiprogpunktgruppe')
                                                .setUmweltWarningVisible(true);
                                            umweltcombo.up('umwelt')
                                                .setReiWarningVisible(true);
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
                } else {
                    reicombo.up('reiprogpunktgruppe').clearWarningOrError();
                    umweltcombo.up('umwelt').clearWarningOrError();
                }
            }
        });
    }
});
