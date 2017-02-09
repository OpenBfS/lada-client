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
                externalOrteStore: true
            }, {
                xtype: 'ortszuordnungform',
                region: 'east',
                type: this.probe? 'probe': 'mpr'
            }, {
                region: 'south',
                border: 0,
                layout: 'fit',
                name: 'ortgrid',
                hidden: true,
                height: 240,
                items: [{
                    xtype: 'ortstammdatengrid',
                    isMessprogramm: this.messprogramm? true: false
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [{
                        xtype: 'textfield',
                        name: 'search',
                        labelWidth: 50,
                        enableKeyEvents: true,
                        fieldLabel: i18n.getMsg('ortszuordnung.ortsuche'),
                    }, '->', {
                        text: i18n.getMsg('orte.new'),
                        icon: 'resources/img/list-add.png',
                        action: 'createort'
                    }, {
                        text: i18n.getMsg('orte.frommap'),
                        icon: 'resources/img/list-add.png',
                        action: 'frommap'
                    }, {
                        text: i18n.getMsg('orte.clone'),
                        icon: 'resources/img/list-add.png',
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
        var osg = this.down('ortstammdatengrid');
        var map = this.down('map');
        osg.setLoading(true);
        map.setLoading(true);
        this.ortstore = Ext.data.StoreManager.get('orte');
        this.ortstore.load();
        var ortId;
        if (this.messprogramm) {
            ortId = this.record.get('ort');
        } else {
            ortId = this.record.get('ortId');
        }
        if (ortId !== undefined && !this.ortstore.findRecord('id', ortId)) {
            var record = Ext.create('Lada.model.Ort');
            record.set('id', ortId);
            this.ortstore.add(record);
            Lada.model.Ort.load(ortId, {
                success: function(rec) {
                    record.beginEdit();
                    for (key in rec.getData()) {
                        record.set(key, rec.getData()[key]);
                    }
                    record.endEdit();
                    me.onStoreLoaded();
                }
            });
        } else {
            me.onStoreLoaded();
        }
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
    },

    /**
     * childs will be populated with store entries after all entries are loaded
     * from all sources
     */
    onStoreLoaded: function() {
        var map = this.down('map');
        var osg = this.down('ortstammdatengrid');
        osg.setStore(this.ortstore);
        map.addLocations(this.ortstore);
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
                    labelOutlineColor: 'white',
                    labelOutlineWidth: 3
                }),
                displayInLayerSwitcher: false,
                projection: new OpenLayers.Projection('EPSG:3857')
            });
        map.map.addLayer(map.selectedFeatureLayer);
        var ortId = this.record.get('ortId');
        if (ortId){
            var feat = map.featureLayer.getFeaturesByAttribute('id', ortId);
            var ortrecord = this.ortstore.findRecord('id', ortId);
            osg.selectOrt(map, feat);
            map.selectFeature(this.model, ortrecord);
            this.down('ortszuordnungform').setOrt(null,ortrecord);
        }
        osg.setLoading(false);
        map.setLoading(false);
    },

    onEsc: function() {
        var me = this;
        var search = me.down('textfield[name=search]');
        if (search.hasFocus) {
            return;
        }
        me.callParent(arguments);
     }
});

