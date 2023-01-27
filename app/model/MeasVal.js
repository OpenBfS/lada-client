/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.model.MeasVal', {
    extend: 'Lada.model.LadaBase',

    fields: [{
        name: 'id'
    }, {
        name: 'owner',
        type: 'boolean'
    }, {
        name: 'readonly',
        type: 'boolean',
        persist: false
    }, {
        name: 'measmId',
        type: 'int'
    }, {
        name: 'measdId',
        type: 'int'
    }, {
        name: 'measVal',
        type: 'float',
        allowNull: true
    }, {
        name: 'lessThanLOD',
        convert: function(v) {
            if (!v) {
                return null;
            }
            return '<';
        }
    }, {
        name: 'error',
        type: 'float',
        allowNull: true
    }, {
        name: 'detectLim',
        type: 'float',
        allowNull: true
    }, {
        name: 'measUnitId',
        type: 'int'
    }, {
        name: 'lastMod',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'treeMod',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'parentModified',
        type: 'date',
        dateFormat: 'time'
    }, {
        name: 'warnings',
        persist: false
    }, {
        name: 'errors',
        persist: false
    }]
});
