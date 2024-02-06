/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * This is a controller for an Ortszuordnung Form
 */
Ext.define('Lada.controller.form.Ortszuordnung', {
    extend: 'Lada.controller.form.BaseFormController',
    alias: 'controller.ortszuordnungform',

    /**
     * Initialize the Controller with 4 listeners
     */
    init: function() {
        this.control({
            'ortszuordnungform button[action=save]': {
                click: this.save
            },
            'ortszuordnungform button[action=revert]': {
                click: this.revert
            },
            'ortszuordnungform button[action=showort]': {
                click: this.showort
            },
            'ortszuordnungform': {
                validitychange: this.setButtonsDisabled,
                dirtychange: this.setButtonsDisabled
            }
        });
    },

    /**
      * Save the content of the form.
      */
    save: function(button) {
        var formPanel = button.up('ortszuordnungform');
        var record = formPanel.getForm().getRecord();
        record.set(formPanel.getForm().getFieldValues(true));
        if (record.phantom) {
            record.set('id', null);
        }
        record.save({
            scope: this,
            success: function(newRecord) {
                formPanel.setRecord(newRecord);
                formPanel.setMessages(
                    newRecord.get('errors'),
                    newRecord.get('warnings'),
                    newRecord.get('notifications'));
                formPanel.up('window').parentWindow.initData();

                //try to refresh the Grid of the Probe
                if (
                    formPanel.up('window').parentWindow.down(
                        'ortszuordnunggrid') &&
                        formPanel.up('window').parentWindow.down(
                            'ortszuordnunggrid').store &&
                        formPanel.up('window').parentWindow.xtype
                            === 'probenedit'
                ) {
                    formPanel.up('window').parentWindow
                        .down('ortszuordnunggrid').store.reload();
                }
            },
            failure: this.handleSaveFailure
        });
    },

    /**
     * reverts the form to the currently saved state
     */
    revert: function(button) {
        var form = button.up('form');
        form.reset();

        var currentOrt = form.getRecord().get('siteId');
        var osg = button.up('window').down('ortstammdatengrid');
        var selmod = osg.getView().getSelectionModel();
        if (!currentOrt) {
            selmod.deselectAll();
        } else {
            var record = osg.store.getById(currentOrt);
            if (!record) {
                Lada.model.Site.load(currentOrt, {
                    success: function(rec) {
                        form.setFirstOrt(rec);
                    }
                });
            } else {
                form.setFirstOrt(record);
                selmod.select(record);
            }
            var map = button.up('window').down('map');
            if (map.previousOrtLayer) {
                var prevOrt = map.previousOrtLayer.getSource().getFeatures()[0];
                if (prevOrt) {
                    var geom = prevOrt.getGeometry();
                    map.map.getView().setCenter([geom.getCoordinates()[0],
                        geom.getCoordinates()[1]]);
                    map.map.getView().setZoom(12);
                }
            }
        }
    },

    /**
      * Enables or disables buttons in the toolbar of the form.
      */
    setButtonsDisabled: function(form) {
        var enableForm = !form.getRecord().get('readonly') && form.isDirty();
        form.owner.down('button[action=save]').setDisabled(
            !enableForm || !form.isValid());
        form.owner.down('button[action=revert]').setDisabled(!enableForm);

        form.owner.down('button[action=showort]').setDisabled(
            !form.getValues().siteId);
    },

    /**
     * Opens the orte form with the currently set Ort
     */
    showort: function(button) {
        var win = button.up('ortszuordnungwindow');
        var currentOrt = win.down('ortszuordnungform').currentOrt;
        if (currentOrt) {
            Ext.create('Lada.view.window.Ort', {
                record: currentOrt,
                parentWindow: win
            }).show();
        }
    }
});
