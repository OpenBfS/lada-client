/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Grid base class providing common functions for the Lada grids.
 *
 * ## Loading
 * Grids extending this class can use the addLoadingFailureHandler function to add a handler to
 * store that shows an error mask if the store failed to load. This mask contains a button to call
 * the reload function that must be implemented by extending classes.
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
