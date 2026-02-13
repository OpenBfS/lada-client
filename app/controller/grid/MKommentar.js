/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a grid of MKommentar
 * MKommentar are comments which are associated to a
 * Measurement
 */
Ext.define('Lada.controller.grid.MKommentar', {
    extend: 'Lada.controller.grid.Kommentar',
    alias: 'controller.mkommentargrid',

    /**
     * Inhitialize the controller
     * It has 3 listeners
     */
    init: function() {
        this.control({
            'mkommentargrid': {
                edit: this.gridSave,
                canceledit: this.cancelEdit
            },
            'mkommentargrid button[action=add]': {
                click: this.add
            },
            'mkommentargrid button[action=delete]': {
                click: this.remove
            }
        });
    },

    /**
     * This function adds a new row to add a MKommentar
     */
    add: function(button) {
        var record = Ext.create('Lada.model.CommMeasm', {
            measmId: button.up('mkommentargrid').getParentRecordId()
        });
        record.data.date = Lada.util.Date.formatTimestamp(new Date(),
            'd.m.Y H:i', true);
        button.up('mkommentargrid').store.insert(0, record);
        button.up('mkommentargrid').rowEditing.startEdit(0, 1);
    }
});
