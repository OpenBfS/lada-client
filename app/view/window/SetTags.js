/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window for managing tags of multiple record items.
 */
Ext.define('Lada.view.window.SetTags', {
    extend: 'Ext.window.Window',
    alias: 'widget.settags',
    requires: [
        'Lada.view.window.TagManagement',
        'Lada.store.Tag'
    ],

    layout: 'vbox',
    width: 400,

    recordType: null, //probe | messung

    // One and only one of both has to be set:
    parentGrid: null,
    parentWindow: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.items = [{
            xtype: 'container',
            layout: 'hbox',
            width: '100%',
            name: 'tagwidgetcontainer',
            items: [{
                xtype: 'tagwidget',
                margin: '5 5 5 5',
                width: '75%'
            }, {
                width: 25,
                height: 25,
                xtype: 'button',
                margin: '5 5 5 0',
                action: 'createtag',
                icon: 'resources/img/list-add.png',
                tooltip: i18n.getMsg('button.createtag.tooltip'),
                handler: function() {
                    var win = Ext.create('Lada.view.window.TagManagement');

                    // When new tag is added, select it
                    win.down('tagform').store.on(
                        'add',
                        function(store, rec) {
                            me.down('tagwidget').addValue(rec);
                        },
                        me,
                        {single: true}
                    );

                    // Close window if parent window is closed
                    me.on('close', function() {
                        win.close();
                    });

                    win.show();
                }
            }]
        }, {
            xtype: 'container',
            layout: 'hbox',
            name: 'buttoncontainer',
            items: [{
                xtype: 'button',
                action: 'bulkaddzuordnung',
                margin: '5 5 5 5',
                disabled: true, // Initially disabled because nothing changed
                text: i18n.getMsg('tag.assignwindow.assignbutton.text')
            }, {
                xtype: 'button',
                action: 'bulkdeletezuordnung',
                margin: '5 5 5 5',
                text: i18n.getMsg('tag.assignwindow.unassignbutton.text')
            }, {
                xtype: 'button',
                text: i18n.getMsg('cancel'),
                action: 'cancel',
                margin: '5 5 5 5',
                handler: function() {
                    me.close();
                }
            }]
        }];
        this.callParent(arguments);

        this.down('tagwidget').setTagged(
            me.getSelection(), me.recordType, true);

        // Initially enabled to delete existing, but disable if no tags selected
        this.down('button[action=bulkdeletezuordnung]').setDisabled(
            !this.down('tagwidget').getValue().length);
    },

    getSelection: function() {
        return this.parentWindow
            ? [this.parentWindow.record.get('id')]
            : this.parentGrid.getSelection();
    }
});
