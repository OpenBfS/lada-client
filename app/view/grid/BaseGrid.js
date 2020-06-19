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
Ext.define('Lada.view.grid.BaseGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'basegrid',

    /**
     * @protected
     * A component serving as mask for this component.
     */
    reloadMask: null,

    /**
     * Adds a handler to the given store to show an error mask if the store failed to load.
     * @param {Ext.data.Store} store Store to add the handler to
     */
    addLoadingFailureHandler: function(store) {
        var me = this;
        store.on('load', function(loadedStore, records, success, operation) {
            if (!success) {
                me.loadingFailed(loadedStore, operation);
            }
        });
    },

    /**
     * Create a modal window used as a mask for this component.
     * The window contains an error message and a button to reload the grid.
     */
    createReloadMask: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var mask = Ext.create('Ext.window.Window', {
            renderTo: this.getId(),
            resizable: false,
            border: 0,
            header: false,
            frame: false,
            style: 'padding: 0; border-width: 2px; border-radius: 0px;',
            layout: 'hbox',
            items: [{
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
                }, {
                    xtype: 'button',
                    text: i18n.getMsg('reload'),
                    icon: 'resources/img/view-refresh.png',
                    padding: 3,
                    handler: function() {
                        me.reload();
                    }
                }]
            }]
        });
        return mask;
    },

    /**
     * Reload the grid.
     * Extending classes must implement this.
     */
    reload: function() {
        Ext.raise('Reload function not implemented!');
    },

    /**
     * Mask this component using the reload mask
     */
    showReloadMask: function() {
        if (!this.reloadMask) {
            this.reloadMask = this.createReloadMask();
        }
        if (this.reloadMask.isHidden()) {
            this.mask();
            this.reloadMask.show();
        }
    },

    /**
     * Unmask this component
     */
    hideReloadMask: function() {
        this.unmask();
        if (this.reloadMask && this.reloadMask.isVisible()) {
            this.reloadMask.hide();
        }
    },

    /**
     * @protected
     * Handle a failed store loading operation.
     * Shows the reload mask
     * @param {Ext.data.store} store The store that failed loading
     * @param {Ext.data.operation.operation} operation The operation that failed
     */
    loadingFailed: function(store, operation) {
        this.showReloadMask();
    }
});
