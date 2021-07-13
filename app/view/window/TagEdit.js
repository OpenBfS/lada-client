/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window for assigning tags to multiple record items.
 */
Ext.define('Lada.view.window.TagEdit', {
    extend: 'Ext.window.Window',
    alias: 'widget.tageditwindow',
    requires: [
        'Lada.view.window.TagCreate'
    ],

    layout: 'vbox',

    recordType: null,

    width: 400,
    selection: null,


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
                width: '75%',
                mode: 'bulk'
            }, {
                width: 25,
                height: 25,
                xtype: 'button',
                margin: '5 5 5 0',
                action: 'createtag',
                icon: 'resources/img/list-add.png',
                tooltip: i18n.getMsg('button.createtag.tooltip'),
                handler: function() {
                    var win = Ext.create('Lada.view.window.TagCreate', {
                        tagWidget: me.down('tagwidget'),
                        recordType: me.recordType,
                        mode: 'bulk',
                        tagEdit: me,
                        selection: me.selection,
                        probe: null
                    });
                    //Close window if parent window is closed
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
                action: 'bulkaddtags',
                margin: '5 5 5 5',
                text: i18n.getMsg('tag.assignwindow.assignbutton.text'),
                handler: this.assignToSelection
            }, {
                xtype: 'button',
                action: 'bulkdeletetags',
                margin: '5 5 5 5',
                text: i18n.getMsg('tag.assignwindow.unassignbutton.text'),
                handler: this.unassignFromSelection
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
        this.down('progressbar').updateProgress(0, '');

    },

    disableButtons: function() {
        this.down('button[action=createtag]').disable();
        this.down('button[action=bulkaddtags]').disable();
        this.down('button[action=bulkdeletetags]').disable();
        this.down('button[action=cancel]').disable();
        this.down('tagwidget').disable();
    },

    enableButtons: function() {
        this.down('button[action=createtag]').enable();
        this.down('button[action=bulkaddtags]').enable();
        this.down('button[action=bulkdeletetags]').enable();
        this.down('button[action=cancel]').enable();
        this.down('tagwidget').enable();
    },

    /**
     * Eventhandler that unassigns the selected tag(s) from the selected probe
     * instance(s)
     * @param button Button that caused the event
     */
    unassignFromSelection: function(button) {
        var me = button.up('tageditwindow');
        var i18n = Lada.getApplication().bundle;
        var tagwidget = me.down('tagwidget');
        var tags = tagwidget.getValue();
        var store = Ext.create('Lada.store.Tag', {
            autoload: false
        });
        var tagCount = tags.length * me.selection.length;
        var tagsSet = 0;
        me.down('progressbar').show();
        me.down('progressbar').updateProgress(
            0, i18n.getMsg('tag.assignwindow.progress', 0, tagCount, false));
        me.disableButtons();

        for (var i = 0; i < me.selection.length; i++) {
            var id = me.selection[i];
            switch (me.recordType) {
                case 'messung':
                    store.setMessung(id);
                    break;
                case 'probe':
                    store.setProbe(id);
                    break;
                default:
                    Ext.raise('Unkown record type: ' + me.recordType);
            }
            for (var j = 0; j < tags.length; j++) {
                var tag = tags[j];
                // eslint-disable-next-line no-loop-func
                store.deleteZuordnung(tag, function() {
                    tagsSet++;
                    var ratio = tagsSet/tagCount;
                    me.down('progressbar').updateProgress(
                        ratio,
                        i18n.getMsg(
                            'tag.assignwindow.progress',
                            tagsSet,
                            tagCount,
                            false));
                    if (ratio === 1) {
                        Ext.getCmp('dynamicgridid').reload();
                        me.enableButtons();
                    }
                });
            }
        }
    },

    /**
     * Eventhandler that assigns the selected tag(s) to the chosen probe
     * instance(s)
     * @param button Button that caused the event
     */
    assignToSelection: function(button) {
        var me = button.up('tageditwindow');
        var i18n = Lada.getApplication().bundle;
        var tagwidget = me.down('tagwidget');
        var tags = tagwidget.getValue();
        var store = Ext.create('Lada.store.Tag', {
            autoload: false
        });
        var tagCount = tags.length * me.selection.length;
        var tagsSet = 0;
        me.down('progressbar').show();
        me.down('progressbar').updateProgress(
            0, i18n.getMsg('tag.assignwindow.progress', 0, tagCount, false));
        me.disableButtons();

        for (var i = 0; i < me.selection.length; i++) {
            var id = me.selection[i];
            switch (me.recordType) {
                case 'messung':
                    store.setMessung(id);
                    break;
                case 'probe':
                    store.setProbe(id);
                    break;
                default:
                    Ext.raise('Unkown record type: ' + me.recordType);
            }
            for (var j = 0; j < tags.length; j++) {
                var tag = tags[j];
                // eslint-disable-next-line no-loop-func
                store.createZuordnung(tag, function() {
                    tagsSet++;
                    var ratio = tagsSet/tagCount;
                    me.down('progressbar').updateProgress(
                        ratio,
                        i18n.getMsg(
                            'tag.assignwindow.progress',
                            tagsSet,
                            tagCount,
                            false));
                    if (ratio === 1) {
                        Ext.getCmp('dynamicgridid').reload();
                        me.enableButtons();
                    }
                });
            }
        }
    }
});
