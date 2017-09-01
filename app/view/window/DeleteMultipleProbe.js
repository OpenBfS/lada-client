/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to show a confirmation dialog to delete a Probe and a progress bar after confirmation
 */
Ext.define('Lada.view.window.DeleteMultipleProbe', {
    extend: 'Ext.window.Window',
    alias: 'widget.deleteMultipleProbe',

    collapsible: true,
    maximizable: true,
    autoShow: true,
    autoScroll: true,
    layout: 'fit',
    constrain: true,

    selection: null,
    parentWindow: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            }
        });

        this.title = i18n.getMsg('delete.multiple_probe.window.title');
        var me = this;
        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            },
            close: function () {
                this.parentWindow.probenWindow = null;
            }
        });

        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "Id" param to load the correct item.
        this.items = [{
            border: 0,
            autoScroll: true,
            items: [{
                xtype: 'panel',
                border: 0,
                margin: 5,
                layout: 'fit',
                html: '<p>'
                    + i18n.getMsg('delete.multiple_probe')
                    + '<br/>'
                    + '<br/>'
                    + i18n.getMsg('delete.multiple_probe.warning')
                    + '</p>'
            }]
        }];
        this.callParent(arguments);
    },

    /**
     * Inititalise Data
     */
    initData: function() {
        var i18n = Lada.getApplication().bundle;
        me = this;
    },

    /**
     * Reload the Application
     */
    reload: function(btn) {
        if (btn === 'yes') {
            location.reload();
        }
    }
});

