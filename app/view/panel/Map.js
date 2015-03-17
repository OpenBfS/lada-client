/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */
Ext.define('Lada.view.panel.Map', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.map',

    record: null,
    locationRecord: null,

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
     * Array of OpenLayers.Layer objects.
     */

    /**
     * @private
     * Initialize the map panel.
     */
    initComponent: function() {
        this.layers = [
            new OpenLayers.Layer.WMS(
                'Standard' + this.record.get('id'),
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
        this.map = new OpenLayers.Map('map_' + this.record.get('id'), {
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
        this.tbar = Ext.create('Lada.view.widget.MapToolbar');
        this.callParent(arguments);
    },

    initData: function() {
        var me = this;
        this.locationFeatures = [];
        this.locationStore = Ext.data.StoreManager.get('locations');
        for (var i = 0; i < this.locationStore.count(); i++) {
            this.locationFeatures.push(new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(
                    this.locationStore.getAt(i).get('longitude'),
                    this.locationStore.getAt(i).get('latitude')
                ),
                {
                    id: this.locationStore.getAt(i).get('id')
                }
            ));
        }
        this.featureLayer = new OpenLayers.Layer.Vector('vector' + this.record.get('id'), {
            styleMap: new OpenLayers.StyleMap({
                'default': new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                    externalGraphic: 'resources/lib/OpenLayers/img/marker-green.png',
                    graphicOpacity: 1,
                    pointRadius: 10
                }, OpenLayers.Feature.Vector.style['default'])),
                'select': new OpenLayers.Style({
                    externalGraphic: 'resources/lib/OpenLayers/img/marker-blue.png'
                })
            })
        });
        this.featureLayer.addFeatures(this.locationFeatures);
        this.map.addLayer(this.featureLayer);
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
    },

    selectedFeature: function(feature) {
        if (feature.attributes.id &&
            feature.attributes.id !== '') {
            var record = Ext.data.StoreManager.get('locations').getById(feature.attributes.id);
            this.up('window').down('locationform').setRecord(record);
            this.up('window').down('locationform').setReadOnly(true);
            this.up('window').down('ortform').down('combobox').setValue(record.id);
        }
        else {
            this.up('window').down('locationform').setRecord(this.locationRecord);
            this.up('window').down('locationform').setReadOnly(false);
        }
    },

    selectFeature: function(id) {
        var feature = this.featureLayer.getFeaturesByAttribute('id', id);
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
        console.log(arguments);
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
        if (this.record) {
            this.selectFeature(this.record.get('ort'));
        }
        else {
            this.map.zoomToScale(this.mapOptions.scales[0]);
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
    }
});
