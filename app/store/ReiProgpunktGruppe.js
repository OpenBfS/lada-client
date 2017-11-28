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
        }],
    autoLoad: true,
    sortOnLoad: true,


    setExtraParams: function(params, oldVal, reicombo, umweltcombo) {
        this.clearListeners();
        if (!oldVal) {
            this.proxy.extraParams = params;
            this.load();
            return;
        }
        Lada.model.ReiProgpunktGruppe.load(oldVal, {
            scope: this,
            callback: function(record, op, success) {
                if (record && success) {
                    this.onAfter({
                        load: {
                            fn: function(store, records) {
                                reicombo.up('reiprogpunktgruppe').clearWarningOrError();
                                umweltcombo.up('umwelt').clearWarningOrError();
                                reicombo.up('reiprogpunktgruppe').setUmweltWarningVisible(false);
                                umweltcombo.up('umwelt').setReiWarningVisible(false);

                                var found = false;
                                for (var i = 0; i < records.length; i++) {
                                    if (records[i].id === record.id) {
                                        found = true;
                                    }
                                }
                                if (!found) {
                                    store.add(record);
                                    reicombo.select(record);
                                    reicombo.up('reiprogpunktgruppe').setUmweltWarningVisible(true);
                                    umweltcombo.up('umwelt').setReiWarningVisible(true);
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
    }
});
