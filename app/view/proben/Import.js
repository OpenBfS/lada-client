/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Window to import a Probe
 */
Ext.define('Lada.view.proben.Import', {
    extend: 'Ext.window.Window',
    alias: 'widget.probenimport',

    requires: [
        'Lada.view.proben.ImportForm'
    ],

    title: 'Maske für §3-Proben Import',
    autoShow: true,
    autoScroll: true,
    modal: true,
    initComponent: function() {
        this.buttons = [{
            text: 'Speichern',
            action: 'save'
        }, {
            text: 'Abbrechen',
            scope: this,
            handler: this.close
        }];
        var form = Ext.create('Lada.view.proben.ImportForm');
        this.items = [form];
        this.callParent(arguments);
    }
});
