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
        type: 'border'
    },
    toolbarPos: 'top',

    ortstore: null,

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
        } else {
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
            region: 'center'
        }, {
            xtype: 'map',
            flex: 1,
            collapsible: true,
            region: 'east',
            layout: 'border',
            title: i18n.getMsg('map.title'),
            externalOrteStore: true
        }];
        this.callParent(arguments);
    },

    afterRender: function() {
        this.superclass.afterRender.apply(this, arguments);
        this.down('map').map.getView().setZoom(6);
    },

    setStore: function(store) {
        var me = this;
        var osg = this.down('ortstammdatengrid');
        var map = this.down('map');
        osg.setLoading(true);
        map.setLoading(true);
        if (store) {
            me.ortstore = store;
        }
        if (!me.ortstore) {
            me.ortstore = Ext.data.StoreManager.get('orte');
        }
        me.ortstore.clearFilter(true);
        osg.setStore(me.ortstore);
        map.addLocations(me.ortstore);
        me.down('toolbar button[action=add]').enable();
        me.down('toolbar button[action=addMap]').enable();
        me.connectListeners();
    },

    getStore: function() {
        return this.down('grid').getStore();
    },

    connectListeners: function() {
        var osg = this.down('ortstammdatengrid');
        var map = this.down('map');
        map.addListener('featureselected', osg.selectOrt, osg);
        osg.addListener('select', map.selectFeature, map);
    }
});
