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
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id'
    }, {
        name: 'columnIndex',
        type: 'int'
    }, {
        name: 'filterActive',
        type: 'boolean'
    }, {
        name: 'filterValue',
        allowNull: true
    }, {
        name: 'sort',
        allowNull: true
    }, {
        name: 'sortIndex',
        type: 'int',
        allowNull: true
    }, {
        name: 'userId',
        type: 'int',
        allowNull: true
    }, {
        name: 'visible',
        type: 'boolean'
    }, {
        name: 'width',
        type: 'int',
        allowNull: true
    }, {
        name: 'gridColumnId',
        type: 'int'
    }, {
        name: 'dataIndex',
        persist: false
    }, {
        name: 'filterNegate',
        type: 'boolean'
    }, {
        name: 'filterRegex',
        type: 'boolean'
    }, {
        name: 'filterIsNull',
        type: 'boolean'
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
