/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/*
 * Window to create a Messung
 */
Ext.define('Lada.view.messungen.Create', {
    extend: 'Ext.window.Window',
    alias: 'widget.messungencreate',

    title: 'Maske für Messungen',
    //width: Ext.getBody().getViewSize().width - 30,
    //height: Ext.getBody().getViewSize().height - 30,
    autoShow: true,
    autoScroll: true,
    modal: true,

    requires: [
        'Lada.view.messungen.CreateForm'
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
        var form = Ext.create('Lada.view.messungen.CreateForm', this.initialConfig);
        this.items = [form];
        this.callParent();
    }
});
