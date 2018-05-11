/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Model for customized Column configuration
 */
Ext.define('Lada.model.GridColumn', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id'
    },{
        name: 'columnIndex'
    },{
        name: 'filterActive'
    },{
        name: 'filterValue'
    },{
        name: 'sort'
    },{
        name: 'sortIndex'
    },{
        name: 'userId'
    },{
        name: 'visible'
    },{
        name: 'width'
    },{
        name: 'gridColumnId'
    }, {
        name: 'dataIndex',
        persist: false
    }, {
        name: 'name',
        persist: false
    }],
    idProperty: 'id'
});
