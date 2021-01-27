
/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window extending the TrackedWindow providing common functions for windows
 * showing records.
 *
 * If this window is initialized without content, a placeholder panel is
 * created to show a
 * loading spinner until the ui is initialized.
 *
 * ## Loading failure handling
 * This class provides a loadRecord function which can be used to load a record
 * and showing a reload mask in
 * case the loading process fails.
 */
Ext.define('Lada.view.window.RecordWindow', {
    extend: 'Lada.view.window.TrackedWindow',

    /**
     * Model class to use, e.g. Lada.model.Probe
     */
    modelClass: null,

    /**
     * Function to call after the record has been loaded.
     */
    loadCallback: null,

    /**
     * Scope to use in the loading process
     */
    loadScope: null,

    /**
     * @protected
     * A component serving as mask for this component.
     */
    reloadMask: null,

    /**
     * @protected
     * Component used as a placeholder if window is initialized emtpy
     */
    placeholder: null,


    /**
     * @private
     * Record used in this window and is currently loaded.
     * Note: The model data may not be initialized, use the record property to
     * access model data
     */
    loadingModel: null,

    initComponent: function() {
        if (!this.modelClass) {
            Ext.raise('modelClass is undefined');
        }

        if (!this.items || this.items.length === 0) {
            this.placeholder = Ext.create({
                xtype: 'panel',
                layout: 'fit',
                name: 'placeholder',
                height: '100%',
                width: '100%',
                minHeight: 200,
                minWidth: 300
            });
            //Create a placeholder panel to show a loading mask until data is
            //loaded
            this.items = [this.placeholder];
        }
        this.callParent(arguments);
    },

    /**
     * Create a modal window used as a mask for this component.
     * The window contains an error message and a button to reload the grid.
     */
    createReloadMask: function() {
        this.reloadMask = Ext.create('Lada.view.window.ReloadMask', {
            renderTo: this.placeholder && this.placeholder.isVisible() ?
                this.placeholder.getId() :
                this.getId(),
            reloadButtonHandler: this.reloadRecord,
            reloadButtonHandlerScope: this
        });
        return this.reloadMask;
    },

    /**
     * Load record using the given id.
     * If the loading fails the component will show a reload mask, else
     * the given callback function is called.
     * The callback will not be called if the window was already closed by the
     * user as this can break other windows.
     * @param {Number} id Record id to load
     * @param {Object} scope Scope to use in the callback
     * @param {Object} callback Function to call after loading finished
     */
    loadRecord: function(id, scope, callback) {
        var me = this;
        if (this.placeholder) {
            this.placeholder.setLoading(true);
        }
        this.loadCallback = callback;
        this.loadScope = scope;
        this.recordId = id;
        this.loadingModel = this.modelClass.load(id, {
            scope: scope? scope: this,
            callback: function(record, operation, success) {
                //Check if window is still visible
                if (!me.isVisible()) {
                    return false;
                }
                if (!success) {
                    me.showReloadMask();
                } else {
                    me.hideReloadMask();
                }
                if (me.loadCallback) {
                    me.loadCallback(record, operation, success);
                }
            }
        });
    },

    /**
     * Reload the record using the last settings
     */
    reloadRecord: function() {
        this.hideReloadMask();
        this.loadRecord(this.recordId, this.loadScope, this.loadCallback);
    },

    /**
     * Mask this component using the reload mask
     */
    showReloadMask: function() {
        if (!this.reloadMask) {
            this.reloadMask = this.createReloadMask();
        }
        if (this.reloadMask.isHidden()) {
            if (this.placeholder) {
                this.placeholder.mask();
            } else {
                this.mask();
            }
            this.reloadMask.show();
        }
    },

    /**
     * Unmask this component
     */
    hideReloadMask: function() {
        if (
            this.isVisible() &&
            this.reloadMask &&
            this.reloadMask.isVisible()
        ) {
            this.unmask();
            this.reloadMask.hide();
        }
    },

    removeAll: function() {
        //If placeholder panel is still in place: try to remove it
        if (this.placeholder) {
            this.hideReloadMask();
            try {
                this.remove(this.placeholder);
            } catch (e) {
                Ext.log({
                    msg: 'Can not remove placeholder panel: ' + e,
                    level: 'warn'});
            }
            this.placeholder = null;
        }
        return this.callParent(arguments);
    },

    /**
     * If a request is still pending, abort and close this window
     */
    close: function() {
        //If still loading, close mask
        if (this.reloadMask) {
            this.reloadMask.destroy();
        }
        this.callParent(arguments);
        if (this.loadingModel) {
            this.loadingModel.abort();
        }
    }
});
