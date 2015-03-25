/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Window to edit a Messung
 */
Ext.define('Lada.view.window.OrtCreate', {
    extend: 'Ext.window.Window',
    alias: 'widget.ortcreate',

    requires: [
        'Lada.view.panel.Map',
        'Lada.view.form.Ort',
        'Lada.view.form.Location'
    ],

    collapsible: true,
    maximizable: true,
    autoshow: true,
    layout: 'border',
    constrain: true,

    record: null,
    grid: null,

    initComponent: function() {
        this.title = 'Ort';
        this.buttons = [{
            text: 'Schließen',
            scope: this,
            handler: this.close
        }];
        this.width = 900;
        this.height = 515;
        this.bodyStyle = {background: '#fff'};

        this.items = [{
            region: 'west',
            border: 0,
            layout: 'vbox',
            items: [{
                xtype: 'ortform',
                margin: 5
            }, {
                xtype: 'locationform',
                margin: 5
            }]
        }, {
            xtype: 'fset',
            bodyStyle: {
                background: '#fff'
            },
            layout: 'border',
            name: 'mapfield',
            title: 'Karte',
            region: 'center',
            padding: '5, 5',
            margin: 5,
            items: [{
                xtype: 'map',
                region: 'center',
                layout: 'border',
                bodyStyle: {
                    background: '#fff'
                },
                name: 'map'
            }]
        }];
        this.callParent(arguments);
    },

    initData: function() {
        var ort = Ext.create('Lada.model.Ort', {
            probeId: this.record.get('id')
        });
        this.down('ortform').setRecord(ort);
    },

    setMessages: function(errors, warnings) {
        //todo this is a stub
    },

    clearMessages: function() {
        //todo this is a stub
    }
});
