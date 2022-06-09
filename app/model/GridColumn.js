/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for fixed Column configuration. Columns are set in the database, and
 * are readonly to the client.
 */
Ext.define('Lada.model.GridColumn', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id'
    }, {
        name: 'dataIndex'
    }, {
        name: 'dataType'
    }, {
        name: 'filter'
        // Object with: id, name, parameter, sql, filterType.id,
        // filterType.multiselect, filterType.type
    }, {
        name: 'name'
    }, {
        name: 'position',
        type: 'int'
    }, {
        name: 'baseQuery',
        type: 'int'
    }],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: 'lada-server/rest/column',
        reader: {
            type: 'json',
            totalProperty: 'totalCount',
            rootProperty: 'data'
        }
    }
});
