/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/*
 * Window to edit a Messung
 */
Ext.define('Lada.view.messungen.Edit', {
    extend: 'Ext.window.Window',
    alias: 'widget.messungenedit',

    title: 'Maske für Messungen',
    autoShow: true,
    autoScroll: true,
    modal: true,

    requires: [
        'Lada.view.messungen.EditForm'
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
        this.width = Ext.getBody().getViewSize().width - 30;
        this.height = Ext.getBody().getViewSize().height - 30;
        var form = Ext.create('Lada.view.messungen.EditForm', this.initialConfig);
        this.items = [form];
        this.callParent();
    }
});
