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
    tagWidget: null,
    //A Probe's hauptprobenummer, used in the window title
    probe: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.title = i18n.getMsg('title.tagcreatewindow', this.probe);
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
     * Handles click on save button:
     * Validate textfield input, if valid create tag and clear textfield
     */
    handleSaveClicked: function(button) {
        var me = this.up();
        var textfield = me.down('textfield');
        var text = textfield.getValue();
        if (textfield.validate()) {
            me.tagWidget.createTag(text);
            textfield.reset();
            Ext.getCmp('dynamicgridid').reload();
        }
    }
});
