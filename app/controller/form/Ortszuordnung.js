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
    selectedSite: {},
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
        var form = formPanel.getForm();
        var record = form.getRecord();
        var values = form.getFieldValues(true);
        values = Object.keys(values).reduce(function(o, n) {
            if (n !== 'siteId') {
                o[n] = values[n];
            }
            return o;
        }, {});
        record.set(values);
        if (record.phantom) {
            record.set('id', null);
        }
        record.setSite(this.selectedSite);
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
                this.revert(button);
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
        var currentOrt = form.getRecord().getSite();
        this.setSelectedSite(currentOrt);
        var osg = button.up('window').down('ortstammdatengrid');
        var selmod = osg.getView().getSelectionModel();
        if (!currentOrt) {
            selmod.deselectAll();
        } else {
            form.setFirstOrt(currentOrt);
            selmod.select(currentOrt);
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
    },

    /**
     * Keeps track of the current selected site in the form
     */
    setSelectedSite: function(site) {
        this.selectedSite = site;
    }
});
