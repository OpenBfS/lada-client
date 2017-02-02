/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to create/edit the Ort/Probe or Ort/Messprogramm Relation
 */

Ext.define('Lada.view.window.Ortszuordnung', {
    extend: 'Ext.window.Window',
    alias: 'widget.ortszuordnungwindow',

    requires: [
        'Lada.model.Ortszuordnung',
        'Lada.model.OrtszuordnungMp',
        'Lada.view.form.Ortszuordnung',
        'Lada.view.form.Ortserstellung',
        'Lada.view.panel.Map',
        'Lada.view.grid.Orte'
    ],

    collapsible: true,
    maximizable: true,
    autoshow: true,
    layout: 'fit',
    constrain: true,

    probe: null,
    messprogramm: null,

    parentWindow: null,
    record: null,
    grid: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('ortszuordnung.window.title');
        var recordtype;
        if (this.probe) {
            if (this.record) {
                // A probe record will be edited
                this.title = i18n.getMsg('ortszuordnung.window.title')
                            + ' '
                            + i18n.getMsg('ortszuordnung.window.title2')
                            + ' '
                            + i18n.getMsg('probe')
                            + ' '
                            + this.probe.get('hauptprobenNr')
                            + ' '
                            + i18n.getMsg('edit');
            } else  {
                // A new probe record will be created
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
        } else if (this.messprogramm) {
            if (this.record) {
                // A messprogramm record will be edited
                this.title = i18n.getMsg('ortszuordnung.window.title')
                            + ' '
                            + i18n.getMsg('ortszuordnung.window.title2')
                            + ' '
                            + i18n.getMsg('messprogramm')
                            + ' '
                            + i18n.getMsg('edit');
            } else  {
                // A new messprogramm record will be created
                this.title = i18n.getMsg('ortszuordnung.window.title')
                            + ' '
                            + i18n.getMsg('ortszuordnung.window.title2')
                            + ' '
                            + i18n.getMsg('messprogramm')
                            + ' '
                            + i18n.getMsg('create');
            }
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
                type: this.probe? 'probe': 'mpr'
            }, {
                region: 'south',
                border: 0,
                layout: 'fit',
                name: 'ortgrid',
                hidden: true,
                maxHeight: 240,
                items: [{
                    xtype: 'ortstammdatengrid'
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    border: '0, 1, 1, 1',
                    style: {
                        borderBottom: '1px solid #b5b8c8 !important',
                        borderLeft: '1px solid #b5b8c8 !important',
                        borderRight: '1px solid #b5b8c8 !important'
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'search',
                        labelWidth: 50,
                        enableKeyEvents: true,
                        fieldLabel: i18n.getMsg('ortszuordnung.ortsuche'),
                    }, '->', {
                        text: i18n.getMsg('orte.new'),
                        action: 'createort'
                    }, {
                        text: i18n.getMsg('orte.frommap'),
                        action: 'frommap'
                    }, {
                        text: i18n.getMsg('orte.clone'),
                        action: 'clone',
                        disabled : true
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
            if (this.probe) {
                this.record = Ext.create('Lada.model.Ortszuordnung');
                this.record.set('probeId', this.probe.get('id'));
            } else {
                this.record = Ext.create('Lada.model.OrtszuordnungMp');
                this.record.set('messprogrammId', this.messprogramm.get('id'));
            }
            if (!this.record.get('letzteAenderung')) {
                this.record.data.letzteAenderung = new Date();
            }
        }
        this.down('ortszuordnungform').setRecord(this.record);
        var map = this.down('map');
        var osg = this.down('ortstammdatengrid');
        this.ortstore = Ext.create('Lada.store.Orte', {
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
                        osg.setStore(me.ortstore);
                        map.addLocations(me.ortstore);
                        map.featureLayer.setVisibility(false);
                        map.selectedFeatureLayer = new OpenLayers.Layer.Vector(
                            'gewählter Messpunkt', {
                                styleMap: new OpenLayers.StyleMap({
                                    externalGraphic: 'resources/lib/OpenLayers/img/marker-blue.png',
                                    pointRadius: 12,
                                    label: '${bez}',
                                    labelAlign: 'rt',
                                    fontColor: 'blue',
                                    fontWeight: 'bold',
                                }),
                                displayInLayerSwitcher: false,
                                projection: new OpenLayers.Projection('EPSG:3857')
                            });
                        map.map.addLayer(map.selectedFeatureLayer);
                        map.selectedFeatureLayer.setZIndex(499);
                        var ortId = me.messprogramm? me.record.get('ort') : me.record.get('ortId');
                        if (ortId){
                            var feat = map.featureLayer.getFeaturesByAttribute('id', ortId);
                            var ortrecord = this.findRecord('id', ortId);
                            osg.selectOrt(map, feat);
                            map.selectFeature(this.model, ortrecord);
                            me.down('ortszuordnungform').setOrt(null,ortrecord);
                        }
                    }
                }
            }
        });
        this.ortstore.load();
        map.addListener('featureselected', osg.selectOrt, osg);
        osg.addListener('select', map.selectFeature, map);
        osg.addListener('select', me.activateCloneButton, me);
    },

    /**
     * @private
     * Override to display and update the map view in the panel.
     */
    afterRender: function(){
        this.superclass.afterRender.apply(this, arguments);
        var map = this.down('map');
        map.map.addControl(new OpenLayers.Control.LayerSwitcher());
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
    },

    activateCloneButton: function() {
        var toolbar = this.down('panel[name=ortgrid]').getDockedItems()[0];
        toolbar.down('button[action=clone]').enable();
    }
});

