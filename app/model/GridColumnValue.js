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
Ext.define('Lada.model.GridColumnValue', {
    extend: 'Lada.model.LadaBase',
    fields: [{
        name: 'id'
    }, {
        name: 'columnIndex'
    }, {
        name: 'filterActive'
    }, {
        name: 'filterValue'
    }, {
        name: 'sort'
    }, {
        name: 'sortIndex'
    }, {
        name: 'userId'
    }, {
        name: 'qid'
    }, {
        name: 'visible'
    }, {
        name: 'width'
    }, {
        name: 'gridColumnId'
    }, {
        name: 'dataIndex',
        persist: false
    }, {
        name: 'filterNegate'
    }, {
        name: 'filterRegex'
    }, {
        name: 'filterIsNull'
    }, {
        name: 'name',
        persist: false
    }],
    proxy: {
        type: 'rest',
        url: 'lada-server/rest/columnvalue',
        reader: {
            type: 'json',
            totalProperty: 'totalCount',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: true
        }
    }
});
