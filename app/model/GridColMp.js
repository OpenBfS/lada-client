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
Ext.define('Lada.model.GridColMp', {
    extend: 'Lada.model.LadaBase',
    fields: [{
        name: 'id'
    }, {
        name: 'dataIndex'
    }, {
        name: 'dataType'
    }, {
        name: 'filter'
        // TODO: use proper model class
        // Object with: id, name, parameter, sql, filterType.id,
        // filterType.multiselect, filterType.type
    }, {
        name: 'gridCol'
    }, {
        name: 'position',
        type: 'int'
    }, {
        name: 'baseQuery',
        type: 'int'
    }],
    idProperty: 'id',
});
