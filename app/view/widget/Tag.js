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

    /**
     * @private
     * Set to true if changes to the widget shall be monitored to update dirty state.
     */
    monitorChanges: true,

    /**
     * Mode, can either be single if assigning tags for a single probe
     * or 'bulk' if editing tags for a selection.
     * Defaults to 'single'
     */
    mode: 'single',

    /**
     * Object storing item changes for later syncing.
     * Format: tagId: ['create'|'delete']
     */
    changes: null,

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

    getMaskTarget: function() {
        if (!this.parentWindow) {
            return this.getEl();
        }
        var queryString = this.maskTargetComponentType + '[name=' + this.maskTargetComponentName + ']';
        var targetComponent = this.parentWindow.down(queryString);
        if (!targetComponent) {
            Ext.log({msg: 'Invalid mask target: ' + queryString, level: 'warn'});
        }
        return targetComponent.getEl();
    },

    /**
     * Returns always false to prevent ExtJS to handle this widget as a normal
     * form component. Use Lada.view.widget.Tag.hasChanges instead.
     */
    isDirty: function() {
        return false;
    },

    initComponent: function() {
        this.changes = {};
        this.store = Ext.create('Lada.store.Tag');
        if (this.monitorChanges === true) {
            this.on('change', this.handleChanges);
        }
        this.callParent(arguments);
    },

    setMessung: function(mId) {
        this.store.setMessung(mId);
        this.preselectTags();
    },

    /**
     * Sets the current probe and triggers the preselection
     */
    setProbe: function(pId) {
        this.store.setProbe(pId);
        this.preselectTags();
    },

    /**
     *  Reloads the current store.
     *  @param silent If true, neither tags are preselected nor the dirty status changed.
     *  @param callback Callback function to call after reload
     */
    reload: function(silent, callback) {
        var me = this;
        this.store.load({
            callback: function() {
                if (!silent || silent === false) {
                    me.preselectTags();
                    me.fireTagDirtyEvent(false);
                }
                me.changes = {};
                if (callback) {
                    callback.call();
                }
            }
        });
    },

    /**
     * Loads tags, assigned to the current probe and preselects the tags.
     * Unsaved changes will be reapplied.
     */
    preselectTags: function() {
        var me = this;
        this.setLoading(true);

        //Disable change monitoring and reset it after change event fired by preselection
        var wasMonitoringChanges = this.monitorChanges;
        this.setMonitorChanges(false);
        this.on('change', function() {
            this.setMonitorChanges(wasMonitoringChanges);
        }, this, {single: true});

        this.store.loadAssignedTags(me, function(records) {
            var ids = [];
            if (!records) {
                Ext.log({msg: 'No tag records loaded', level: 'warn'});
                return;
            }

            //Set tags, received from the server
            for (var j = 0; j < records.length; j++) {
                ids.push(records[j].id);
            }
            //Reapply unsaved changes
            var unsavedChanges = false;
            if (this.changes) {
                var keys = Object.keys(this.changes);
                for (var i = 0; i < keys.length; i++ ) {
                    var tagId = keys[i];
                    if (this.changes[tagId] === 'create') {
                        ids.push(tagId);
                        unsavedChanges = true;
                    } else if (this.changes[tagId] === 'delete') {
                        var indexOfTagId = ids.indexOf(tagId);
                        ids.splice(indexOfTagId, 1);
                        unsavedChanges = true;
                    }
                }
            }

            //If there are no unsaved changes, prevent activation of save button
            if (unsavedChanges === false) {
                try {
                    this.setValue(ids);
                    this.resetOriginalValue();
                    this.fireTagDirtyEvent(false);
                } catch (e) {
                    Ext.log({msg: 'Preselecting tags failed: ' + e, level: 'warn'});
                }

            } else {
                this.setValue(ids);
            }
            this.setLoading(false);
            //this.setMonitorChanges(wasMonitoringChanges);
        });
    },

    /**
     * Creates a tag object and hands it to the store for saving.
     * @param {String} tagName New tag name.
     */
    createTag: function(tagName) {
        var me = this;
        //TODO: Which mst?
        var mstId = Lada.mst[0];
        var tag = {
            tag: tagName,
            mstId: mstId
        };
        var callback = function() {
            me.reload();
        };
        this.store.createTag(tag, callback);
    },

    /**
     * Fires dirty change event for tag field
     * @param {Boolean} dirty True if tagfield is dirty, else false
     */
    fireTagDirtyEvent: function(dirty) {
        if (this.up('probeform')) {
            this.up('probeform').fireEventArgs('tagdirtychange', [{owner: this.up('probeform')}, dirty]);
        }
        if (this.up('messungform')) {
            this.up('messungform').fireEventArgs('tagdirtychange', [{owner: this.up('messungform')}, dirty]);
        }
    },

    /**
     * Get the type of the record used by this instance.
     * @return {string} Either 'probe', 'messung' or undefined if unknown
     */
    getRecordType: function() {
        if (this.up('probeform')) {
            return 'probe';
        }
        if (this.up('messungform')) {
            return 'messung';
        }
        return undefined;
    },

    /**
     * Check if widget has unsaved changes.
     * @return {Boolean} True if there are changes, else false
     */
    hasChanges: function() {
        return Ext.Object.getKeys(this.changes).length > 0;
    },

    /**
     * Handles item changes and updates the changes object.
     * @param {Lada.view.widget.Tag} TagWidget Widget instance
     * @param {Number} newValue New widget value
     * @param {Number} oldValue Old widget value
     */
    handleChanges: function(me, newValue, oldValue) {
        if (!me.monitorChanges) {
            return;
        }
        for (var i = 0; i < newValue.length; i++) {
            if (!Ext.Array.contains(oldValue, newValue[i])) {
                me.handleCreateChange(newValue[i]);
            }
        }

        for (var j=0; j < oldValue.length; j++) {
            if (!Ext.Array.contains(newValue, oldValue[j])) {
                me.handleDeleteChange(oldValue[j]);
            }
        }
        var dirty = false;
        //Check if field is dirty
        var keys = Object.keys(me.changes);
        for (var k = 0; k < keys.length; k++) {
            if (me.changes[keys[k]] !== null) {
                dirty = true;
            }
        }

        //If this widget is embedded in a probeform: fire dirty change event
        this.fireTagDirtyEvent(dirty);
    },

    /**
     * Handles a new item in the combobox and updates the changes object:
     * If item is not in the change object, create it,
     * if item was deleted during last changes, undo deletion
     * else: throw exception
     * @param {Number} item Item id to handle change of
     */
    handleCreateChange: function(item) {
        if (!this.changes[item] || this.changes[item] === null) {
            this.changes[item] = 'create';
        } else if (this.changes[item] === 'delete') {
            this.changes[item] = null;
            delete this.changes[item];
        }
    },

    /**
     * Handles the removal of an item in the Tagfield and updates the changes object:
     * If item is not in the object: delete it
     * If item was create it: undo creation
     * else: Throw exception
     * @param {Number} item Item id to handle change of
     */
    handleDeleteChange: function(item) {
        if (!this.changes[item] || this.changes[item] === null) {
            this.changes[item] = 'delete';
        } else if (this.changes[item] === 'create') {
            this.changes[item] = null;
            delete this.changes[item];
        }
    },

    /**
     * Check if a tag with the given name already exists.
     * @param {String} tagName Tagname to check
     * @return {Boolean} true if a tag with the given name exists
     */
    tagExists: function(tagName) {
        //Find record: case sensitive and exact match
        if (this.store.find('tag', tagName, 0, false, true,true) !== -1) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Reset the tag widget
     */
    resetChanges: function() {
        //TODO: Implement
    },

    /**
     * Save current changes
     */
    applyChanges: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var keys = Object.keys(this.changes);
        var requests = 0;
        var success = true;
        var errorHtml = '';
        var callback = function(options, suc, responseObj) {
            var response = Ext.decode(responseObj.responseText);
            var tagId = responseObj.request.jsonData.tagId;
            if (response.success === false) {
                success = false;
                var msg = i18n.getMsg('tag.widget.err.genericsave');
                if (response.message === '699') {
                    msg = i18n.getMsg('tag.widget.err.globaltagnotallowed.' + me.getRecordType());
                }
                errorHtml += me.store.getById(tagId).get('tag') + ' - ' + msg + '<br />';
            } else {
                me.changes[tagId] = null;
            }
            requests++;
            if (requests === keys.length) {
                if (success === false) {
                    //TODO: Handle failure
                    Ext.Msg.alert(i18n.getMsg('tag.widget.err.genericsavetitle'), errorHtml);
                } else {
                    me.fireTagDirtyEvent(false);
                }
            }
        };
        for (var i = 0; i < keys.length; i++ ) {
            var tag = keys[i];
            if (this.changes[tag] === 'create') {
                this.store.createZuordnung(tag, callback);
            }
            if (this.changes[tag] === 'delete') {
                this.store.deleteZuordnung(tag, callback);
            }
        }
    },

    /**
     * Get the current state of change monitoring.
     * @return {Boolean} True if changes are monitored, else false
     */
    isMonitorChanges: function() {
        return this.monitorChanges;
    },

    /**
     * Enable/Disable change monitoring.
     * @param {Boolean} monitorChanges True if changes shall be monitored
     */
    setMonitorChanges: function(monitorChanges) {
        if (this.monitorChanges === monitorChanges) {
            return;
        }
        this.monitorChanges = monitorChanges;
        if (monitorChanges) {
            this.on('change', this.handleChanges);
        } else {
            this.un('change', this.handleChanges);
        }
    }
});
