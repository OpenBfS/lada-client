/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window for creating and managing tags.
 */
Ext.define('Lada.view.window.TagManagement', {
    extend: 'Ext.window.Window',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    recordId: null,
    record: null,
    alias: 'widget.tagmanagementwindow',
    requires: ['Lada.view.form.Tag'],
    collapsible: true,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.items = [
            {
                xtype: 'tagform'
            }, {
                xtype: 'container',
                layout: 'hbox',
                items: [{
                    xtype: 'button',
                    text: i18n.getMsg('save'),
                    action: 'save',
                    margin: '5 5 5 5',
                    disabled: true
                }, {
                    xtype: 'button',
                    action: 'delete',
                    text: i18n.getMsg('delete'),
                    margin: '5 5 5 5',
                    hidden: true,
                    disabled: true
                }, {
                    xtype: 'button',
                    text: i18n.getMsg('cancel'),
                    margin: '5 5 5 5',
                    handler: function() {
                        me.close();
                    }
                }]
            }
        ];
        this.callParent(arguments);
        this.initData();

    },
    initData: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var callback = function() {
            if (me.record) {
                me.down('tagform').setRecord(me.record);
                if (me.record.get('readonly') || me.record.phantom) {
                    me.down('button[action=delete]').setHidden(true);
                } else {
                    me.down('button[action=delete]').setHidden(false);
                }
            }
            me.setLoading(false);
        };
        if (!this.recordId) {
            this.setTitle(i18n.getMsg('tag.createWindow.title'));
            this.record = Ext.create('Lada.model.Tag', {
                readonly: false,
                mstId: Lada.mst[0],
                netzbetreiberId: Lada.netzbetreiber[0]
            });
            callback();
        } else {
            this.setLoading(true);
            Ext.ClassManager.get('Lada.model.Tag').load(this.recordId, {
                failure: function() {
                    // TODO show error window. Failed to load
                    callback();
                },
                success: function(record) {
                    me.record = record;
                    me.setTitle(i18n.getMsg(
                        'tag.manageWindow.title', record.get('tag')));
                    callback();
                }
            });
        }
    }
});
