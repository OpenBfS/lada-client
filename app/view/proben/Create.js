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

    title: 'Maske für §3-Proben',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    autoShow: true,
    autoScroll: true,
    modal: true,
    initComponent: function() {
        this.buttons = [
            {
                text: 'Speichern',
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
        var form = Ext.create('Lada.view.proben.CreateForm');
        this.items = [form];
        this.callParent();
    }
});
