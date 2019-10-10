/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window for creating new tags.
 */
Ext.define('Lada.view.window.TagCreate', {
    extend: 'Ext.window.Window',
    alias: 'tagcreatewindow',

    layout: 'vbox',
    width: 300,

    /**
     * Tagwidget associated with this create window
     */
    tagWidget: null,

    /**
     * Tag edit window associated with this create window
     */
    tagEdit: null,
    /**
     * Probe instance set if creating a tag for a single probe
     */
    probe: null,

    /**
     * Array of probe instances used if creating tags for a selection
     */
    selection: [],

    /**
     * Mode. Can either be 'single' for creating a tag for a single probe
     * or 'bulk' for creating a tag for a selection
     */
    mode: 'single',

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.title = this.mode === 'single' ?
                i18n.getMsg('title.tagcreatewindowprobe', this.probe):
                i18n.getMsg('title.tagcreatewindowbulk', this.selection.length);
        this.items = [{
            xtype: 'textfield',
            width: '100%',
            margin: '5 5 5 5',
            msgTarget: 'under',
            //validate that text is not empty and the name does not already exists
            validator: function (val) {
                if (val.trim().length == 0) {
                    return i18n.getMsg('tag.createwindow.err.invalidtagname');
                }
                if (val.length == 0) {
                    return i18n.getMsg('tag.createwindow.err.emptytagname');
                }
                if (me.tagWidget.tagExists(val)) {
                    return i18n.getMsg('tag.createwindow.err.tagalreadyexists');
                }
                return true;
            }
        }, {
            xtype: 'button',
            text: i18n.getMsg('save'),
            margin: '5 5 5 5',
            handler: this.handleSaveClicked
        }]
        this.callParent(arguments);
    },

    /**
     * Saves a tag for a single probe instance
     */
    saveSingleTag: function(textfield) {
        var text = textfield.getValue();
        this.tagWidget.createTag(text);
        textfield.reset();
        Ext.getCmp('dynamicgridid').reload();
        var tagFilterWidget = Ext.getCmp('tagfilterwidget');
        if (tagFilterWidget) {
            tagFilterWidget.reload(true);
        }
    },

    /**
     * Creates and saves a tag for a selection of probe instances.
     * As tags are only created if they are associated with a probe,
     * the first step is to create a tag for the first selected probe.
     * Then it is chosen in the tag widget combobox and saved via the TagEdit window.
     */
    saveBulkTag: function(textfield) {
        var me = this;
        if (!this.selection || this.selection.length == 0) {
            return;
        }
        //Get the first probeId
        var firstPid = this.selection[0].data.probeId;
        if (!firstPid) {
            return;
        }
        var text = textfield.getValue();

        //Save tag for first probe. Should trigger itemadd event on tag widget.
        this.tagWidget.store.createTagForPid(text, firstPid, function(response) {
            var oldItems = Ext.clone(me.tagWidget.store.getData().items);
            //Wait for the reload to finish
            me.tagWidget.reload(true, function() {
                var newItems = Ext.clone(me.tagWidget.store.getData().items);
                //Look for the new item
                var newItem = null;
                for (var i = 0; i < newItems.length; i++) {
                    var id = newItems[i].id;
                    if (!Ext.Array.findBy(oldItems,
                            function(item, index) {
                                return id == item.id;
                            })
                    ) {
                        newItem = newItems[i];
                        break;
                    }
                }
                //Select new item in combobox and fire click event
                me.tagWidget.clearValue();
                me.tagWidget.select(newItem);
                me.tagEdit.down('button[action=bulkaddtags]').click();
            });
            me.close();
        });
    },

    /**
     * Handles click on save button:
     * Validate textfield input, if valid call single or bulk create function
     */
    handleSaveClicked: function(button) {
        var me = this.up();
        var textfield = me.down('textfield');
        var text = textfield.getValue();
        if (textfield.validate()) {
            me.mode === 'single' ? me.saveSingleTag(textfield): me.saveBulkTag(textfield);
        }
    }
});
