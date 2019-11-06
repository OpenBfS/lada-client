/* Copyright (C) 2019 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Singleton window showing elan scenario information.
 */
Ext.define('Lada.view.window.ElanScenarioWindow', {
    extend: 'Ext.window.Window',
    alias: 'window.elanscenariowindow',

    /**
     * Component id. Should no be changed, as there should only one event window which
     * can be updated.
     */
    id: 'elanwindowid',

    height: 350,

    layout: 'fit',

    title: null,

    width: 250,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.title = i18n.getMsg('title.elanscenarios');
        this.items = [{
            xtype: 'panel',
            layout: 'fit',
            margin: '5 5 5 5',
            html: 'No events',
            scrollable: true
        }];
        this.bbar = ['->', {
            xtype: 'button',
            text: i18n.getMsg('close'),
            handler: function(button) {
                me.close();
            }
        }];
        this.callParent(arguments);
        this.update();
    },

    show: function() {
        this.update();
        this.callParent(arguments);
    },

    /**
     * Update the window content using the localStorage module.
     * Note: The event content itself is not refresh using the remote server
     */
    update: function() {
        var i18n = Lada.getApplication().bundle;
        var eventContent = Lada.util.LocalStorage.getDokpoolEvents();
        if (!eventContent || eventContent === '') {
            eventContent = i18n.getMsg('window.elanscenario.emptytext');
        }
        this.down('panel').setHtml(eventContent);
    }

});