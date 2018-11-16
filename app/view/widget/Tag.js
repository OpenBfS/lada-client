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

    isDirty: function() {
        return false;
    },

    /**
     * Object storing item changes for later syncing.
     * Format: tagId: ['create'|'delete']
     */
    changes: {},

    initComponent: function() {
        var i18n= Lada.getApplication().bundle;
        this.emptyText= i18n.getMsg('emptytext.tag');
        this.store = Ext.create('Lada.store.Tag');
        this.on('change', this.handleChanges);
        this.callParent(arguments);
    },

    /**
     * Sets the current probe and triggers the preselection
     */
    setProbe: function(pId) {
        this.store.setProbe(pId);
        this.preselectTags();
    },

    /** Reloads the current store */
    reload: function() {
        var me = this;
        this.store.load({
            callback: function() {
                me.preselectTags();
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
        this.store.loadAssignedTags(me, function(records) {
            var ids = [];
            this.suspendEvents();

            //Set tags, received from the server
            for (var i = 0; i < records.length; i++) {
                ids.push(records[i].id);
            }
            //Reapply unsaved changes
            var keys = Object.keys(this.changes);
            var unsavedChanges = false;
            for (var i = 0; i < keys.length; i++ ) {
                var tagId = keys[i];
                if (this.changes[tagId] === 'create') {
                    ids.push(tagId);
                    unsavedChanges = true;
                } else if (this.changes[tagId] === 'delete'){
                    var indexOfTagId = ids.indexOf(tagId);
                    ids.splice(indexOfTagId, 1);
                    unsavedChanges = true;
                }
            }

            //If there are no unsaved changes, prevent activation of save button
            if (!unsavedChanges) {
                this.setValue(ids);
                this.resetOriginalValue();
                this.resumeEvents();
            } else {
                this.resumeEvents();
                this.setValue(ids);
            }
            this.setLoading(false);
        });
    },

    /**
     * Creates a tag object and hands it to the store for saving.
     */
    createTag: function(tagName) {
        var me = this;
        //TODO: Which mst?
        var mstId = Lada.mst[0];
        var tag = {
            tag: tagName,
            mstId: mstId
        };
        var callback = function(response) {
            me.reload();
        };
        this.store.createTag(tag, callback);
    },

    /**
     * Handles item changes and updates the changes object
     */
    handleChanges: function(me, newValue, oldValue) {
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
            if (me.changes[keys[k]] != null) {
                dirty = true;
            }
        }
        me.up('probeform').fireEventArgs('tagdirtychange', [{owner: me.up('probeform')}, dirty])

    },

    /**
     * Handles a new item in the combobox and updates the changes object:
     * If item is not in the change object, create it,
     * if item was deleted during last changes, undo deletion
     * else: throw exception
     */
    handleCreateChange: function(item) {
        if (!this.changes[item]) {
            this.changes[item] = 'create'
        } else {
            if (this.changes[item] === 'delete') {
                this.changes[item] = null;
            } else {
                //TODO: Exception
            }
        }
    },

    /**
     * Handles the removal of an item in the Tagfield and updates the changes object:
     * If item is not in the object: delete it
     * If item was create it: undo creation
     * else: Throw exception
     */
    handleDeleteChange: function(item) {
        if (!this.changes[item]) {
            this.changes[item] = 'delete';
        } else {
            if (this.changes[item] == 'create') {
                this.changes[item] = null;
            } else {
                //TODO: Exception
            }
        }
    },

    /**
     * Returns true if a tag with the given name exists
     */
    tagExists: function(tagName) {
        //Find record: case sensitive and exact match
        if (this.store.find('tag', tagName, 0, false, true,true) != -1) {
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
        var keys = Object.keys(this.changes);
        var requests = 0;
        var success = true;
        for (var i = 0; i < keys.length; i++ ) {
            var tag = keys[i];
            if (this.changes[tag] === 'create') {
                this.store.createZuordnung(tag, function(options, suc, responseObj) {
                    var response = Ext.decode(responseObj.responseText);
                    if (response.success == false) {
                        success = false;
                    }
                    requests++;
                    me.changes[tag] = null;
                    if (requests == keys.length) {
                        if (success == false) {
                            //TODO: Handle failure
                        }
                        me.up('probeform').fireEventArgs('tagdirtychange', [{owner: me.up('probeform')}, false]);
                    }
                });
            }
            if (this.changes[tag] === 'delete') {
                this.store.deleteZuordnung(tag, function(options, suc, responseObj) {
                    var response = Ext.decode(responseObj.responseText);
                    if (response.success == false) {
                        success = false;
                    }
                    requests++;
                    if (requests == keys.length) {
                        if (success == false) {
                            //TODO: Handle failure
                        }
                        me.up('probeform').fireEventArgs('tagdirtychange', [{owner: me.up('probeform')}, false]);
                    }
                });
            }
        }
        this.changes = {};
    }

});