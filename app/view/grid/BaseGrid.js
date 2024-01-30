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
 * Grids extending this class can use the addLoadingFailureHandler function
 * to add a handler to a store that shows an error mask if the store failed to
 * load. This mask contains a button to call
 * the reload function that must be implemented by extending classes.
 * In case the grid store is already created during the grids initComponent,
 * the loading failure handler is added automatically.
 */
Ext.define('Lada.view.grid.BaseGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.basegrid',
    requires: [
        'Lada.view.window.ReloadMask'
    ],

    /**
     * @protected
     * A component serving as mask for this component.
     */
    reloadMask: null,

    /**
     * Init component
     */
    initComponent: function() {
        //Check if component is used in a window
        var parentWin = this.up('window');
        if (parentWin) {
            //If used in a window destroy mask component before parent window
            // is closed
            //This should prevent errors in the framework during the windows
            // closing process
            var me = this;
            parentWin.onBefore('close', function() {
                if (me.reloadMask && me.reloadMask.rendered) {
                    me.reloadMask.hide();
                    me.reloadMask.destroy();
                }
            });
        }
        this.callParent(arguments);
        if (this.store) {
            this.addLoadingFailureHandler(this.store);
        }
    },

    getParentRecordId: function() {
        var record = this.up('window').down('form').getRecord();
        return record ? record.get('id') : null;
    },

    /**
     * Adds a handler to the given store to show an error mask if the store
     * failed to load.
     * The handle will exit if this component is no longer visible.
     * @param {Ext.data.Store} store Store to add the handler to
     */
    addLoadingFailureHandler: function(store) {
        var me = this;
        store.on('load', function(loadedStore, records, success, operation) {
            if (!me.isVisible()) {
                return false;
            }
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
        var me = this;
        var mask = Ext.create('Lada.view.window.ReloadMask', {
            renderTo: this.getId(),
            reloadButtonHandler: me.reload,
            reloadButtonHandlerScope: me
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
        var response = operation.getResponse();
        var json = response ? JSON.parse(response.responseText) : null;
        if (json && json.message && json.message === '699') {
            // Don't show an error: store loaded correctly, but user has no
            // permission to see any data
            // TODO some message ?
            return;
        } else {
            this.showReloadMask();
        }
    },

    /**
     * Renderer which sets the validation results
     * in the metadata of a grid column.
     *
     * Note: The value is returned unaltered
     * @param value Column value
     * @param metaData Rendering metaData
     * @param record Record
     */
    validationResultRenderer: function(value, metaData, record) {
        if (!metaData.column) {
            return value;
        }
        var dataIndex = metaData.column.dataIndex;
        var validationResult = [];
        var validationResultCls = null;
        ['notification', 'warning', 'error'].forEach(function(msgCat) {
            var messages = record.get(msgCat + 's');
            if (!messages) {
                return;
            }
            Object.keys(messages)
                .filter(
                    key => key === dataIndex)
                .forEach(key => {
                    // If key not found, assume message translated by server
                    validationResult.push(
                        Lada.util.I18n.getMsgIfDefined(messages[key])
                    );
                    validationResultCls =
                        'x-lada-' + msgCat + '-grid-field';
                });
        });
        if (validationResultCls) {
            metaData.tdCls = validationResultCls;
            metaData.tdAttr =
                'data-qtip="' + validationResult.join('<br>') + '"';
        }
        return value;
    }
});
