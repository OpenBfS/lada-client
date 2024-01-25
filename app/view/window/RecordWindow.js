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

        /**
         * If form is dirty, show confirmation dialogue that allows the
         * user to save changes.
         * It's up to the handler of saving to actually close the
         * window if saving is requested. Therefore, the property
         * 'closeRequested' is set to true.
         */
        this.onBefore('beforeclose', function() {
            var form = this.down('form');
            if (form && !form.getRecord().get('readonly') && form.isDirty()) {
                var i18n = Lada.getApplication().bundle;
                var me = this;
                Ext.Msg.show({
                    title: i18n.getMsg('form.saveonclosetitle'),
                    message: i18n.getMsg('form.saveonclosequestion'),
                    modal: true,
                    buttons: Ext.Msg.YESNOCANCEL,
                    fn: function(btn) {
                        switch (btn) {
                            case 'no':
                                // Continue closing the window
                                me.doClose();
                                break;
                            case 'yes':
                                // Leave closing up to the save-handler
                                me.closeRequested = true;
                                me.down('form').down('button[action=save]')
                                    .click();
                            default:
                                // Cancel
                        }
                    }
                });
                // Intercept closing the window
                return false;
            }
            // Just process closing the window without interception
            return true;
        });

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
            scope: scope ? scope : this,
            callback: function(record, operation, success) {
                //Check if window is still visible
                if (!me.isVisible()) {
                    return false;
                }
                me.setLoading(false);
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
     * Reload the window.
     */
    reloadWindow: function() {
        this.setLoading(true);
        if (this.down('form').isDirty()) {
            var i18n = Lada.getApplication().bundle;
            Ext.MessageBox.alert(
                i18n.getMsg('reloadRecord', i18n.getMsg(this.recordType)),
                i18n.getMsg('confirmation.discardchanges'),
                this.reloadRecord());
        } else {
            this.reloadRecord();
        }
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
     * If a request is still pending, abort and close this window.
     */
    doClose: function() {
        if (this.childWindows) {
            for (var key in this.childWindows) {
                if (this.childWindows[key] && this.childWindows[key].close) {
                    this.childWindows[key].close();
                }
            }
        }
        //If still loading, close mask
        if (this.reloadMask) {
            this.reloadMask.destroy();
        }
        this.callParent(arguments);
        if (this.loadingModel) {
            this.loadingModel.abort();
        }
    },

    addChild: function(childItem) {
        if (!this.childWindows) {
            this.childWindows = [];
        }
        var trailIdx = this.childWindows.findIndex(function(t) {
            return t === childItem;
        });
        if (trailIdx < -1) {
            this.childWindows.splice(trailIdx, 1);
        }
        this.childWindows.push(childItem);
    },

    /**
     * Clear validation messages of child components.
     *
     * Note that this function only clears messages of components extending:
     * - Lada.view.form.LadaForm
     * - Lada.view.widget.base.FieldSet
     */
    clearMessages: function() {
        var fsets = this.query('fset');
        var forms = this.query('ladaform');
        var components = fsets.concat(forms);
        components.forEach((comp => comp.clearMessages()));
    },

    /**
     * Set validation messages for this window.
     *
     * Messages will be passed down to the forms and fieldsets.
     * @param {*} errors Errors
     * @param {*} warnings Warnings
     * @param {*} notifications Notifications
     */
    setMessages: function(errors, warnings, notifications) {
        var i18n = Lada.getApplication().bundle;
        var forms = this.query('ladaform');
        forms.forEach(
            (form) => form.setMessages(errors, warnings, notifications));

        var fieldsets = this.query('fset');
        var fieldsetMap = {};
        fieldsets.forEach((fset) => {
            if (fset.name) {
                fieldsetMap[fset.name] = {
                    fieldset: fset,
                    errors: '',
                    warnings: '',
                    notifications: ''
                };
            }
        });
        var getMessages = function(key, map) {
            var result = '';
            map[key].forEach(validationMessage =>
                result +=
                    i18n.getMsg(key) + ': '
                    + i18n.getMsg(validationMessage.toString())
                    + '\n');
            return result;
        };
        const allMessages = {
            errors: errors,
            warnings: warnings,
            notifications: notifications
        };
        //Parse message map by categories
        for (const [category, messages] of Object.entries(allMessages)) {
            //Get messages by fieldset
            for (var field in messages) {
                if (fieldsetMap[field]) {
                    fieldsetMap[field][category]
                        += getMessages(field, messages);
                }
            }
        }
        //Set messages in components
        for (var fieldsetName in fieldsetMap) {
            var fieldset = fieldsetMap[fieldsetName];
            var component = this.down('fset[name=' + fieldsetName + ']');
            var hasWarnings = fieldset.warnings !== '';
            var hasErrors = fieldset.errors !== '';
            var hasNotifications = fieldset.notifications !== '';
            component.showWarningOrError(
                hasWarnings,
                hasWarnings ? fieldset.warnings : null,
                hasErrors,
                hasErrors ? fieldset.errors : null,
                hasNotifications,
                hasNotifications ? fieldset.notifications : null
            );
        }
    }
});
