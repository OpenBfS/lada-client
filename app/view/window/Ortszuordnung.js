/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to create/edit the Ort / Probe Relation
 */
Ext.define('Lada.view.window.Ortszuordnung', {
    extend: 'Ext.window.Window',
    alias: 'widget.ortszuordnungwindow',

    requires: [
        'Lada.view.form.Ortszuordnung',
        'Lada.view.panel.Ort'
    ],

    collapsible: true,
    maximizable: true,
    autoshow: true,
    layout: 'vbox',
    constrain: true,

    probe: null,
    parentWindow: null,
    record: null,
    grid: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        this.title = i18n.getMsg('ortszuordnung.window.title');

        if (this.record && this.probe) {
            // A record be edited
            this.title = i18n.getMsg('ortszuordnung.window.title')
                            + ' '
                            + i18n.getMsg('ortszuordnung.window.title2')
                            + ' '
                            + i18n.getMsg('probe')
                            + ' '
                            + this.probe.get('hauptprobennr')
                            + ' '
                            + i18n.getMsg('edit');
        }
        else if (this.probe) {
            // A new record will be created
            this.title = i18n.getMsg('ortszuordnung.window.title')
                            + ' '
                            + i18n.getMsg('ortszuordnung.window.title2')
                            + ' '
                            + i18n.getMsg('probe')
                            + ' '
                            + this.probe.get('hauptprobennr')
                            + ' '
                            + i18n.getMsg('create');
        }

        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }];
        this.width = 900;
        this.height = 515;
        this.bodyStyle = {background: '#fff'};

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            }
        });

        this.items = [{
            xtype: 'ortszuordnungform',
            layout: 'fit',
            width: '100%',
            margin: 5
        }, {
            xtype: 'ortpanel',
            flex: 1,
            toolbarPos: 'bottom',
            margin: 5
        }];
        this.callParent(arguments);
    },

    /**
     * Initialise the Data of this Window
     */
    initData: function() {
        if (!this.record) {
            this.record = Ext.create('Lada.model.Ortszuordnung');
            if (!this.record.get('letzteAenderung')) {
                this.record.data.letzteAenderung = new Date();
            }
            this.record.set('probeId', this.probe.get('id'));
        }
        this.down('ortszuordnungform').setRecord(this.record);
        this.down('ortpanel').setStore();
    },

    /**
     * @private
     * Override to display and update the map view in the panel.
     */
    afterRender: function(){
        this.superclass.afterRender.apply(this, arguments);
        var map = this.down('ortpanel').down('map');
        map.map.zoomToMaxExtent();
    },

    /**
     * Instructs the fields / forms listed in this method to set a message.
     * @param errors These Errors shall be shown
     * @param warnings These Warning shall be shown
     */
    setMessages: function(errors, warnings) {
        //todo this is a stub
    },

    /**
     * Instructs the fields / forms listed in this method to clear their messages.
     */
    clearMessages: function() {
        //todo this is a stub
    }
});

