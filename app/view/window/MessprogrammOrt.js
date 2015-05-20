/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to add a Ort to a Messprogramm
 */
Ext.define('Lada.view.window.MessprogrammOrt', {
    extend: 'Ext.window.Window',
    alias: 'widget.messprogrammort',

    requires: [
        'Lada.model.Ort',
        'Lada.view.panel.Map',
        'Lada.view.widget.Location',
        'Lada.view.form.Location'
    ],

    collapsible: true,
    maximizable: true,
    autoshow: true,
    layout: 'border',
    constrain: true,

    parentWindow: null,
    record: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        this.title = i18n.getMsg('messprogrammort.window.title');
        this.buttons = [{
            text: i18n.getMsg('apply'),
            scope: this,
            handler: this.apply
        }, {
            text: i18n.getMsg('cancel'),
            scope: this,
            handler: function() {
                this.close()
                this.parentWindow.down('messprogrammform')
                    .ortWindow = null;
           }
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
                xtype: 'fieldset',
                title: i18n.getMsg('ortId'),
                margin: 5,
                items: [{
                    border: 0,
                    margin: '0, 0, 10, 0',
                    items: [{
                        xtype: 'location',
                        fieldLabel: i18n.getMsg('ortId'),
                        labelWidth: 80,
                        width: 280,
                        forceSelection: true,
                        name: 'ortId',
                        listeners: {//Update MapPanel etc...
                            select: this.updateDetails
                        }
                    }]
                }]
            }, {
                xtype: 'locationform',
                margin: 5,
                recordId: this.record.get('ortId')
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
                record: this.record.get('ortId') ? this.record : null,
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
        //Only do this if an OrtId exists...
        var ortId = this.record.get('ortId');

        if (ortId) {
            Ext.ClassManager.get('Lada.model.Ort').load(ortId, {
                failure: function(record, action) {
                    // TODO
                },
                success: function(record, response) {
                    var me = this;
                    if (record.get('treeModified') < record.get('parentModified')) {
                        Ext.Msg.show({
                            title: 'Messprogramm nicht aktuell!',
                            msg: 'Das zugehörige Messprogramm wurde verändert.\nMöchten Sie zu dem Messprogramm zurückkehren und neu laden?\nOhne das erneute Laden des Messprogrammes wird das Speichern des Ortes nicht möglich sein.',
                            buttons: Ext.Msg.OKCANCEL,
                            icon: Ext.Msg.WARNING,
                            closable: false,
                            fn: function(button) {
                                if (button === 'ok') {
                                    me.close();
                                    me.parentWindow.initData();
                                    me.parentWindow.down('messprogrammform')
                                        .ortWindow = null;
                                }
                                else {
                                    me.record.set('treeModified', me.probe.get('treeModified'));
                                }
                            }
                        });
                    }
                    this.record = record;
                },
                scope: this
            });
        }
    },

    /**
     * @private
     * Override to display and update the map view in the panel.
     */
    afterRender: function(){
        this.superclass.afterRender.apply(this, arguments);
        var map = this.down('map');
        if (this.record.get('ortId')) {
            map.selectFeature(this.record.get('ortId'));
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
            context.up('window').down('location').down('combobox').setValue(record.id);
        }
        else {
            context.up('window').down('locationform').setRecord(this.locationRecord);
            context.up('window').down('locationform').setReadOnly(false);
        }
    },

    /**
     *  updateDetails is used when a value is selected within the location combobox
     *  When this function is called, the map element within the window
     *  which is embedding this form is updated.
     *
     *  Mostly the same as in Lada.controlle.form.Ort
     */
    updateDetails: function(combobox, record) {
        var win = combobox.up('window');
        var details = win.down('locationform');
        //var id = record[0].get('id'); // We are interested in the cbox...
        var id = combobox.getValue();

        if (details) {
            var toLoad = Ext.data.StoreManager.get('locations').getById(id);
            win.down('locationform').setRecord(toLoad);
            win.down('map').selectFeature(id);
        }
    },

    /**
     * Write the selected ortId into the record, and update the MessprogrammWindow.
     */
    apply: function(button) {
        var win = button.up('window');
        var ortId = win.down('location').down('combobox').value;
        if (this.parentWindow) {
            this.parentWindow.down('messprogrammform').down('location')
                .down('combobox').setValue(ortId);
        }

        this.parentWindow.down('messprogrammform')
                .ortWindow = null;
        this.close();
    },
    setMessages: function(errors, warnings) {
        //todo this is a stub
    },

    clearMessages: function() {
        //todo this is a stub
    }
});

