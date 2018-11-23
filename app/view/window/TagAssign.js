/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window for assigning tags to multiple probe items.
 */
Ext.define('Lada.view.window.TagAssign', {
    extend: 'Ext.window.Window',
    alias: 'widget.tagassignwindow',

    layout: 'vbox',
    width: 400,
    selection: null,


    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.items = [{
            xtype: 'tagwidget',
            margin: '5 5 5 5',
            width: '100%'
        }, {
            xtype: 'container',
            layout: 'hbox',
            name: 'buttoncontainer',
            items: [{
                xtype: 'button',
                margin: '5 5 5 5',
                text: i18n.getMsg('tag.assignwindow.assignbutton.text'),
                handler: this.assignToSelection
            },{
                xtype: 'button',
                text: i18n.getMsg('cancel'),
                margin: '5 5 5 5',
                handler: function() {
                    me.close();
                }
            }]
        }, {
            xtype: 'progressbar',
            hidden: true,
            width: '100%',
            margin: '5 10 10 10'
        }];
        this.callParent(arguments);
    },

    assignToSelection: function(button) {
        var me = button.up('tagassignwindow');
        var i18n = Lada.getApplication().bundle;
        var tagwidget = me.down('tagwidget');
        var tags = tagwidget.getValue();
        var store = Ext.create('Lada.store.Tag', {
            autoload: false
        });
        var tagCount = tags.length * me.selection.length;
        var tagsSet = 0;
        me.down('progressbar').updateProgress(0, i18n.getMsg('tag.assignwindow.progress', 0, tagCount, false));
        me.down('progressbar').show();
        me.down('container[name=buttoncontainer]').hide();
        me.down('tagwidget').disable();

        for (var i = 0; i < me.selection.length; i++) {
            var probeId = me.selection[i].data.probeId;
            store.pId = probeId;
            for (var j = 0; j < tags.length; j++) {
                var tag = tags[j];
                store.createZuordnung(tag, function(request, success, response) {
                    var responseJson = Ext.decode(response.responseText);
                    if (success == false) {
                        console.log('500 on tag set');
                    }
                    tagsSet++;
                    var ratio = tagsSet/tagCount;
                    me.down('progressbar').updateProgress(
                            ratio, i18n.getMsg('tag.assignwindow.progress', tagsSet, tagCount, false));
                    if (ratio == 1) {
                        Ext.getCmp('dynamicgridid').reload();
                    }
                });
            }
        }





    }
});
