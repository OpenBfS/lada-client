/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window for new Ort, wraps around a {@link Lada.view.form.Ortsertellung}
 */
Ext.define('Lada.view.window.Ortserstellung', {
    extend: 'Ext.window.Window',
    alias: 'window.ortserstellung',
    requires: [
        'Lada.model.Ort',
        'Lada.view.form.Ortserstellung'
    ],

    minWidth: 350,

    margin: 5,

    border: 0,

    bodyStyle: {background: '#fff'},

    layout: 'fit',

    title: 'Neuen Messpunkt anlegen',

    /**
     * The record for the new Ort. Should be a {@link Lada.model.Ort}
     */
    record: null,

    parentWindow: null,

    initComponent: function() {
        var me = this;
        if (this.record === null) {
            this.record = Ext.create('Lada.model.Ort');
        }
        this.items = [
            Ext.create('Lada.view.form.Ortserstellung', {
                record: me.record,
                listeners: {
                    destroy: {fn: function() {me.close();}}
                }
            })
        ];
        this.callParent(arguments);
    }
});