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
    store: Ext.create('Lada.store.Tag'),
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

    /**
     * Loads tags assigned to the current probe and preselects the tags
     */
    preselectTags: function() {
        this.setLoading(true);
        this.store.loadAssignedTags(this, function(records) {
            this.suspendEvents();
            var ids = [];
            for (var i = 0; i < records.length; i++) {
                ids.push(records[i].id);
            }
            this.setValue(ids);
            this.resetOriginalValue();
            this.resumeEvents();
            this.setLoading(false);
        })
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
     * Reset the tag widget
     */
    resetChanges: function() {

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