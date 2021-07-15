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
     * Array of IDs used if creating tags for a selection
     */
    selection: [],

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.title = i18n.getMsg(
            'title.tagcreatewindowbulk.' + this.recordType,
            this.selection.length);
        this.items = [{
            xtype: 'textfield',
            width: '100%',
            margin: '5 5 5 5',
            msgTarget: 'under',
            //validate that text is not empty and name does not already exists
            validator: function(val) {
                if (val.trim().length === 0) {
                    return i18n.getMsg('tag.createwindow.err.invalidtagname');
                }
                if (val.length === 0) {
                    return i18n.getMsg('tag.createwindow.err.emptytagname');
                }
                if (me.tagWidget.tagExists(val)) {
                    return i18n.getMsg('tag.createwindow.err.tagalreadyexists');
                }
                return true;
            }
        }, {
            xtype: 'container',
            layout: 'hbox',
            items: [{
                xtype: 'button',
                text: i18n.getMsg('save'),
                margin: '5 5 5 5',
                handler: this.handleSaveClicked
            }, {
                xtype: 'button',
                text: i18n.getMsg('cancel'),
                margin: '5 5 5 5',
                handler: function() {
                    me.close();
                }
            }]
        }];
        this.callParent(arguments);
    },

    /**
     * Creates and saves a tag for a selection of messung instances.
     * As tags are only created if they are associated with a messung,
     * the first step is to create a tag for the first selected messung.
     * Then it is chosen in the tag widget combobox and saved via the TagEdit
     * window.
     */
    saveBulkTagMessung: function(textfield) {
        var me = this;
        if (!this.selection || this.selection.length === 0) {
            return;
        }
        //Get the first messungId
        var firstMid = this.selection[0];
        if (!firstMid) {
            return;
        }
        var text = textfield.getValue();

        //Save tag for first probe. Should trigger itemadd event on tag widget.
        this.tagWidget.store.createTagForMid(text, firstMid, function() {
            var oldItems = Ext.clone(me.tagWidget.store.getData().items);
            //Wait for the reload to finish
            me.tagWidget.reload(true, function() {
                var newItems = Ext.clone(me.tagWidget.store.getData().items);
                //Look for the new item
                var newItem = null;
                for (var i = 0; i < newItems.length; i++) {
                    var id = newItems[i].id;
                    if (!Ext.Array.findBy(
                        oldItems,
                        // eslint-disable-next-line no-loop-func
                        function(item) {
                            return id === item.id;
                        })
                    ) {
                        newItem = newItems[i];
                        break;
                    }
                }
                //Select new item in combobox and fire click event
                me.tagWidget.clearValue();
                me.tagWidget.select(newItem);
                textfield.reset();
                textfield.up('window').close();
                me.tagEdit.down('button[action=bulkaddtags]').click();
            });
        });
    },


    /**
     * Creates and saves a tag for a selection of probe instances.
     * As tags are only created if they are associated with a probe,
     * the first step is to create a tag for the first selected probe.
     * Then it is chosen in the tag widget combobox and saved via the TagEdit
     * window.
     */
    saveBulkTagProbe: function(textfield) {
        var me = this;
        if (!this.selection || this.selection.length === 0) {
            return;
        }
        //Get the first probeId
        var firstPid = this.selection[0];
        if (!firstPid) {
            return;
        }
        var text = textfield.getValue();

        //Save tag for first probe. Should trigger itemadd event on tag widget.
        this.tagWidget.store.createTagForPid(text, firstPid, function() {
            var oldItems = Ext.clone(me.tagWidget.store.getData().items);
            //Wait for the reload to finish
            me.tagWidget.reload(true, function() {
                var newItems = Ext.clone(me.tagWidget.store.getData().items);
                //Look for the new item
                var newItem = null;
                for (var i = 0; i < newItems.length; i++) {
                    var id = newItems[i].id;
                    if (!Ext.Array.findBy(oldItems,
                        // eslint-disable-next-line no-loop-func
                        function(item) {
                            return id === item.id;
                        })
                    ) {
                        newItem = newItems[i];
                        break;
                    }
                }
                //Select new item in combobox and fire click event
                me.tagWidget.clearValue();
                me.tagWidget.select(newItem);
                textfield.reset();
                textfield.up('window').close();
                me.tagEdit.down('button[action=bulkaddtags]').click();
            });
        });
    },

    /**
     * Handles click on save button:
     * Validate textfield input, if valid call single or bulk create function
     */
    handleSaveClicked: function(button) {
        var me = button.up('window');
        var textfield = me.down('textfield');
        if (textfield.validate()) {
            switch (me.recordType) {
                case 'messung':
                    me.saveBulkTagMessung(textfield);
                    break;
                case 'probe':
                    me.saveBulkTagProbe(textfield);
                    break;
                default:
                    Ext.raise('Unkown record type: ' + me.recordType);
            }
        }
    }
});
