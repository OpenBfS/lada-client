Ext.define('Lada.view.panel.Ort', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.ortpanel',

    requires: [
        'Lada.view.panel.Map',
        'Lada.view.grid.Orte'
    ],

    width: '100%',
    //height: 200,

    layout: {
        type: 'border',
    },
    toolbarPos: 'top',

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        // Different Layout of toolbar depending on the bars position.
        if (this.toolbarPos == 'top') {
            this.dockedItems = [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'tbtext',
                    text: i18n.getMsg('orte.gridTitle')
                },
                '->',
                {
                    text: i18n.getMsg('map.button.add'),
                    icon: 'resources/img/list-add.png',
                    action: 'addMap',
                    disabled: true // disabled on startup, will be enabled by setStore
                }, {
                    text: i18n.getMsg('orte.button.add'),
                    icon: 'resources/img/list-add.png',
                    action: 'add',
                    disabled: true // disabled on startup, will be enabled by setStore
                }, {
                    text: i18n.getMsg('orte.button.delete'),
                    icon: 'resources/img/list-remove.png',
                    action: 'delete',
                    disabled: true // disabled on startup, will be enabled by controller if necessary
                }]
            }];
        }
        else {
            this.dockedItems = [{
                xtype: 'toolbar',
                dock: this.toolbarPos,
                items: [ '->',
                {
                    text: i18n.getMsg('map.button.add'),
                    icon: 'resources/img/list-add.png',
                    action: 'addMap',
                    disabled: true // disabled on startup, will be enabled by setStore
                }, {
                    text: i18n.getMsg('orte.button.add'),
                    icon: 'resources/img/list-add.png',
                    action: 'add',
                    disabled: true // disabled on startup, will be enabled by setStore
                }]
            }];
        }

        this.items = [{
            xtype: 'ortstammdatengrid',
            width: '60%',
            collapsible: true,
            region: 'east',
        }, {
            xtype: 'map',
            region: 'center',
            layout: 'border',
            title: i18n.getMsg('map.title'),
            externalOrteStore: true,
            listeners: {
                beforecollapse: function() {
                    var c = this.map.getControlsByClass('OpenLayers.Control.ScaleLine');
                    this.map.removeControl(c[0]);
                },
                expand: function() {
                    this.map.addControl(new OpenLayers.Control.ScaleLine());
                }
            }
        }],

        this.callParent(arguments);
    },

    setStore: function(store) {
        var me = this;
        var osg = this.down('ortstammdatengrid');
        var map = this.down('map');

        if (!store) {
            var ortstore = Ext.create('Lada.store.Orte', {
                defaultPageSize: 0,
                listeners: {
                    beforeload: {
                        fn: function() {
                            osg.setLoading(true);
                            map.setLoading(true);
                        }
                    },
                    load: {
                        fn: function() {
                            osg.setLoading(false);
                            map.setLoading(false);
                            osg.setStore(ortstore);
                            map.addLocations(ortstore);

                        }
                    }
                }
            });
        }
        else {
            osg.setStore(store);
            map.addLocations(store);
        }
        //enable buttons
        me.down('toolbar button[action=add]').enable();
        me.down('toolbar button[action=addMap]').enable();
    }
});
