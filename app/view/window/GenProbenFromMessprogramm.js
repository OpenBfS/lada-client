/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to generate Proben from a Messprogramm
 */
Ext.define('Lada.view.window.GenProbenFromMessprogramm', {
    extend: 'Ext.window.Window',
    alias: 'widget.genpfm',

    requires: [
        'Lada.store.Proben'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: true,
    autoScroll: true,
    layout: 'fit',
    constrain: true,

    record: null,
    parentWindow: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            }
        });

        this.title = i18n.getMsg('gpfm.window.title');
        var me = this;
        this.buttons = [{
            text: i18n.getMsg('cancel'),
            scope: this,
            handler: this.close
        }, {
            text: i18n.getMsg('generateproben'),
            handler: function() {
                me.setLoading(true);
                var startDate = new Date(me.down('datefield[name=start]').getValue());
                var startUTC = Date.UTC(
                    startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                var endDate = new Date(me.down('datefield[name=end]').getValue());
                var endUTC = Date.UTC(
                    endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                var jsondata = {
                    id: me.record.id,
                    start: startUTC,
                    end: endUTC
                };

                Ext.Ajax.request({
                    url: 'lada-server/rest/probe/messprogramm',
                    method: 'POST',
                    timeout: 2 * 60 * 1000,
                    jsonData: jsondata,
                    success: me.onSuccess,
                    failure: me.onFailure,
                });
            }
        }];
        this.width = 350;
        this.height = 250;

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            },
            close: function () {
                if (this.parentWindow) {
                    this.parentWindow.probenWindow = null;
                }
            }
        });

        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "Id" param to load the correct item.
        this.items = [{
            border: 0,
            autoScroll: true,
            items: [{
                xtype: 'panel',
                border: 0,
                margin: 5,
                layout: 'fit',
                html: '<p>'
                    + i18n.getMsg('nameofmessprogramm')
                    + '<br/>'
                    + this.record.get('name')
                    + '</p>'
            }, {
                xtype: 'panel',
                border: 0,
                margin: 5,
                layout: 'fit',
                html: '<p>' + i18n.getMsg('messprogtimeperiod') + '</p>'
            }, {
                xtype: 'datefield',
                fieldLabel: i18n.getMsg('from'),
                labelWidth: 90,
                margin: 5,
                width: 200,
                name: 'start',
                format: 'd.m.Y',
                period: 'start',
                value: new Date()
            }, {
                xtype: 'datefield',
                fieldLabel: i18n.getMsg('to'),
                labelWidth: 90,
                margin: 5,
                width: 200,
                name: 'end',
                format: 'd.m.Y',
                period: 'end',
                value: new Date(new Date().getFullYear(), 11, 31)
            }]
        }];
        this.callParent(arguments);
    },

    /**
     * Callback on success of request (HTTP status 200)
     */
    onSuccess: function(response) {
        var i18n = Lada.getApplication().bundle;

        var json = Ext.JSON.decode(response.responseText);

        if (json.message != '200') {
            // handle LADA server errors
            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                          i18n.getMsg(json.message));
            me.setLoading(false);
        } else {
            var radio = Ext.ComponentQuery.query('modeswitcher')[0]
                .down('radiofield[inputValue=proben]');
            radio.setValue(true);

            var contentPanel = Ext.ComponentQuery.query('panel[name=main]')[0]
                .down('panel[name=contentpanel]');
            contentPanel.removeAll(); //clear panel: make space for new grids
            var gridstore = Ext.create('Lada.store.Proben');
            var frgrid = Ext.create('Lada.view.grid.ProbeList', {
                plugins: [{
                    ptype: 'gridrowexpander',
                    gridType: 'Lada.view.grid.Messung',
                    expandOnDblClick: false,
                    gridConfig: {
                        bottomBar: false
                    }
                }]
            });

            var columns = [{
                header: i18n.getMsg('prnId'),
                dataIndex: 'idAlt'
            }, {
                header: i18n.getMsg('mstId'),
                dataIndex: 'mstId',
                renderer: function(value) {
                    var r = '';
                    if (!value || value === '') {
                        r = 'Error';
                    }
                    var store = Ext.data.StoreManager.get('messstellen');
                    var record = store.getById(value);
                    if (record) {
                        r = record.get('messStelle');
                    }
                    return r;
                }
            }, {
                header: i18n.getMsg('datenbasisId'),
                dataIndex: 'datenbasisId',
                renderer: function(value) {
                    var r = '';
                    if (!value || value === '') {
                        r = value;
                    }
                    var store = Ext.data.StoreManager.get('datenbasis');
                    var record = store.getById(value);
                    if (record) {
                        r = record.get('datenbasis');
                    }
                    return r;
                }
            }, {
                header: i18n.getMsg('baId'),
                dataIndex: 'baId',
                renderer: function(value) {
                    var r = '';
                    var store = Ext.create('Ext.data.Store', {
                        fields: ['id', 'betriebsart'],
                        data: [{
                            'id': 1,
                            'betriebsart': 'Normal-/Routinebetrieb'
                        }, {
                            'id': 2,
                            'betriebsart': 'Störfall/Intensivbetrieb'
                        }]
                    });
                    var record = store.getById(value);
                    if (record) {
                        r = record.get('betriebsart');
                    }
                    return r;
                }
            }, {
                header: i18n.getMsg('probenartId'),
                dataIndex: 'probenartId',
                renderer: function(value) {
                    var r = '';
                    if (!value || value === '') {
                        r = value;
                    }
                    var store = Ext.data.StoreManager.get('probenarten');
                    var record = store.getById(value);
                    if (record) {
                        r = record.get('probenart');
                    }
                    return r;
                }
            }, {
                header: i18n.getMsg('sollVon'),
                dataIndex: 'solldatumBeginn',
                renderer: function(value) {
                    if (!value) {
                        return '';
                    }
                    return Ext.Date.format(value, 'd.m.Y');
                }
            }, {
                header: i18n.getMsg('sollBis'),
                dataIndex: 'solldatumEnde',
                renderer: function(value) {
                    if (!value) {
                        return '';
                    }
                    return Ext.Date.format(value, 'd.m.Y');
                }
            }];
            frgrid.reconfigure(gridstore, columns);

            gridstore.loadData(json.data);
            contentPanel.add(frgrid);
            Ext.Msg.show({
                title: i18n.getMsg('success'),
                autoScroll: true,
                msg: me.evalResponse(json),
                buttons: Ext.Msg.OK
            });
            me.close();
        }
    },

    /**
     * Callback on failure of request (HTTP status != 200)
     */
    onFailure:  function(response) {
        me.setLoading(false);

        var i18n = Lada.getApplication().bundle;

        var json = null;
        try {
            json = Ext.JSON.decode(response.responseText);
        }
        catch(err){
            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                          i18n.getMsg('err.msg.response.body'));
        }
        if (json) {
            if(json.errors.totalCount > 0 || json.warnings.totalCount > 0){
                formPanel.setMessages(json.errors, json.warnings);
            }
            /*
              SSO will send a 302 if the Client is not authenticated
              unfortunately this seems to be filtered by the browser.
              We assume that a 302 was send when the follwing statement
              is true.
            */
            if (response.status == 0 && response.responseText === "") {
                Ext.MessageBox.confirm(
                    'Erneutes Login erforderlich',
                    'Ihre Session ist abgelaufen.<br/>'
                    + 'Für ein erneutes Login muss die Anwendung '
                    + 'neu geladen werden.<br/>'
                    + 'Alle ungesicherten Daten gehen dabei verloren.<br/>'
                    + 'Soll die Anwendung jetzt neu geladen werden?',
                    this.reload);
            }
            // further error handling
            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                          i18n.getMsg('err.msg.generic.body'));
        } else {
            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                          i18n.getMsg('err.msg.response.body'));
        }
    },


    /**
     * Initiatlise the Data
     */
    initData: function() {
        var i18n = Lada.getApplication().bundle;
        me = this;
    },

    /**
     * Parse ServerResponse when Proben have been generated
     */
    evalResponse: function(response) {
        var i18n = Lada.getApplication().bundle;
        var r = '';
            r += response.data.length;
            r += ' ' + i18n.getMsg('probecreated');
            r += '<br/>';
        return r;
    },

    /**
     * Reload the Application
     */
    reload: function(btn) {
        if (btn === 'yes') {
            location.reload();
        }
    }
});
