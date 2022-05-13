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

    recordType: null, //probe | messung

    width: 400,
    selection: null, //list of ids according to recordtype

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
            xtype: 'progressbar',
            width: '100%',
            hidden: true,
            margin: '5 10 10 5'
        }, {
            xtype: 'container',
            layout: 'hbox',
            name: 'buttoncontainer',
            items: [{
                xtype: 'button',
                action: 'bulkaddzuordnung',
                margin: '5 5 5 5',
                disabled: true,
                text: i18n.getMsg('tag.assignwindow.assignbutton.text')
            }, {
                xtype: 'button',
                action: 'bulkdeletezuordnung',
                margin: '5 5 5 5',
                disabled: true,
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

        this.down('tagwidget').setTagged(me.selection, me.recordType);

        this.down('progressbar').updateProgress(0, '');
    },

    collectCurrentTags: function() {
        this.down('tagwidget').setTagged(this.selection, this.recordType);
    },

    actionCallBack: function() {
        Ext.data.StoreManager.get('tags').reload();
        this.collectCurrentTags();
    },
    failureCallBack: function() {
        Ext.data.StoreManager.get('tags').reload();
        this.collectCurrentTags();
    }
});
