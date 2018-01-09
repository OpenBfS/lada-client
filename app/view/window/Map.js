/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * A window displaying a map with given geometry
 */
Ext.define('Lada.view.window.Map', {
    extend: 'Ext.window.Window',

    /**
     * A geometry to display
     */
    geom: null,

    height: '500px',

    width: '500px',

    map: null,

    initComponent: function() {
        this.map = Ext.create('Lada.view.panel.Map',{
            resizable: true,
            layout: 'fit',
            collapsible: false,
            externalOrteStore: true,
            height: '100%',
            width: '100%'
        });
        this.items = [this.map];

        this.callParent(arguments);

        if (this.geom) {
            this.map.onAfter('afterrender',this.drawGeoJson, this, {args: [this.geom]});
        }
    },

    drawGeoJson: function(json){
        this.map.drawGeoJson(json);
    }

});
