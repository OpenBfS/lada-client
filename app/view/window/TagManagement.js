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
        this.items = [{
            xtype: 'tagform'
        }];
        this.callParent(arguments);
        this.initData();

    },

    initData: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var callback = function() {
            if (me.record) {
                var form = me.down('tagform');
                form.setRecord(me.record);
                form.down('button[action=delete]').setDisabled(
                    me.record.get('readonly') || me.record.phantom);
                // See controller/form/Tag for save button enabling
            }
            me.down('tagform').isValid();
            me.setLoading(false);
        };
        if (!this.recordId) {
            this.setTitle(i18n.getMsg('tag.createWindow.title'));
            this.record = Ext.create('Lada.model.Tag', {
                readonly: false,
                measFacilId: Lada.mst[0],
                networkId: Lada.netzbetreiber[0]
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
