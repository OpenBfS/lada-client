/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Tagfield for tags
 */
Ext.define('Lada.view.widget.Tag', {
    extend: 'Ext.form.field.Tag',
    alias: 'widget.tagwidget',
    requires: [
        'Lada.view.window.ReloadMask'
    ],
    store: null,
    displayField: 'tag',
    valueField: 'id',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    submitValue: false,

    /**
     * @private
     * Mask component to be show if store failed loading
     */
    reloadMask: null,

    /**
     * Window containing this widget.
     */
    parentWindow: null,

    /**
     * Component type to use as render target for the loading mask
     */
    maskTargetComponentType: 'fieldset',
    /**
     * Component name to use as render target for the loading mask
     */
    maskTargetComponentName: 'tagfieldset',

    //Templates to render global tags differently
    //Dropdown
    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
        '<tpl if="this.isGlobal(mstId)">',
        '<li role="option" class="x-boundlist-item"><b>*{tag}</b></li>',
        '<tpl else>',
        '<li role="option" class="x-boundlist-item">{tag}</li>',
        '</tpl>',
        '</tpl></ul>',
        {
            isGlobal: function(mstId) {
                return mstId === null || mstId === '';
            }
        }
    ),
    //Tagfield
    labelTpl: Ext.create('Ext.XTemplate',
        '<tpl if="this.isGlobal(mstId)">',
        '*{tag}',
        '<tpl else>',
        '{tag}',
        '</tpl>',
        {
            isGlobal: function(mstId) {
                return mstId === null || mstId === '';
            }
        }

    ),

    /**
     * Get the component to render the loading/reloading mask to.
     */
    getMaskTarget: function() {
        if (!this.parentWindow) {
            return this.getEl();
        }
        var queryString = this.maskTargetComponentType +
            '[name=' +
            this.maskTargetComponentName +
            ']';
        var targetComponent = this.parentWindow.down(queryString);
        if (!targetComponent) {
            Ext.log({
                msg: 'Invalid mask target: ' + queryString,
                level: 'warn'});
        }
        return targetComponent.getEl();
    },

    initComponent: function() {
        var me = this;
        this.store = Ext.create('Lada.store.Tag');

        this.reloadMask = Ext.create('Lada.view.window.ReloadMask', {
            reloadButtonHandler: me.reloadButtonClicked,
            reloadButtonHandlerScope: me
        });

        this.store.setLoadingCallback(
            function(store, records, successful) {
                //Skip if component is no longer visible
                if (!me.isVisible()) {
                    return;
                }
                if (!successful) {
                    me.setLoading(false);
                    me.reloadMask.renderTo = me.getMaskTarget();
                    me.mask();
                    me.showReloadMask();
                }
            }
        );

        this.callParent(arguments);
    },

    /**
     * Sets the current Probe or Messung and triggers the preselection
     */
    setTagged: function(id, recordType) {
        this.store.setTagged(id, recordType);
        this.preselectTags();
    },

    /**
     * Handle clicks on reload button.
     * Calls reload function
     */
    reloadButtonClicked: function() {
        this.reload();
    },

    /**
     *  Reloads the current store.
     *  @param silent If true, neither tags are preselected nor the dirty
     * status changed.
     *  @param callback Callback function to call after reload
     */
    reload: function(silent, callback) {
        var me = this;
        me.hideReloadMask();
        me.setLoading(true);
        this.store.load({
            callback: function() {
                if (!silent || silent === false) {
                    me.preselectTags();
                }
                if (callback) {
                    callback.call();
                }
                me.setLoading(false);
            }
        });
    },

    /**
     * Loads tags, assigned to the current probe and preselects the tags.
     */
    preselectTags: function() {
        this.setLoading(true);

        this.store.loadAssignedTags(this, function(records) {
            var ids = [];

            //Set tags, received from the server
            if (records) {
                for (var j = 0; j < records.length; j++) {
                    ids.push(records[j].id);
                }
            }
            this.setValue(ids);
            this.resetOriginalValue();
            this.setLoading(false);
        });
    },

    /**
     * Check if a tag with the given name already exists.
     * @param {String} tagName Tagname to check
     * @return {Boolean} true if a tag with the given name exists
     */
    tagExists: function(tagName) {
        //Find record: case sensitive and exact match
        if (this.store.find('tag', tagName, 0, false, true, true) !== -1) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Mask this component using the reload mask
     */
    showReloadMask: function() {
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
    }
});
