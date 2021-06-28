/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for the ProbeList result grid.
 */
Ext.define('Lada.controller.grid.ProbeList', {
    extend: 'Ext.app.Controller',
    requires: [
        'Lada.view.window.FileUpload',
        'Lada.view.window.ProbeEdit'
    ],

    /**
     * Initialize the Controller with listeners
     */
    init: function() {
        this.control({
            'dynamicgrid toolbar button[action=addProbe]': {
                click: this.addProbeItem
            },
            'dynamicgrid toolbar button[action=importprobe]': {
                click: this.uploadFile
            }
        });
        this.callParent(arguments);
    },

    /**
     * This function opens a new window to create a Probe
     * {@link Lada.view.window.ProbeCreate}
     */
    addProbeItem: function() {
        var win = Ext.create('Lada.view.window.ProbeCreate');
        win.initData();
        win.show();
        win.setPosition(30);
    },

    /**
     * This function opens a {@link Lada.view.window.FileUpload}
     * window to upload a LAF-File
     */
    uploadFile: function() {
        var i18n = Lada.getApplication().bundle;
        var win = Ext.create('Lada.view.window.FileUpload', {
            title: i18n.getMsg('title.dataimport'),
            modal: true
        });

        win.show();
    }
});
