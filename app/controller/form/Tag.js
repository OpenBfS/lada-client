/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
* This is a controller for Tag management, create and edit form
*/
Ext.define('Lada.controller.form.Tag', {
    extend: 'Lada.controller.form.BaseFormController',
    alias: 'controller.tagform',

    init: function() {
        this.control({
            'tagform button[action=save]': {
                click: this.saveTag
            },
            'tagform button[action=delete]': {
                click: this.deleteTag
            },
            'tagform': {
                validitychange: this.checkTagCommitEnabled,
                dirtychange: this.checkTagCommitEnabled
            },
            'tagform tagtyp combobox': {
                change: this.checkTagCommitEnabled
            },
            'tagform messstelle combobox': {
                change: this.checkTagCommitEnabled
            },
            'tagform netzbetreiber combobox': {
                change: this.checkTagCommitEnabled
            }
        });
    },

    saveTag: function(button) {
        var win = button.up('tagmanagementwindow');
        var form = win.down('tagform');
        form.updateRecord();
        var record = win.down('tagform').getRecord();
        // Disabled fields are not handled by updateRecord():
        var type = form.down('tagtyp').getValue();
        switch (type) {
            case 'mst':
                record.set('networkId', null);
                break;
            case 'netz':
                record.set('measFacilId', null);
                break;
            case 'global':
                record.set('networkId', null);
                record.set('measFacilId', null);
        }
        record.save({
            scope: this,
            success: function(rec) {
                this.reloadParentGrid();
                Ext.getStore('tags').add(rec);
                win.close();
            },
            failure: this.handleSaveFailure
        });
    },

    deleteTag: function(button) {
        var win = button.up('tagmanagementwindow');
        var me = this;
        win.down('tagform').getForm().getRecord().erase({
            success: function(rec) {
                me.reloadParentGrid();
                Ext.getStore('tags').remove(rec);
                win.close();
            },
            failure: this.handleServiceFailure
        });
    },

    reloadParentGrid: function() {
        var parentGrid = Ext.ComponentQuery.query('dynamicgrid');
        if (parentGrid.length === 1
            && parentGrid[0].rowtarget.dataType === 'tagId'
        ) {
            parentGrid[0].reload();
        }
    },

    /**
     * Enable/disable save button in TagManagement window.
     */
    checkTagCommitEnabled: function(callingEl) {
        var form;
        if (callingEl.up) { //called by a field in the form
            form = callingEl.up('tagform');
        } else { //called by the form
            form = callingEl.owner;
        }
        form.down('button[action=save]')
            .setDisabled(
                !form.isDirty()
                    || !form.isValid()
                    || form.getRecord().get('readonly')
                    || ((form.getForm().getFieldValues().typId === 'mst') &&
                        (form.getForm().getFieldValues().mstId === null))
                    || ((form.getForm().getFieldValues().typId === 'netz') &&
                        (form.getForm().getFieldValues().netzbetreiberId === null))
            );
    },

    handleTagType: function() {
        const form = this.getView();
        var type = form.down('tagtyp').getValue();
        var networkWidget = form.down('netzbetreiber');
        var measFacilWidget = form.down('messstelle');
        var valUntilField = form.down('datetimefield[name=valUntil]');
        switch (type) {
            case 'mst':
                networkWidget.disable().hide();
                measFacilWidget.enable().show();
                valUntilField.show();
                break;
            case 'netz':
                measFacilWidget.disable().hide();
                networkWidget.enable().show();
            case 'global':
                valUntilField.hide().setValue(null);
                break;
        }
    }
});
