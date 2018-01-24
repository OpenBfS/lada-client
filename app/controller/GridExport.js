/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for invoking export windows. It controls all buttons with the
 * action 'gridexport', providing generic export options for every grid with
 * such a button in their toolbar
 */
Ext.define('Lada.controller.GridExport', {
    extend: 'Ext.app.Controller',
    requires: ['Lada.view.window.GridExport'],
    init: function() {
        this.control({
            'button[action=gridexport]': {
                click: this.openExportWindow
            }
        });
    },

    openExportWindow: function(button){
        if (button.isDisabled()){
            return;
        }
        // finding the grid to the button.
        var grid = button.up('grid');
        if (!grid){ // special cases, as stammdaten.probegrid (Jan 2018)
            grid = button.up('toolbar').up().down('grid');
        }
        if (!grid){
            return;
        }
        // TODO: if probelistgrid: hasProbe: true (maybe no real probeid?)
        Ext.create('Lada.view.window.GridExport', {
            grid: grid
        }).show();
    }
});