/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.override.StringFilter', {
    override: 'Ext.ux.grid.filter.StringFilter',

    validateRecord: function(record) {
        if (this.dataIndex === 'gemId') {
            var store = Ext.data.StoreManager.get('verwaltungseinheiten');
            var item = store.getById(record.get('gemId'));
            var comp = item.get('bezeichnung');
            return comp.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
        }
        else if (this.dataIndex === 'staatId') {
            var store = Ext.data.StoreManager.get('staaten');
            var item = store.getById(record.get('staatId'));
            var comp = item.get('staatIso');
            return comp.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
        }
        else {
            var val = record.get(this.dataIndex);
            if(typeof val != 'string') {
                return (this.getValue().length === 0);
            }
            return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
        }
    }
});
