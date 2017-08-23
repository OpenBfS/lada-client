/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window for new Ort, wraps around a {@link Lada.view.form.Ort}
 */
Ext.define('Lada.view.window.Ort', {
    extend: 'Ext.window.Window',
    alias: 'window.ort',
    requires: [
        'Lada.model.Ort',
        'Lada.view.form.Ort'
    ],

    minWidth: 350,

    margin: 10,

    shadow: false,

    border: 0,

    bodyStyle: {background: '#fff'},

    layout: 'fit',

    title: null,

    /**
     * The record for the new Ort. Should be a {@link Lada.model.Ort}
     */
    record: null,

    parentWindow: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        if (this.record === null) {
            this.record = Ext.create('Lada.model.Ort');
        }
        this.title = this.record.phantom? i18n.getMsg('orte.new'): i18n.getMsg('orte.edit');
        this.items = [
            Ext.create('Lada.view.form.Ort', {
                record: me.record,
                listeners: {
                    destroy: {fn: function() {me.close();}}
                }
            })
        ];
        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }];
        this.callParent(arguments);
    }
});
