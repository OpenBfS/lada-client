/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a grid of Pkommentare
 */
Ext.define('Lada.controller.grid.PKommentar', {
    extend: 'Lada.controller.grid.Kommentar',
    alias: 'controller.pkommentargrid',

    /**
     * Initialize the Controller with
     * 3 Listeners
     */
    init: function() {
        this.control({
            'pkommentargrid': {
                edit: this.gridSave,
                canceledit: this.cancelEdit
            },
            'pkommentargrid button[action=add]': {
                click: this.add
            },
            'pkommentargrid button[action=delete]': {
                click: this.remove
            }
        });
    },

    /**
     * This function adds a new row to add a PKommentar
     */
    add: function(button) {
        var record = Ext.create('Lada.model.CommSample', {
            sampleId: button.up('pkommentargrid').getParentRecordId()
        });
        record.data.date = Lada.util.Date.formatTimestamp(new Date(),
            'd.m.Y H:i', true);
        button.up('pkommentargrid').store.insert(0, record);
        button.up('pkommentargrid').rowEditing.startEdit(0, 1);
    }
});
