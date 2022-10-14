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
        extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
        minZoom: 3,
        maxZoom: 18,
        projection: 'EPSG:3857'
    },

    /**
     * @private
     * Initialize the map panel.
     */
    initComponent: function() {
        this.on({
            selectfeature: {
                fn: this.selectFeature,
                scope: this,
                options: {
                    args: [true]
                }
            },
            selectmultiplefeatures: {
                fn: this.selectMultipleFeatures,
                scope: this,
                options: {
                    args: [true]
                }
            },
            deselectfeature: {
                fn: this.deselectFeature,
                scope: this
            }
        });
        this.callParent(arguments);
    },

    /**
     * Select multiple features by records
     * @param {*} records Records
     */
    selectMultipleFeatures: function(records) {
        var me = this;
        Ext.Array.each(records, function(record) {
            me.selectFeature(null, record, false);
        });
        this.zoomToSelectedFeatures();
    },

    /**
     * Select a feature by record (Lada.model.Ort | Lada.model.GenericResults)
     * @param record Record
     * @param zoom If true, the map will be zoomed to show all selected
     *             features
     */
    selectFeature: function(model, record, zoom) {
        if (!record || !record.get('id') || record.get('id') === '') {
            return;
        }
        var features = this.featureLayer.getSource();
        var feature = features.getFeatureById(record.get('id'));
        if (!feature) {
            return;
        }
        if (!this.multiSelect) {
            this.featureLayer.getSource().addFeatures(
                this.selectedFeatureLayer.getSource().getFeatures());
            this.selectedFeatureLayer.getSource().clear();
        }
        var currentFeatures = this.multiSelect ?
            this.selectedFeatureLayer.getSource().getFeatures() : [];
        this.featureLayer.getSource().removeFeature(feature);
        this.selectedFeatureLayer.getSource().addFeature(feature);
        currentFeatures.push(feature);
        this.fireEvent('featureselected', this, currentFeatures);
        if (zoom === true) {
            this.zoomToSelectedFeatures();
        }
    },

    /**
     * Zoom to all selected features on the map.
     */
    zoomToSelectedFeatures: function() {
        var zoomFeats = this.selectedFeatureLayer.getSource().getFeatures();
        if (zoomFeats.length > 1) {
            var zf_geoms = [];
            for (var i = 0; i < zoomFeats.length;i++) {
                zf_geoms.push(zoomFeats[i].getGeometry().getCoordinates());
            }
            var ext = ol.extent.boundingExtent(zf_geoms);
            this.map.getView().fit(ext, {
                duration: 1000,
                constrainResolution: true,
                maxZoom: 12
            });
        } else if (zoomFeats.length === 1) {
            this.map.getView().animate(
                { center: zoomFeats[0].getGeometry().getCoordinates(),
                    duration: 1000},
                { zoom: 10,
                    duration: 1000});
        }
    },

    /**
     * Deselects the feature of a given record on the map
     * @param record Record
     */
    deselectFeature: function(record) {
        if (!record || !record.get('id') || record.get('id') === '') {
            return;
        }
        var features = this.selectedFeatureLayer.getSource();
        var feature = features.getFeatureById(record.get('id'));
        if (!feature) {
            return;
        }
        this.selectedFeatureLayer.getSource().removeFeature(feature);
        this.featureLayer.getSource().addFeature(feature);
        //Clear selection interaction feature list
        if (this.selectControl.getFeatures()) {
            this.selectControl.getFeatures().clear();
        }
    },

    activateDraw: function() {
        this.temporaryLayer = new ol.layer.Vector({
            title: 'neuer Ort',
            source: new ol.source.Vector({
                features: []
            }),
            style: this.newFeatureStyle
        });
        this.map.addLayer(this.temporaryLayer);
        if (!this.drawinteraction) {
            this.drawInteraction = new ol.interaction.Draw({
                source: this.temporaryLayer.getSource(),
                type: 'Point'
            });
        }
        this.map.addInteraction(this.drawInteraction);
        var me = this;
        this.drawInteraction.on('drawend', me.featureAdded);
    },

    featureAdded: function(event) {
        //Forward event
        var me = Ext.ComponentQuery.query('map')[0];
        me.fireEvent('featureadded', event);
        me.map.removeInteraction(me.drawInteraction);
        event.feature.set('bez', 'neuer Ort');
        var clone = event.feature.clone();
        clone.getGeometry().transform('EPSG:3857', 'EPSG:4326');
        var parent = me.up('ortszuordnungwindow');

        //Use probe or messprogramm to get the mstId
        if (parent && (parent.probe || parent.messprogramm)) {
            var parentRecord = parent.probe ?
                parent.probe :
                parent.messprogramm;
            var mstId = parentRecord.get('mstId');
            var mst = Ext.data.StoreManager.get('messstellen');
            var ndx = mst.findExact('id', mstId);
            var nId = mst.getAt(ndx).get('netzbetreiberId');
            var koord_x = Math.round(
                clone.getGeometry().getCoordinates()[0] * 100000)
                / 100000;
            var koord_y = Math.round(
                clone.getGeometry().getCoordinates()[1] * 100000)
                / 100000;
            var ortWin = Ext.create('Lada.view.window.Ort', {
                record: Ext.create('Lada.model.Ort', {
                    netzbetreiberId: nId,
                    koordXExtern: koord_x.toString(),
                    koordYExtern: koord_y.toString(),
                    kdaId: 4,
                    ortTyp: 1,
                    plausibleReferenceCount: 0,
                    referenceCountMp: 0,
                    referenceCount: 0
                }),
                parentWindow: parent,
                setOzOnComplete: true
            });
            ortWin.show();
            parent.childWindows.push(ortWin);
            me.map.removeLayer(me.temporaryLayer);
        }
    },

    addLocations: function(locationStore) {
        if (!this.featureLayer) {
            this.initFeatureLayer();
        }
        this.featureLayer.getSource().clear();

        // Iterate the Store and create features from it
        for (var i = 0; i < locationStore.count(); i++) {
            var geom = new ol.geom.Point([
                locationStore.getAt(i).get('longitude'),
                locationStore.getAt(i).get('latitude')], 'XY');
            geom.transform('EPSG:4326', 'EPSG:3857');
            var id = locationStore.getAt(i).get('id');
            var feature = new ol.Feature({
                geometry: geom,
                id: id,
                bez: locationStore.getAt(i).get('ortId')
            });
            feature.setId(id);
            this.featureLayer.getSource().addFeature(feature);
        }
    },

    /**
     * Draws the content of a given GeoJSON Object.
     */
    drawGeoJson: function(json) {
        if (!json) {
            return;
        }
        if (!this.featureLayer) {
            this.initFeatureLayer();
        }
        var format = new ol.format.GeoJSON({
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        var features = format.readFeatures(json);
        //Set feature id from properties
        Ext.Array.each(features, function(feat) {
            feat.setId(feat.get('id'));
        });
        var vectorSource = new ol.source.Vector({
            features: features
        });
        var extent = vectorSource.getExtent();
        //Clear the map of selected features
        this.selectedFeatureLayer.getSource().clear();
        this.selectControl.getFeatures().clear();
        this.featureLayer.setSource(vectorSource);
        this.map.getView().fit(extent, {maxZoom: 12});
    },

    /**
     * @private
     * Override to display and update the map view in the panel.
     */
    afterRender: function() {
        if (Lada.appContext && Lada.appContext.merge.urls['backgroundMap']) {
            var backgroundMapUrl = Lada.appContext.merge.urls['backgroundMap'];
        }
        var backgroundMap = new ol.layer.Tile({
            source: new ol.source.XYZ({
                // eslint-disable-next-line max-len
                crossOrigin: null,
                url: backgroundMapUrl
            }),
            maxZoom: 18
        });
        var target = null;
        var parent = this.up('ortszuordnungwindow');
        if (parent) {
            target = this.getTargetEl() ? this.getTargetEl() : this.element;
        } else {
            target = this.getTargetEl();
        }
        if (target.dom.childNodes[0]) {
            this.mapOptions.target = target.dom.childNodes[0].childNodes[0];
        } else {
            this.mapOptions.target = target.dom;
        }
        this.mapOptions.view = new ol.View({
            center: [1160000, 6694000],
            zoom: 6,
            minZoom: 2,
            maxZoom: 17
        });
        this.mapOptions.layers = [backgroundMap];
        this.mapOptions.controls = [new ol.control.Zoom(),
            new ol.control.ZoomSlider(),
            new ol.control.ScaleLine()];

        this.map = new ol.Map(this.mapOptions);

        this.bodyStyle = {background: '#fff'};

        // style definitions for markers
        var stroke = new ol.style.Stroke({color: '#FFF', width: 1});

        this.standardStyle = function(feature) {
            return new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'resources/img/marker-green.png'
                }),
                text: new ol.style.Text({
                    text: feature.get('bez') || '...',
                    font: 'bold 12px Arial',
                    offsetX: 38,
                    offsetY: 5,
                    fill: new ol.style.Fill({
                        color: '#009900'
                    }),
                    stroke: stroke
                })
            });
        };
        this.selectStyle = function(feature) {
            return new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'resources/img/marker-blue.png'
                }),
                text: new ol.style.Text({
                    text: feature.get('bez') || '...',
                    font: 'bold 12px Arial',
                    offsetX: 38,
                    offsetY: 10,
                    fill: new ol.style.Fill({
                        color: '#000099'
                    }),
                    stroke: stroke
                })
            });
        };
        this.newFeatureStyle = function() {
            return new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'resources/img/marker-blue.png',
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    anchor: [0.5, 1]
                }),
                text: new ol.style.Text({
                    text: 'neu ...',
                    font: '12px Arial',
                    offsetX: 38,
                    offsetY: 0,
                    fill: new ol.style.Fill({
                        color: '#000099'
                    }),
                    stroke: stroke
                })
            });
        };
        this.superclass.afterRender.apply(this, arguments);
    },

    /**
     * Forward OpenlayersEvent to EXT
     */
    selectedFeature: function(selection) {
        var feature = selection.selected;
        if (feature) {
            var me = Ext.ComponentQuery.query('map')[0];
            me.fireEvent('featureselected', me, feature, arguments, true);
        }
    },

    /**
     * @private
     * Override to resize the map and reposition the logo.
     */
    onResize: function() {
        this.superclass.onResize.apply(this, arguments);
        this.map.updateSize();
    },

    addPreviousOrt: function(record) {
        if (!this.previousOrtLayer) {
            this.previousOrtLayer = new ol.layer.Vector({
                title: 'oldOrt',
                source: new ol.source.Vector({
                    features: []
                }),
                style: this.standardStyle,
                visible: true
            });
            this.map.addLayer(this.previousOrtLayer);
        }
        this.previousOrtLayer.getSource().clear();
        if (record) {
            var geom = new ol.geom.Point([record.get('longitude'),
                record.get('latitude')],
            'XY');
            geom.transform('EPSG:4326', 'EPSG:3857');
            var feature = new ol.Feature({
                geometry: geom,
                id: record.get('id'),
                bez: record.get('ortId')
            });
            this.previousOrtLayer.getSource().addFeature(feature);
            this.map.getView().setCenter([geom.getCoordinates()[0],
                geom.getCoordinates()[1]]);
            this.map.getView().setZoom(12);
        }
    },

    /**
     * initializes a layer to display Orte records, and a selection control
     * to interact with grids and forms.
     */
    initFeatureLayer: function() {
        var me = this;
        this.featureLayer = new ol.layer.Vector({
            title: 'allOrte',
            source: new ol.source.Vector({
                features: []

            }),
            style: this.standardStyle,
            visible: true
        });
        this.map.addLayer(this.featureLayer);
        this.selectControl = new ol.interaction.Select({
            condition: ol.events.condition.click,
            style: me.selectStyle,
            multi: false,
            layers: [me.featureLayer],
            hitTolerance: 20
        });
        this.selectControl.on('select', me.selectedFeature);
        this.map.addInteraction(this.selectControl);

        this.selectedFeatureLayer = new ol.layer.Vector({
            title: 'gewählter Ort',
            source: new ol.source.Vector({
                features: []
            }),
            style: this.selectStyle
        });
        this.map.addLayer(this.selectedFeatureLayer);
    }

});
