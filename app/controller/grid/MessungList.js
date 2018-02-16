/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for the MessungList result grid.
 */
Ext.define('Lada.controller.grid.MessungList', {
    extend: 'Ext.app.Controller',
    requires: [
        'Lada.view.window.SetStatus',
        'Lada.view.window.ProbeEdit'
    ],

    /**
     * Initialize the Controller with listeners
     */
    init: function() {
        this.control({
            'messunglistgrid': {
                itemdblclick: this.editItem
            },
            'messunglistgrid toolbar button[action=setstatus]': {
                click: this.setStatus
            }
        });
        this.callParent(arguments);
    },

    /**
     * Sets the Status on Bulk
     **/
    setStatus: function(button) {
        //disable Button and setLoading...

        var grid = button.up('grid');
        var selection = grid.getView().getSelectionModel().getSelection();
        var i18n = Lada.getApplication().bundle;

        var win = Ext.create('Lada.view.window.SetStatus', {
            title: i18n.getMsg('statusSetzen.win.title'),
            grid: grid,
            modal: true,
            selection: selection
        });

        win.show();

    },


    /**
     * This function is called after a Row in the
     * {@link Lada.view.grid.ProbeList}
     * was double-clicked.
     * The function opens a {@link Lada.view.window.ProbeEdit}
     * or a {@link Lada.view.window.Messprogramm}.
     * To determine which window has to be opened, the function
     * analyse the records modelname.
     */
    editItem: function(grid, record) {
        var probeRecord = Ext.create('Lada.model.ProbeList');
        probeRecord.setId(record.get('probeId'));
        probeRecord.set('owner', record.get('owner'));
        probeRecord.set('readonly', record.get('readonly'));

        var probeWin = Ext.create('Lada.view.window.ProbeEdit', {
            record: probeRecord,
            style: 'z-index: -1;' //Fixes an Issue where windows could not be created in IE8
        });

        probeWin.setPosition(30);
        probeWin.show();
        probeWin.initData();

        Ext.ClassManager.get('Lada.model.Probe').load(record.get('probeId'), {
            failure: function(record, action) {
                me.setLoading(false);
                // TODO
                console.log('An unhandled Failure occured. See following Response and Record');
                console.log(action);
                console.log(record);
            },
            success: function(precord, response) {
                var messungWin = Ext.create('Lada.view.window.MessungEdit', {
                    parentWindow: probeWin,
                    probe: precord,
                    record: record,
                    grid: grid
                });
                messungWin.show();
                messungWin.setPosition(window.innerWidth - 30 - messungWin.width);
                messungWin.initData();
            }
        });
    },

    /**
     * Enables/Disables a set of buttons
     **/
    buttonToggle: function(enabled, grid) {
        if (!enabled) {
            grid.down('button[action=setstatus]').disable();
        } else {
            // TODO: enable button only on messungen with owner == true and
            // readonly == false
            grid.down('button[action=setstatus]').enable();
        }
    }
});
