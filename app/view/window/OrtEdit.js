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
Ext.define('Lada.view.window.OrtEdit', {
    extend: 'Ext.window.Window',
    alias: 'widget.ortedit',

    requires: [
        'Lada.view.panel.Map',
        'Lada.view.form.Ort',
        'Lada.view.form.Location'
    ],

    collapsible: true,
    maximizable: true,
    autoshow: true,
    layout: 'border',

    record: null,

    initComponent: function() {
        if (this.record === null) {
            Ext.Msg.alert('Kein valider Ort ausgewählt!');
            this.callParent(arguments);
            return;
        }
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
                margin: 5,
                recordId: this.record.get('id')
            }, {
                xtype: 'locationform',
                margin: 5,
                recordId: this.record.get('id')
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
                record: this.record,
                bodyStyle: {
                    background: '#fff'
                },
                name: 'map'
            }]
        }];
        this.callParent(arguments);
    },

    initData: function() {
        this.down('ortform').setRecord(this.record);
        Ext.ClassManager.get('Lada.model.Location').load(this.record.get('ort'), {
            failure: function(record, action) {
                // TODO
            },
            success: function(record, response) {
                this.down('locationform').setRecord(record);
                this.down('locationform').setReadOnly(true);
            },
            scope: this
        });
    },

    setMessages: function(errors, warnings) {
        //todo this is a stub
    },

    clearMessages: function() {
        //todo this is a stub
    }
});
