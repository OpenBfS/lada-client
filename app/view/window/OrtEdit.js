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
    constrain: true,

    parentWindow: null,
    probe: null,
    record: null,
    grid: null,

    initComponent: function() {
        if (this.record === null) {
            Ext.Msg.alert('Kein valider Ort ausgewählt!');
            this.callParent(arguments);
            return;
        }
        if (this.probe === null) {
            Ext.Msg.alert('Zu dem Ort existiert keine Probe!');
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

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            }
        });

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
        Ext.ClassManager.get('Lada.model.Ort').load(this.record.get('id'), {
            failure: function(record, action) {
                // TODO
            },
            success: function(record, response) {
                var me = this;
                if (this.probe.get('treeModified') < record.get('treeModified')) {
                    Ext.Msg.show({
                        title: 'Probe nicht aktuell!',
                        msg: 'Die zugehörige Probe wurde verändert.\nMöchten Sie zu der Probe zurückkehren und neu laden?\nOhne das erneute Laden der Probe wird das Speichern des Ortes nicht möglich sein.',
                        buttons: Ext.Msg.OKCANCEL,
                        icon: Ext.Msg.WARNING,
                        closable: false,
                        fn: function(button) {
                            if (button === 'ok') {
                                me.close();
                                me.parentWindow.initData();
                            }
                            else {
                                me.record.set('treeModified', me.probe.get('treeModified'));
                            }
                        }
                    });
                }
                this.down('ortform').setRecord(record);
                this.record = record;
            },
            scope: this
        });
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
