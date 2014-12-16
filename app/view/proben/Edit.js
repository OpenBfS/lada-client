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
    alias: 'widget.probenedit',

    requires: [
        'Lada.view.proben.EditForm'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: true,
    autoScroll: true,
    layout: 'fit',

    initComponent: function() {
        var probe = Ext.StoreManager.get('ProbenList').getById(this.modelId);
        this.title = '§3-Probe ' + probe.get('probeIdAlt');
        this.buttons = [{
            text: 'Schließen',
            scope: this,
            handler: this.close
        }];
        this.width = 700;
        this.height = Ext.getBody().getViewSize().height - 30;
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "modelId" param to load the correct item.

        var form = Ext.create('Lada.view.proben.EditForm',
            this.initialConfig);
        this.items = [{
            border: 0,
            autoScroll: true,
            items: [form]
        }];
        this.callParent(arguments);
    }
});
