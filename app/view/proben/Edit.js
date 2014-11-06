/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Window to edit a Probe
 */
Ext.define('Lada.view.proben.Edit', {
    extend: 'Ext.window.Window',
    require: ['Lada.view.proben.EditForm'],
    alias: 'widget.probenedit',

    title: 'Maske für §3-Proben',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    autoShow: true,
    autoScroll: true,
    modal: true,

    initComponent: function() {
        console.log('open edit...');
        this.buttons = [{
            text: 'Speichern',
            action: 'save'
        }, {
            text: 'Abbrechen',
            scope: this,
            handler: this.close
        }];
        this.width = Ext.getBody().getViewSize().width - 30;
        this.height = Ext.getBody().getViewSize().height - 30;
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "modelId" param to load the correct item.
        var form = Ext.create('Lada.view.proben.EditForm',
            this.initialConfig);
        this.items = [form];
        this.callParent();
    }
});
