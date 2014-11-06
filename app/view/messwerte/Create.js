/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Window to create and edit a Messwert
 */
Ext.define('Lada.view.messwerte.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.messwertecreate',

    title: 'Maske für Messwerte',
    autoShow: true,
    autoScroll: true,
    modal: true,

    initComponent: function() {
        var form = Ext.create('Lada.view.messwerte.CreateForm',
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
