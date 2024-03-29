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
        var record = win.down('tagform').getForm().getRecord();
        record.set(win.down('tagform').getForm().getFieldValues());
        var me = this;
        record.save({
            scope: this,
            success: function(rec) {
                me.reloadParentGrid();
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
    }
});
