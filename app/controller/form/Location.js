/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.controller.form.Location', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'locationform button[action=save]': {
                click: this.save
            },
            'locationform button[action=discard]': {
                click: this.discard
            },
            'locationform': {
                dirtychange: this.dirtyForm
            },
            'locationform numberfield[name=latitude]': {
                change: this.updateFeatureLatitude
            },
            'locationform numberfield[name=longitude]': {
                change: this.updateFeatureLongitude,
            }
        });
    },

    save: function(button) {
        var formPanel = button.up('form');
        var data = formPanel.getForm().getFieldValues(true);
        for (var key in data) {
            formPanel.getForm().getRecord().set(key, data[key]);
        }
        formPanel.getForm().getRecord().save({
            success: function(record, response) {
                var json = Ext.decode(response.response.responseText);
                if (json) {
                    button.setDisabled(true);
                    button.up('toolbar').down('button[action=discard]')
                        .setDisabled(true);
                    formPanel.clearMessages();
                    formPanel.setRecord(record);
                    formPanel.setMessages(json.errors, json.warnings);
                    button.up('window').down('map').locationRecord = null;
                    var orte = button.up('window').down('ortform combobox');
                    orte.store.reload({
                        callback: function() {
                            orte.setValue(record.data.id);
                        }
                    });
                }
            },
            failure: function(record, response) {
                button.setDisabled(true);
                button.up('toolbar').down('button[action=discard]')
                    .setDisabled(true);
                formPanel.getForm().loadRecord(formPanel.getForm().getRecord());
                var json = response.request.scope.reader.jsonData;
                if (json) {
                    formPanel.setMessages(json.errors, json.warnings);
                }
            }
        });
    },

    discard: function(button) {
        var formPanel = button.up('form');
        formPanel.getForm().loadRecord(formPanel.getForm().getRecord());
        button.up('window').down('map').locationRecord = null;
    },

    dirtyForm: function(form, dirty) {
        if (dirty) {
            form.owner.down('button[action=save]').setDisabled(false);
            form.owner.down('button[action=discard]').setDisabled(false);
        }
        else {
            form.owner.down('button[action=save]').setDisabled(true);
            form.owner.down('button[action=discard]').setDisabled(true);
        }
    },

    updateFeatureLatitude: function(field, nValue) {
        var layer = field.up('window').down('map').selectControl.layer;
        var newLocation = field.up('window').down('map').locationRecord;
        if (layer && layer.selectedFeatures[0] && newLocation) {
            var feature = layer.getFeatureById(layer.selectedFeatures[0].id);
            feature.move(new OpenLayers.LonLat(feature.geometry.x, nValue));
            layer.refresh();
        }
    },

    updateFeatureLongitude: function(field, nValue) {
        var layer = field.up('window').down('map').selectControl.layer;
        var newLocation = field.up('window').down('map').locationRecord;
        if (layer && layer.selectedFeatures[0] && newLocation) {
            var feature = layer.getFeatureById(layer.selectedFeatures[0].id);
            feature.move(new OpenLayers.LonLat(nValue, feature.geometry.y));
            layer.refresh();
        }
    }
});
