/**
 * Viewport for the Lada-Client
 *
 * The viewport initialises the graphical elements of the application. For
 * debugging it is possible to initialize other components directly see the
 * initComponent function.
 */
Ext.define('Lada.view.Viewport' ,{
    extend: 'Ext.container.Viewport',
    requires: [
        'Lada.store.Info',
        'Lada.view.search.List',
        'Lada.view.proben.List'
    ],
    initComponent: function() {
        console.log('Setting up Viewport');
        this.initSearch();

        // Development related: 
        // Disable "initSearch" call and enable one of the following init
        // methods to get a dialog directly without the need to click through
        // the whole application.
        //this.initProbe();
        //this.initOrt();
        //this.initMessung();
        //this.initMesswert();

        this.setInfo();
        this.callParent(arguments);
    },
    /**
     * Set some information about user, client and server version in the top
     * of the application window. The data will be fetched from the server.
     */
    setInfo: function() {
        var store = Ext.create('Lada.store.Info');
        store.load({
            callback: function(a,b,c) {
                var info = store.data.items[0];
                var clientVersion = "r261 (2013-07-26)";
                var user = info.get('user');
                var groups = info.get('groups');
                var serverVersion = info.get('version');
                var info = Ext.getCmp('systeminfo');
                var groupinfo = Ext.getCmp('groupinfo');
                var userinfo = Ext.getCmp('userinfo');
                userinfo.update(user);
                groupinfo.update(groups);
                info.update('Server: '+serverVersion+' | Client: '+clientVersion);
                info.show();
                console.log(info);
            }
        });
    },
    /**
     * Function to initialize the edit window for a priticular probe directly
     * @private
     */
    initProbe: function() {
        var store = Ext.getStore('Proben');
        store.load({
            params: {
                probeId: "000007575943X"
            },
            callback: function() {
                var mstore = Ext.getStore('Messungen');
                mstore.load({
                    params: {
                        probeId: "000007575943X"
                    }
                });
                var model = store.data.items[0];
                var win = Ext.create('Lada.view.proben.Edit', {model: model});
            }
        });
    },
    /**
     * Function to initialize the edit window for a priticular messwert directly
     * @private
     */
    initMesswert: function() {
        var store = Ext.getStore('Messwerte');
        store.load({
            params: {
                probeId: "000007575853X",
                messungsId: "1"
            },
            callback: function() {
                var model = store.data.items[0];
                var win = Ext.create('Lada.view.messwerte.Create', {model: model});
            }
        });
    },
    /**
     * Function to initialize the edit window for a priticular ort directly
     * @private
     */
    initOrt: function() {
        var ort = Ext.create('Lada.model.Ort');
        var win = Ext.create('Lada.view.orte.Create', {model: ort});
    },
    /**
     * Function to initialize the edit window for a priticular ort directly
     * @private
     */
    initMessung: function() {
        var store = Ext.getStore('Messungen');
        var kstore = Ext.getStore('MKommentare');
        var mstore = Ext.getStore('Messwerte');
        var sstore = Ext.getStore('Status');
        probeId = "000007578314X";
        store.load({
            params: {
                probeId: probeId
            },
            callback: function () {
                console.log(store);
                var messung = store.data.items[0];
                console.log(store.data.items[0]);
                kstore.load({
                    params: {
                        probeId: probeId,
                        messungsId: messung.get('id').messungsId
                    }
                });
                sstore.load({
                    params: {
                        probeId: probeId,
                        messungsId: messung.get('id').messungsId
                    }
                });
                mstore.load({
                    params: {
                        probeId: probeId,
                        messungsId: messung.get('id').messungsId
                    }
                });
                console.log('Creating Messung window');
                //var messung = Ext.create('Lada.model.Messung');
                var win = Ext.create('Lada.view.messungen.Create', {model: messung});
            }
        });
    },
    /**
     * Function to initialize the search window. This is the default method
     * called by the {@link Lada.view.Viewport#initComponent initComponent} method.
     * @private
     */
    initSearch: function() {
        this.items = [{
            xtype: 'panel',
            title: '<center>Probenauswahlmaske</center>',
            bodyPadding: '10 10',
            dockedItems: [
                {
                    xtype: "toolbar",
                    dock: "top",
                    items: [{
                        xtype: "splitbutton",
                        text: "Info",
                        menu: {
                            items: [{
                                text: "About"
                            }]
                        }
                    },
                    "->",
                    {xtype: 'box', autoEl: {tag: 'img', src:'gfx/user.png'}},
                    {xtype: "tbtext", id:"userinfo", text:""},
                    {xtype: 'box', autoEl: {tag: 'img', src:'gfx/usergroup.png'}},
                    {xtype: "tbtext", id:"groupinfo", text:""}
                    ]
                }
            ],
            items: [
                // Informationen über Nutzer/Gruppe/Version
                {
                    xtype: 'panel',
                    id:  'systeminfo',
                    bodyPadding: '5',
                    hidden: true,
                },
                // Auswahl einer Abfrage.
                {
                    xtype: 'queryselector',
                    id: 'queryselector',
                    margin: '0 0 10 0'
                },
                // Variables settings for the current selected sql statement.
                {
                    xtype: 'fieldset',
                    id: 'queryfilters',
                    title: 'Variablenbelegung',
                    hidden: true,
                    items: []
                },
                // Buttons to trigger the search.
                {
                    id: 'SearchBtnPanel',
                    xtype: 'panel',
                    border: false,
                    margin: '0 0 10 0',
                    items: [
                        {
                            id: 'SearchBtn',
                            text: 'Suchen',
                            xtype: 'button',
                            margin: '0 10 0 0'
                        },
                        {
                            id: 'ResetBtn',
                            text: 'Zurücksetzen',
                            xtype: 'button'
                        }
                    ],
                    hidden: false

                },
                // Resultlist for the query.
                {
                    id: 'result',
                    xtype: 'probenlist',
                    hidden: false
                }
            ]
        }];
    }
});
