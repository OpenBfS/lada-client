/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a controller for a Map.
 * Maps are used in the Ortsangaben of a Probe.
 */
Ext.define('Lada.controller.Map', {
    extend: 'Ext.app.Controller',

    requires: [
    ],

    /**
     * Initialize the Controller
     * It has only one listener.
     */
    init: function() {
        this.control({
            'maptoolbar button[action=add]': {
                click: this.addLocation
            }
        });
        this.callParent(arguments);
    },

    /**
     * addLocation is a function which can be
     * used to add an location to create a new Location
     * with the help of the map.
     * The function uses {@link Lada.view.panel.Map#activateDraw}
     */
    addLocation: function(button) {
        var mapPanel = button.up('map');
        var details = button.up('window').down('locationform');
        var newLocation = Ext.create('Lada.model.Location');
        details.setRecord(newLocation);
        details.setReadOnly(false);

        mapPanel.activateDraw(newLocation);
    }
});
