/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/*
 * Window to create and edit a Ort
 */
Ext.define('Lada.view.orte.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.ortecreate',

    title: 'Maske für Orte',
    autoShow: true,
    autoScroll: true,
    modal: true,

    requires: [
        'Lada.view.orte.CreateForm'
    ],
    initComponent: function() {
        this.buttons = [
            {
                text: 'Speichern',
                scope: form,
                action: 'save'
            },
            {
                text: 'Abbrechen',
                scope: this,
                handler: this.close
            }
        ];
        var form = Ext.create('Lada.view.orte.CreateForm', this.initialConfig);
        this.items = [form];
        this.callParent();
    }
});
