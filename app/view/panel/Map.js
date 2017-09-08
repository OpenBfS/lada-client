/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */


/**
 * This is the MapPanel.
 * It uses OpenLayers to display the map
 */
Ext.define('Lada.view.panel.Map', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.map',
    name: 'map',

    record: null,
    locationRecord: null,
    externalOrteStore: false,
    /*
     * if externalOrteStore is true, the mappanel will not load the orte
     * store on it's own; it expects an already loaded store instead
     */

    /**
     * @cfg
     * OpenLayers map options.
     * Please note that TMS zoom levels are roughly as this:
     * 7 = 1:4000000 14 = 1:35000
     */
    mapOptions: {
        maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
        numZoomLevels: 15,
        projection: 'EPSG:3857',
        displayProjection: new OpenLayers.Projection('EPSG:4326')
    },


    /**
     * @private
     * Initialize the map panel.
     */
    initComponent: function() {
        var id = Ext.id();
        this.layers = [
            new OpenLayers.Layer.TMS(
                'Standard' + id,
                'http://www.imis.bfs.de/mapcache/tms/',
                {
                    layername: 'osm_bfs_google@GoogleMapsCompatible',
                    isBaseLayer: true,
                    displayInLayerSwitcher: false,
                    type: 'png',
                    visibility: true,
                    projection: 'EPSG:3857'
                })
        ];
        this.map = new OpenLayers.Map('map_' + id, {
            controls: [],
            tileManager: null,
            zoomMethod: null,
            // initializing with view centered on germany
            center: new OpenLayers.LonLat(1160000,6694000)
        });
        this.map.setOptions(this.mapOptions);
        this.map.addLayers(this.layers);
        this.map.zoomTo(6);
        var keyControl = new OpenLayers.Control.KeyboardDefaults();
        this.map.addControl(keyControl);
        keyControl.activate();
        this.bodyStyle = {background: '#fff'};
        this.initData();
        this.callParent(arguments);
    },

    /**
     * Initialise the Data.
     * TODO currently only stub remaining after migration
     */
    initData: function() {
    },

    /**
     * Select a feature by record (a Lada.model.Ort) and zoom to this Ort
     */
    selectFeature: function(model, record) {
        if (!record || !record.get('id') || record.get('id') === '') {
            return;
        }
        var feature = this.featureLayer.getFeaturesByAttribute('id', record.get('id'))[0];
        if (!feature) {
            return;
        }
        this.map.setCenter(
            new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y));
        this.map.zoomTo(12);
        if (this.selectedFeatureLayer) {
            this.selectControl.unselectAll();
            var prev = this.selectedFeatureLayer.features[0];
            if (prev){
                this.featureLayer.addFeatures([prev.clone()]);
            }
            this.selectedFeatureLayer.removeAllFeatures();
            this.selectedFeatureLayer.addFeatures(feature.clone());
            this.featureLayer.removeFeatures([feature]);
            this.selectedFeatureLayer.refresh({force: true});
            this.featureLayer.refresh({force: true});
        } else {
            this.selectControl.unselectAll();
            this.selectControl.select(feature);
        }
    },

    activateDraw: function() {
        if (!this.drawPoint) {
            this.drawPoint = new OpenLayers.Control.DrawFeature(this.featureLayer,
                OpenLayers.Handler.Point);
            this.map.addControl(this.drawPoint);
            this.drawPoint.events.register('featureadded', this, this.featureAdded);
        }
        this.drawPoint.activate();
    },

    featureAdded: function(features) {
        features.feature.geometry.transform(new OpenLayers.Projection('EPSG:3857'),
                                            new OpenLayers.Projection('EPSG:4326'));
        var parent = this.up('ortszuordnungwindow') || this.up('ortpanel');
        var nId = ''
        if (parent.probe) {
            var mstId = parent.probe.get('mstId');
            var mst = Ext.data.StoreManager.get('messstellen');
            var ndx = mst.findExact('id', mstId);
            nId = mst.getAt(ndx).get('netzbetreiberId');
        }
        var koord_x = Math.round(features.feature.geometry.x * 100000)/100000;
        var koord_y = Math.round(features.feature.geometry.y * 100000)/100000;
        Ext.create('Lada.view.window.Ort', {
            record: Ext.create('Lada.model.Ort',{
                netzbetreiberId: nId,
                koordXExtern: koord_x,
                koordYExtern: koord_y,
                kdaId : 4,
                ortTyp: 1
            }),
            parentWindow: parent
        }).show();
        this.drawPoint.deactivate();
    },

    addLocations: function(locationStore) {
        var me = this;
        locationFeatures = [];

        // Iterate the Store and create features from it
        for (var i = 0; i < locationStore.count(); i++) {
            var feature = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(
                    locationStore.getAt(i).get('longitude'),
                    locationStore.getAt(i).get('latitude')
                ),
                {
                    id: locationStore.getAt(i).get('id'),
                    bez: locationStore.getAt(i).get('ortId')
                }
            );
            feature.geometry.transform(new OpenLayers.Projection('EPSG:4326'),
                                       new OpenLayers.Projection('EPSG:3857'));
            locationFeatures.push(feature);
        }

        // Create a new Feature Layer and add it to the map
        if (!this.featureLayer) {
            this.initFeatureLayer();
        }
        this.featureLayer.removeAllFeatures();
        this.featureLayer.addFeatures(locationFeatures);
        if (this.selectedFeatureLayer
            && this.selectedFeatureLayer.features
            && this.selectedFeatureLayer.features.length > 0){
            var oldSelection = this.selectedFeatureLayer.features[0].data.id;
            var feature = this.featureLayer.getFeaturesByAttribute('id', oldSelection)[0];
            if (feature){
                this.selectControl.unselectAll();
                this.selectedFeatureLayer.removeAllFeatures();
                this.selectedFeatureLayer.addFeatures(feature.clone());
                this.featureLayer.removeFeatures([feature]);
                this.selectedFeatureLayer.refresh({force: true});
                this.featureLayer.refresh({force: true});
            }
        }
        this.map.addLayer(this.featureLayer);
    },

    /**
     * @private
     * Override to display and update the map view in the panel.
     */
    afterRender: function() {
        this.superclass.afterRender.apply(this, arguments);

        this.map.render(this.body.dom);
        this.map.addControl(new OpenLayers.Control.Navigation());
        this.map.addControl(new OpenLayers.Control.PanZoomBar());
        this.map.addControl(new OpenLayers.Control.ScaleLine());
    },

    /**
     * Forward OpenlayersEvent to EXT
     */
    selectedFeature: function(feature) {
        this.fireEvent('featureselected', this, arguments);
        this.featureLayer.refresh({force: true});
        if (this.selectedFeatureLayer) {
            this.selectedFeatureLayer.refresh({force: true});

        }
    },

    beforeDestroy: function() {
        if (this.map) {
            this.map.destroy();
        }
        delete this.map;
        this.callParent(arguments);
    },

    /**
     * @private
     * Override to resize the map and reposition the logo.
     */
    onResize: function() {
        this.superclass.onResize.apply(this, arguments);
        this.map.updateSize();
    },

    addPreviousOrt: function (record){
        if (!this.previousOrtLayer){
            this.previousOrtLayer=  new OpenLayers.Layer.Vector(
                'bisheriger Ort', {
                    styleMap: new OpenLayers.StyleMap({
                        externalGraphic: 'resources/lib/OpenLayers/img/marker-green.png',
                        pointRadius: 12,
                        label: '${bez}',
                        labelAlign: 'rt',
                        fontColor: 'green',
                        fontWeight: 'bold',
                        labelOutlineColor: 'white',
                        labelOutlineWidth: 3
                    }),
                    displayInLayerSwitcher: false,
                    projection: new OpenLayers.Projection('EPSG:3857')
                });
            this.map.addLayer(this.previousOrtLayer);
        }
        this.previousOrtLayer.removeAllFeatures();
        if (record) {
             var feature = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(
                    record.get('longitude'), record.get('latitude')),
                {
                    id: record.get('id'),
                    bez: record.get('ortId')
                }
            );
            feature.geometry.transform(new OpenLayers.Projection('EPSG:4326'),
                                       new OpenLayers.Projection('EPSG:3857'));
            this.previousOrtLayer.addFeatures([feature]);
            this.map.setCenter(
                new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y));
            this.map.zoomTo(12);
        }
    },

    /**
     * initializes a layer to display Orte records, and a selection control to interact
     * with grids and forms.
     */
    initFeatureLayer: function() {
        var me = this;
        this.featureLayer = new OpenLayers.Layer.Vector( 'alle Orte', {
            styleMap: new OpenLayers.StyleMap({
                'default': new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                    externalGraphic: 'resources/lib/OpenLayers/img/marker-green.png',
                    graphicOpacity: 1,
                    pointRadius: 10,
                    label: '${bez}',
                    labelAlign: 'rt',
                    fontColor: 'green',
                    fontWeight: 'bold'
                }, OpenLayers.Feature.Vector.style['default'])),
                'select': new OpenLayers.Style({
                    externalGraphic: 'resources/lib/OpenLayers/img/marker-blue.png',
                    pointRadius: 12,
                    label: '${bez}',
                    labelAlign: 'rt',
                    fontColor: 'blue',
                    fontWeight: 'bold'
                })
            }),
            projection: new OpenLayers.Projection('EPSG:3857')
        });
        this.selectControl = new OpenLayers.Control.SelectFeature(this.featureLayer, {
            clickout: false,
            toggle: false,
            multiple: false,
            hover: false,
            onSelect: me.selectedFeature,
            layers: [me.featureLayer],
            scope: me
        });
        this.map.addControl(this.selectControl);
        this.selectControl.activate();
    }
});
