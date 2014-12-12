/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Window to create a Probe
 */
Ext.define('Lada.view.proben.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.probencreate',

    requires: [
        'Lada.view.proben.CreateForm'
    ],

    title: 'Maske für §3-Proben',
    autoShow: true,
    autoScroll: true,
    modal: true,
    layout: 'fit',

    initComponent: function() {
        this.buttons = [{
            text: 'Speichern',
            action: 'save'
        }, {
            text: 'Abbrechen',
            scope: this,
            handler: this.close
        }];
        this.width = 700;
        var form = Ext.create('Lada.view.proben.CreateForm');
        this.items = [{
            border: 0,
            autoScroll: true,
            items: [form]
        }];
        this.callParent(arguments);
    }
});
