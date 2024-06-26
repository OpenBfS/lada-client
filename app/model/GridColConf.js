/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.GridColConf', {
    requires: [
        'Lada.model.field.NonBlankString'
    ],
    extend: 'Lada.model.ValidatedModel',
    fields: [{
        name: 'id'
    }, {
        name: 'colIndex',
        type: 'int'
    }, {
        name: 'isFilterActive',
        type: 'boolean'
    }, {
        name: 'filterVal',
        allowNull: true
    }, {
        name: 'sort',
        allowNull: true,
        type: 'nonblankstring'
    }, {
        name: 'sortIndex',
        type: 'int',
        allowNull: true
    }, {
        name: 'ladaUserId',
        type: 'int',
        allowNull: true
    }, {
        name: 'isVisible',
        type: 'boolean'
    }, {
        name: 'width',
        type: 'int',
        allowNull: true
    }, {
        name: 'gridColMpId',
        type: 'int'
    }, {
        name: 'dataIndex',
        persist: false
    }, {
        name: 'isFilterNegate',
        type: 'boolean'
    }, {
        name: 'isFilterRegex',
        type: 'boolean'
    }, {
        name: 'isFilterNull',
        type: 'boolean'
    }, {
        name: 'name',
        persist: false
    }]
});
