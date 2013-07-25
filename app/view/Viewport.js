Ext.define('Lada.view.Viewport' ,{
    extend: 'Ext.container.Viewport',
    requires: [
        'Lada.store.Info',
        'Lada.view.search.List',
        'Lada.view.search.List',
        'Lada.view.proben.List',
        'Lada.view.widgets.Mst',
        'Lada.view.widgets.Uwb',
        'Lada.view.widgets.Datetime'
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
    setInfo: function() {
        var store = Ext.create('Lada.store.Info');
        store.load({
            callback: function(a,b,c) {
                var info = store.data.items[0];
                var clientVersion = "-/- (-/-)";
                var user = info.get('user');
                var groups = info.get('groups');
                var serverVersion = info.get('version');
                var info = Ext.getCmp('systeminfo');
                info.update('Nutzer: '+user+' | Gruppe(n): '+groups+' | Server: '+serverVersion+' | Client: '+clientVersion);
                info.show();
                console.log(info);
            }
        });
    },
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
    initOrt: function() {
        var ort = Ext.create('Lada.model.Ort');
        var win = Ext.create('Lada.view.orte.Create', {model: ort});
    },
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
    initSearch: function() {
        this.items = {
            xtype: 'panel',
            title: '<center>Probenauswahlmaske</center>',
            bodyPadding: '10 10',
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
                    margin: '0 0 10 0'
                },
                // Variables settings for the current selected sql statement.
                {
                    xtype: 'fieldset',
                    id: 'queryfilters',
                    title: 'Variablenbelegung',
                    hidden: true,
                    items: [
                        {
                            id: 'filter-mstId',
                            xtype: 'mst',
                            fieldLabel: 'Messstelle',
                            labelWidth: 100,
                            hidden: true
                        },
                        {
                            id: 'filter-umwId',
                            xtype: 'uwb',
                            fieldLabel: 'Umweltbereich',
                            labelWidth: 100,
                            hidden: true
                        },
                        {
                            id: 'filter-pbegin',
                            xtype: 'datetime',
                            fieldLabel: 'Probenbeginn',
                            labelWidth: 100,
                            hidden: true
                        }
                    ]
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
        };
    }
});
