/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Borderless window serving as a mask for components that failed to load.
 * The window provides a reload button that can call the function defined in
 * reloadButtonHandler and will be rendered to the component set in the
 * renderTo attribute.
 */
Ext.define('Lada.view.window.ReloadMask', {
    extend: 'Ext.window.Window',

    resizable: false,
    border: 0,
    header: false,
    frame: false,
    style: 'padding: 0; border-width: 2px; border-radius: 0px;',
    layout: 'hbox',

    /**
     * Function to handle a reload button click
     */
    reloadButtonHandler: null,

    /**
     * Scope to use as this in the reload button handler
     */
    reloadButtonHandlerScope: null,

    /**
     * Render target id.
     */
    renderTo: null,

    shadow: false,


    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var button = Ext.create({
            xtype: 'button',
            text: i18n.getMsg('reload'),
            icon: 'resources/img/view-refresh.png',
            padding: 3
        });
        button.setHandler(me.reloadButtonHandler, me.reloadButtonHandlerScope);
        this.items = [{
            xtype: 'panel',
            height: '100%',
            width: 30,
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'center'
            },
            items: [{
                xtype: 'image',
                src: 'resources/img/dialog-warning.png',
                width: 20,
                height: 20
            }]
        }, {
            layout: 'vbox',
            padding: 5,
            items: [{
                xtype: 'panel',
                html: i18n.getMsg('err.msg.grid.loadingfailed'),
                padding: 3
            },
            button]
        }];
        this.callParent(arguments);
    }
});
