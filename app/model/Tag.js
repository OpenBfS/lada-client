/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This class represents and defines the model of a Tag
 **/
Ext.define('Lada.model.Tag', {
    requires: [
        'Lada.model.field.NonBlankString'
    ],
    extend: 'Lada.model.ValidatedModel',

    fields: [{
        name: 'name',
        type: 'nonblankstring'
    }, {
        name: 'measFacilId',
        type: 'string',
        allowNull: true
    }, {
        name: 'networkId',
        type: 'string',
        allowNull: true
    }, {
        name: 'createdAt',
        type: 'date'
    }, {
        name: 'tagType',
        type: 'string',
        persist: false,
        calculate: function(data) {
            if (data.networkId !== null) {
                return 'netz';
            }
            if (data.measFacilId !== null) {
                return 'mst';
            }
            return 'global';
        }
    }, {
        name: 'isAutoTag',
        type: 'boolean'
    }, {
        name: 'valUntil',
        type: 'date'
    }, {
        name: 'readonly',
        type: 'boolean'
    }],

    proxy: {
        type: 'rest',
        url: 'lada-server/rest/tag',
        writer: {
            type: 'json',
            writeAllFields: true,
            transform: function(data, request) {
                // Omit ID generated by ExtJS in POST request
                if (request.getAction() === 'create') {
                    var model = request.getProxy().getModel();
                    if (model instanceof String) {
                        model = Ext.ClassManager.get(model);
                    }
                    delete data[model.idProperty];
                }
                return data;
            }
        }
    },

    isAssignable: function() {
        return Lada.model.Tag.isTagAssignable(this.getData());
    },

    statics: {
        /**
         * Check whether the user might assign the tag, given as plain object.
         */
        isTagAssignable: function(tag) {
            switch (tag.tagType) {
                case 'netz':
                    return Ext.Array.contains(
                        Lada.netzbetreiber, tag.networkId);
                case 'mst':
                    return Ext.Array.contains(Lada.mst, tag.measFacilId);
                default:
                    return true;
            }
        }
    }
});
