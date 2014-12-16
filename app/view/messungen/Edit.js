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
    requires: [
        'Lada.view.messungen.EditForm'
    ],

    collapsible: true,
    maximizable: true,
    title: 'Messung',
    autoShow: true,
    layout: 'fit',

    initComponent: function() {
        var form = Ext.create('Lada.view.messungen.EditForm',
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
        this.width = 700;
        this.maxHeight = Ext.getBody().getViewSize().height - 57;
        this.items = [{
            border: 0,
            autoScroll: true,
            items: [form]
        }];
        this.callParent();
    }
});
