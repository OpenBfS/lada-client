/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Window to create and edit a Status
 */
Ext.define('Lada.view.status.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.statuscreate',

    requires: [
        'Lada.view.status.CreateForm'
    ],

    title: 'Maske für den Messstatus',
    autoShow: true,
    autoScroll: true,
    modal: true,

    initComponent: function() {
        var form = Ext.create('Lada.view.status.CreateForm',
            this.initialConfig);
        this.buttons = [{
            text: 'Speichern',
            scope: form,
            action: 'save'
        }, {
            text: 'Abbrechen',
            scope: this,
            handler: this.close
        }];
        this.items = [form];
        this.callParent(arguments);
    }
});
