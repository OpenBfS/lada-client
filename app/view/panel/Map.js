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

    /**
     * @cfg
     * OpenLayers map options.
     */
    mapOptions: {
        maxExtent: new OpenLayers.Bounds(2.9, 42.95, 18.1, 60.6),
        //scales: [1600000, 600000, 300000, 100000, 30000, 15000, 7000, 3500, 1200, 500],
        units: 'dd',
        projection: new OpenLayers.Projection('EPSG:4326')
    },

    /**
     * Array of OpenLayers.Layer objects.
     */
    layers: [
        new OpenLayers.Layer.WMS(
            'Standard',
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
    ],

    /**
     * @private
     * Initialize the map panel.
     */
    initComponent: function() {
        this.map = new OpenLayers.Map('map', {
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
        this.callParent();
    },

    /**
     * @private
     * Override to display and update the map view in the panel.
     */
    afterRender: function() {
        this.superclass.afterRender.apply(this, arguments);
        this.map.render(this.body.dom);
        this.map.zoomToExtent(this.mapOptions.Extent);
        this.map.addControl(new OpenLayers.Control.Navigation());
        this.map.addControl(new OpenLayers.Control.PanZoomBar());
        this.map.addControl(new OpenLayers.Control.ScaleLine());
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
