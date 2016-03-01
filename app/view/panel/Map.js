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
     */
    mapOptions: {
        maxExtent: new OpenLayers.Bounds(2.9, 42.95, 18.1, 60.6),
        scales: [5000000, 3000000, 2000000, 1000000, 500000, 250000, 100000, 25000],
        units: 'dd',
        projection: new OpenLayers.Projection('EPSG:4326')
    },


    /**
     * @private
     * Initialize the map panel.
     */
    initComponent: function() {
        var id = Ext.id();
        this.layers = [
            new OpenLayers.Layer.WMS(
                'Standard' + id,
                'http://osm.intevation.de/cgi-bin/standard.fcgi?',
                {
                    layers: 'OSM-WMS-Dienst',
                    format: 'image/png',
                    BGCOLOR: '0xFFFFFF'
                }, {
                    isBaseLayer: true,
                    buffer: 0,
                    visibility: true
                })
        ];
        this.map = new OpenLayers.Map('map_' + id, {
            controls: [],
            tileManager: null,
            zoomMethod: null
        });
        this.map.setOptions(this.mapOptions);
        this.map.addLayers(this.layers);
        var keyControl = new OpenLayers.Control.KeyboardDefaults();
        this.map.addControl(keyControl);
        keyControl.activate();
        this.bodyStyle = {background: '#fff'};
        this.initData();
        this.addEvents('featureselected');
        this.callParent(arguments);
    },

    /**
     * Initialise the Data and Create an
     * Array of OpenLayers.Layer objects.
     */
    initData: function() {
        var me = this;

        if (!this.externalOrteStore) {
            this.locationStore = Ext.data.StoreManager.get('orte');
            this.addLocations(locationStore);
        }
    },

    selectFeature: function(model, record) {
        var feature = this.featureLayer.getFeaturesByAttribute('id', record.get('id'));
        this.map.setCenter(
            new OpenLayers.LonLat(feature[0].geometry.x, feature[0].geometry.y));
        this.map.zoomToScale(this.mapOptions.scales[5]);
        this.selectControl.unselectAll();
        this.selectControl.select(feature[0]);
    },

    activateDraw: function(record) {
        this.locationRecord = record;
        if (!this.drawPoint) {
            this.drawPoint = new OpenLayers.Control.DrawFeature(this.featureLayer,
                OpenLayers.Handler.Point);
            this.map.addControl(this.drawPoint);
        }
        this.drawPoint.activate();
        this.drawPoint.events.register('featureadded', this, this.featureAdded);
    },

    featureAdded: function(features) {
        this.locationRecord.set('latitude', features.feature.geometry.y);
        this.locationRecord.set('longitude', features.feature.geometry.x);
        this.drawPoint.deactivate();
        this.selectControl.unselectAll();
        this.selectControl.select(features.feature);
    },

    addLocations: function(locationStore) {
        var me = this;
        locationFeatures = [];

        // Iterate the Store and create features from it
        for (var i = 0; i < locationStore.count(); i++) {
            locationFeatures.push(new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(
                    locationStore.getAt(i).get('longitude'),
                    locationStore.getAt(i).get('latitude')
                ),
                {
                    id: locationStore.getAt(i).get('id'),
                    bez: locationStore.getAt(i).get('ortId')
                }
            ));
        }

        // Create a new Feature Layer and add it to the map
        if (!this.featureLayer) {
            this.featureLayer = new OpenLayers.Layer.Vector('vector_' + this.map.name, {
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
                        pointRadius: 15,
                        label: '${bez}',
                        labelAlign: 'rt',
                        fontColor: 'blue',
                        fontWeight: 'bold'
                    })
                })
            });
            this.selectControl = new OpenLayers.Control.SelectFeature(this.featureLayer, {
                clickout: false,
                toggle: false,
                multiple: false,
                hover: false,
                onSelect: me.selectedFeature,
                scope: me
            });
            this.map.addControl(this.selectControl);
            this.selectControl.activate();
        }
        this.featureLayer.removeAllFeatures();
        this.featureLayer.addFeatures(locationFeatures);
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
    selectedFeature: function() {
        this.fireEvent('featureselected', this, arguments);
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
    }
});
