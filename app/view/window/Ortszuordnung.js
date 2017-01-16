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
    layout: 'fit',
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
                            + this.probe.get('hauptprobenNr')
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
                            + this.probe.get('hauptprobenNr')
                            + ' '
                            + i18n.getMsg('create');
        }

        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }];
        this.width = 900;
        this.height = 465;
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
            layout: 'border',
            bodyStyle: {background: '#fff'},
            border: 0,
            items: [{
                xtype: 'map',
                region: 'center',
                layout: 'border',
                margin: '13, 5, 10, 5',
                minHeight: 380,
                externalOrteStore: true
            }, {
                xtype: 'ortszuordnungform',
                region: 'east',
                minHeight: 380,
            }, {
                region: 'south',
                border: 0,
                layout: 'fit',
                name: 'ortgrid',
                hidden: true,
                maxHeight: '45%',
                items: [{
                    xtype: 'ortstammdatengrid',
                    maxHeight: '45%'
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    border: '0, 1, 1, 1',
                    style: {
                        borderBottom: '1px solid #b5b8c8 !important',
                        borderLeft: '1px solid #b5b8c8 !important',
                        borderRight: '1px solid #b5b8c8 !important'
                    },
                    items: [{
                        xtype: 'textfield',
                        labelWidth: 50,
                        fieldLabel: i18n.getMsg('ortszuordnung.ortsuche'),
                    }, '->', {
                        text: i18n.getMsg('orte.new'),
                        action: 'createort',
                    }, {
                        text: i18n.getMsg('orte.frommap'),
                        action: 'frommap',
                    }, {
                        text: i18n.getMsg('orte.clone'),
                        action: 'clone',
                    }, {
                        text: i18n.getMsg('orte.select'),
                        action: 'select',
                    }]
                }]
            }]
        }];
        this.callParent(arguments);
    },

    /**
     * Initialise the Data of this Window
     */
    initData: function() {
        var me = this;
        if (!this.record) {
            this.record = Ext.create('Lada.model.Ortszuordnung');
            if (!this.record.get('letzteAenderung')) {
                this.record.data.letzteAenderung = new Date();
            }
            this.record.set('probeId', this.probe.get('id'));
        }
        this.down('ortszuordnungform').setRecord(this.record);
        var map = this.down('map');
        var osg = this.down('ortstammdatengrid');
        var ortstore = Ext.create('Lada.store.Orte', {
            defaultPageSize: 0,
            autoLoad: false,
            listeners: {
                beforeload: {
                    fn: function() {
                        osg.setLoading(true);
                        map.setLoading(true);
                    }
                },
                load: {
                    fn: function() {
                        osg.setLoading(false);
                        map.setLoading(false);
                        osg.setStore(ortstore);
                        var store = Ext.create('Lada.store.Orte', {
                            autoLoad: false
                        });
                        store.add(ortstore.getRange());
                        var rec = store.getById(me.record.get('ortId'));
                        store.remove(rec);
                        console.log(rec);
                        map.addLocations(store);
                    }
                }
            }
        });
        ortstore.load();
    },

    /**
     * @private
     * Override to display and update the map view in the panel.
     */
    afterRender: function(){
        this.superclass.afterRender.apply(this, arguments);
        var map = this.down('map');
        map.map.addControl(new OpenLayers.Control.LayerSwitcher());
        //map.map.zoomToMaxExtent();
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

