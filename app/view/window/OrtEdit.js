/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to edit a Ort
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
                name: 'map',
                listeners: { //A listener which listens to the mappanels featureselected event
                    featureselected: this.selectedFeature
                }
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
                if (record.get('treeModified') < record.get('parentModified')) {
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

    /**
     * @private
     * Override to display and update the map view in the panel.
     */
    afterRender: function(){
        this.superclass.afterRender.apply(this, arguments);
        var map = this.down('map');
        if (this.record) {
            map.selectFeature(this.record.get('ort'));
        }
        else {
            map.map.zoomToMaxExtent();
        }
    },

    /**
     * This function is used by the MapPanel, when a Feature was selected
     */
    selectedFeature: function(context, args) {
    var feature = args[0];
        if (feature.attributes.id &&
            feature.attributes.id !== '') {
            var record = Ext.data.StoreManager.get('locations').getById(feature.attributes.id);
            context.up('window').down('locationform').setRecord(record);
            context.up('window').down('locationform').setReadOnly(true);
            context.up('window').down('ortform').down('combobox').setValue(record.id);
        }
        else {
            context.up('window').down('locationform').setRecord(this.locationRecord);
            context.up('window').down('locationform').setReadOnly(false);
        }
    },

    setMessages: function(errors, warnings) {
        //todo this is a stub
    },

    clearMessages: function() {
        //todo this is a stub
    }
});
