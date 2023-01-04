/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to create/edit the Ort/Probe or Ort/Messprogramm Relation
 */

Ext.define('Lada.view.window.Ortszuordnung', {
    extend: 'Lada.view.window.TrackedWindow',
    alias: 'widget.ortszuordnungwindow',

    requires: [
        'Lada.model.Geolocat',
        'Lada.model.OrtszuordnungMp',
        'Lada.view.form.Ortszuordnung',
        'Lada.store.Orte',
        'Lada.view.form.Ort',
        'Lada.view.panel.Map',
        'Lada.view.window.HelpprintWindow',
        'Lada.view.grid.Orte',
        'Lada.view.grid.Staaten',
        'Lada.view.grid.Verwaltungseinheiten'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: false,
    layout: 'fit',
    constrain: true,

    probe: null,
    messprogramm: null,

    parentWindow: null,
    childWindows: [],
    record: null,
    recordType: 'ortszuordnung',
    grid: null,

    datenbasis: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('ortszuordnung.window.title');
        if (this.probe) {
            //Get datenbasis to check if its a REI Probe
            Ext.create('Lada.store.Datenbasis', {
                autoLoad: true,
                listeners: {
                    load: {
                        scope: this,
                        fn: function(store) {
                            var id = this.probe.get('regulationId');
                            if (!id) {
                                this.datenbasis = null;
                            } else {
                                this.datenbasis = store.getById(
                                    this.probe.get('regulationId'))
                                    .get('datenbasis');
                            }
                        }
                    }
                }
            });
            if (this.record) {
                // A probe record will be edited
                this.title = i18n.getMsg('ortszuordnung.window.title')
                            + ' '
                            + i18n.getMsg('ortszuordnung.window.title2')
                            + ' '
                            + i18n.getMsg('probe')
                            + ' '
                            + this.probe.get('mainSampleId')
                            + ' '
                            + i18n.getMsg('edit');
            } else {
                // A new probe record will be created
                this.title = i18n.getMsg('ortszuordnung.window.title')
                            + ' '
                            + i18n.getMsg('ortszuordnung.window.title2')
                            + ' '
                            + i18n.getMsg('probe')
                            + ' '
                            + this.probe.get('mainSampleId')
                            + ' '
                            + i18n.getMsg('create');
            }
        } else if (this.messprogramm) {
            if (this.record) {
                // A messprogramm record will be edited
                this.title = i18n.getMsg('ortszuordnung.window.title')
                            + ' '
                            + i18n.getMsg('ortszuordnung.window.title2')
                            + ' '
                            + i18n.getMsg('messprogramm')
                            + ' '
                            + this.messprogramm.get('id')
                            + ' '
                            + i18n.getMsg('edit');
            } else {
                // A new messprogramm record will be created
                this.title = i18n.getMsg('ortszuordnung.window.title')
                            + ' '
                            + i18n.getMsg('ortszuordnung.window.title2')
                            + ' '
                            + i18n.getMsg('messprogramm')
                            + ' '
                            + this.messprogramm.get('id')
                            + ' '
                            + i18n.getMsg('create');
            }
        }
        this.tools = [{
            type: 'help',
            tooltip: i18n.getMsg('help.qtip'),
            titlePosition: 0,
            callback: function() {
                var imprintWin = Ext.ComponentQuery.query(
                    'k-window-imprint')[0];
                if (!imprintWin) {
                    imprintWin = Ext.create(
                        'Lada.view.window.HelpprintWindow')
                        .show();
                    imprintWin.on('afterlayout', function() {
                        var imprintWinController = this.getController();
                        imprintWinController.setTopic('ort');
                    }, imprintWin, {single: true});
                } else {
                    var imprintWinController = imprintWin.getController();
                    imprintWinController.shake(imprintWin);
                    imprintWinController.setTopic('ort');
                }
            }
        }];
        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }];
        this.width = 900;
        this.height = Ext.getBody().getViewSize().height - 100;
        this.bodyStyle = {background: '#fff'};

        this.on({
            activate: function() {
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function() {
                this.getEl().addCls('window-inactive');
            },
            close: function() {
                var verwaltungseinheiten = Ext.data.StoreManager.get(
                    'verwaltungseinheiten');
                var staaten = Ext.data.StoreManager.get('staaten');
                if (verwaltungseinheiten) {
                    verwaltungseinheiten.clearFilter(true);
                }
                if (staaten) {
                    staaten.clearFilter(true);
                }
                if (this.childWindows.length) {
                    for (var key in this.childWindows) {
                        if (
                            this.childWindows[key] &&
                                this.childWindows[key].close
                        ) {
                            this.childWindows[key].close();
                        }
                    }
                }
            }
        });

        this.items = [{
            layout: 'border',
            bodyStyle: {background: '#fff'},
            border: false,
            items: [{
                xtype: 'map',
                region: 'center',
                layout: 'border',
                margin: '13, 5, 10, 5',
                externalOrteStore: true
            }, {
                xtype: 'ortszuordnungform',
                region: 'east'
            }, {
                xtype: 'tabpanel',
                tabBarPosition: 'top',
                region: 'south',
                border: false,
                layout: 'fit',
                height: 340,
                items: [{
                    xtype: 'ortstammdatengrid',
                    title: i18n.getMsg('title.orte'),
                    isMessprogramm: this.messprogramm ? true : false
                }, {
                    xtype: 'verwaltungseinheitengrid',
                    title: i18n.getMsg('title.verwaltungseinheiten')
                }, {
                    title: i18n.getMsg('title.staaten'),
                    xtype: 'staatengrid'
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                        xtype: 'textfield',
                        name: 'search',
                        icon: 'resources/img/Find.png',
                        width: '150px',
                        enableKeyEvents: true,
                        emptyText: i18n.getMsg('emptytext.ortssuche'),
                        emptyCls: 'empty-text-field',
                        fieldLabel: ''
                    }, '->', {
                        text: i18n.getMsg('orte.new'),
                        icon: 'resources/img/list-add.png',
                        action: 'createort'
                    }, {
                        text: i18n.getMsg('orte.frommap'),
                        icon: 'resources/img/list-add.png',
                        action: 'frommap'
                    }, {
                        text: i18n.getMsg('orte.all'),
                        icon: 'resources/img/network-workgroup.png',
                        action: 'allorte'
                    }]
                }]
            }]
        }];
        this.callParent(arguments);
    },

    /**
     * Initialise the Data of this Window
     */
    initData: function() {
        var me = this;
        this.down('verwaltungseinheitengrid').getStore().clearFilter();
        this.down('staatengrid').getStore().clearFilter();
        if (!this.record) {
            if (this.probe) {
                this.record = Ext.create('Lada.model.Geolocat');
                this.record.set('probeId', this.probe.get('id'));
            } else {
                this.record = Ext.create('Lada.model.OrtszuordnungMp');
                this.record.set('messprogrammId', this.messprogramm.get('id'));
            }
        }
        var mstId = this.probe ?
            this.probe.get('measFacilId') :
            this.messprogramm.get('mstId');
        var mst = Ext.data.StoreManager.get('messstellen');
        var ndx = mst.findExact('id', mstId);
        this.netzbetreiberId = mst.getAt(ndx).get('netzbetreiberId');
        this.down('ortszuordnungform').setRecord(this.record);
        var osg = this.down('ortstammdatengrid');
        var map = this.down('map');
        osg.setLoading(false);
        map.setLoading(false);
        this.ortstore = Ext.create('Lada.store.Orte');
        this.ortstore.setProxy(Ext.clone(this.ortstore.getProxy()));
        // leave the ortstore empty at begin.
        // TODO check when changing filter method to remote/local
        this.ortstore.removeAll();
        var ortId = this.record.get('ortId');
        if (ortId) {
            Lada.model.Site.load(ortId, {
                success: function(rec) {
                    me.down('ortszuordnungform').setFirstOrt(rec);
                    map.addPreviousOrt(rec);
                }
            });
        }
        map.addListener('featureselected', osg.selectOrt, osg);
        osg.addListener('select', map.selectFeature, map);
    },

    /**
     * @private
     * Override to display and update the map view in the panel.
     */
    afterRender: function() {
        this.superclass.afterRender.apply(this, arguments);
    },

    /**
     * Instructs the fields / forms listed in this method to set a message.
     * @param errors These Errors shall be shown
     * @param warnings These Warning shall be shown
     */
    setMessages: function() {
        //todo this is a stub
    },

    /**
     * Instructs the fields / forms listed in this method to clear their
     * messages.
     */
    clearMessages: function() {
        //todo this is a stub
    },

    /**
     * childs will be populated with store entries after all entries are loaded
     * from all sources
     */
    onStoreChanged: function() {
        var osg = this.down('ortstammdatengrid');
        var map = this.down('map');
        osg.setLoading(true);
        map.setLoading(true);
        map.addLocations(this.ortstore);
        var ortId;
        if (this.messprogramm) {
            ortId = this.record.get('ort');
        } else {
            ortId = this.record.get('ortId');
        }
        var ortrecord = this.ortstore.findRecord('id', ortId);
        if (ortrecord) {
            map.selectFeature(this.model, ortrecord);
            this.down('ortszuordnungform').setFirstOrt(ortrecord);
        }
        osg.setLoading(false);
        map.setLoading(false);
    },

    onEsc: function() {
        var me = this;
        var search = me.down('textfield[name=search]');
        if (search.hasFocus) {
            return;
        }
        me.callParent(arguments);
    }
});

