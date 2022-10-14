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
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'tagmanagementwindow button[action=save]': {
                click: this.saveTag
            },
            'tagmanagementwindow button[action=delete]': {
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
            success: function(rec) {
                me.reloadParentGrid();
                Ext.getStore('tags').add(rec);
                win.close();
            },
            failure: this.handleTagFailure
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
            failure: this.handleTagFailure
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
     * Failure callback for Model's save() and erase().
     */
    handleTagFailure: function(record, operation) {
        var i18n = Lada.getApplication().bundle;
        var err = operation.getError();
        var msg = i18n.getMsg('err.msg.generic.body');
        if (err) {
            if (err instanceof String) {
                msg = err;
            } else {
                msg = err.response.responseText;
                if (!msg && err.response.timedout) {
                    msg = i18n.getMsg('err.msg.timeout');
                }
            }
        } else {
            msg = i18n.getMsg(
                Ext.decode(operation.getResponse().responseText).message);
        }
        Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'), msg);
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
        form.up('tagmanagementwindow').down('button[action=save]')
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
