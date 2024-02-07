/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to show a confirmation dialog to delete a Probe and a progress bar
 * after confirmation
 */
Ext.define('Lada.view.window.DeleteMultipleItems', {
    extend: 'Ext.window.Window',
    alias: 'widget.deleteMultipleItems',

    requires: [
        'Lada.controller.DeleteMultipleItems'
    ],

    controller: 'deletemultipleitems',

    collapsible: true,
    maximizable: true,
    autoShow: true,
    layout: 'vbox',

    parentGrid: null,
    selection: null,

    listeners: {
        show: 'handleDelete'
    },

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            xtype: 'panel',
            height: 300,
            width: 500,
            autoScroll: true,
            overflow: 'auto',
            html: '',
            margin: '5, 5, 5, 5'
        }, {
            xtype: 'progressbar',
            text: i18n.getMsg('progress'),
            height: 25,
            width: 340,
            hidden: false,
            margin: '5, 5, 5, 5'
        }];
        this.callParent(arguments);
    }
});

