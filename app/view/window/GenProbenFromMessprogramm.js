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
    layout: 'vbox',
    constrain: true,

    records: null,
    parentWindow: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function() {
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function() {
                this.getEl().addCls('window-inactive');
            }
        });

        this.title = i18n.getMsg('gpfm.window.title');
        this.buttons = [{
            text: i18n.getMsg('cancel'),
            scope: this,
            handler: this.close
        }, {
            text: i18n.getMsg('generateproben'),
            scope: this,
            handler: function() {
                //me.setLoading(true);
                var me = this;
                var startDate = new Date(me.down('datefield[name=start]').getValue());
                var startUTC = Date.UTC(
                    startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                var endDate = new Date(me.down('datefield[name=end]').getValue());
                var endUTC = Date.UTC(
                    endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                var results = [];
                this.removeAll();
                this.down('toolbar').removeAll();
                this.down('toolbar').add({
                    xtype: 'button',
                    text: i18n.getMsg('close'),
                    handler: this.close,
                    disabled: true,
                    scope: this
                });
                this.add({
                    xtype: 'panel',
                    border: 0,
                    margin: 5,
                    layout: 'fit',
                    autoScroll: true,
                    margin: '5, 5, 0, 5',
                    height: 135,
                    width: 340,
                    html: ''
                }, {
                    xtype: 'progressbar',
                    text: 'Fortschritt',
                    height: 25,
                    width: 340,
                    margin: '5, 5, 5, 5'
                });
                var finished = 0;
                for (r in me.records) {
                    var reqJsondata = {
                        id: me.records[r].id,
                        start: startUTC,
                        end: endUTC
                    };
                    Ext.Ajax.request({
                        url: 'lada-server/rest/probe/messprogramm',
                        method: 'POST',
                        timeout: 2 * 60 * 1000,
                        jsonData: reqJsondata,
                        success: function(response) {
                            finished++;
                            me.down('progressbar').updateProgress(finished/me.records.length);
                            results.push(response);
                            var panel = me.down('panel');
                            var json = Ext.JSON.decode(response.responseText);
                            var id = response.request.options.jsonData.id;
                            if (json.success) {
                                panel.setHtml(panel.html + '<br>'
                                        + i18n.getMsg('gpfm.generated.success',
                                            json.data.length, id));
                            } else {
                                panel.setHtml(panel.html + '<br>'
                                        + i18n.getMsg('gpfm.generated.error',
                                            id, i18n.getMsg(json.message)));
                            }
                            if (finished == me.records.length) {
                                me.down('toolbar').down('button').setDisabled(false);
                                me.onSuccess(results);
                            }
                        },
                        failure: function(response) {
                            finished++;
                            me.down('progressbar').updateProgress(finished/me.records.length);
                            var panel = me.down('panel');
                            var error = response.statusText;
                            var id = response.request.options.jsonData.id;
                            panel.setHtml(panel.html + '<br>'
                                    + i18n.getMsg('gpfm.generated.error', id, error));
                            me.onFailure(response);
                            if (finished == me.records.length) {
                                me.down('toolbar').down('button').setDisabled(false);
                            }
                        }
                    });
                }
            }
        }];
        //this.width = 350;
        //this.height = 250;

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function() {
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function() {
                this.getEl().addCls('window-inactive');
            },
            close: function() {
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
            width: 340,
            height: 165,
            margin: '5, 5, 5, 5',
            autoScroll: true,
            items: [{
                xtype: 'panel',
                border: 0,
                margin: 5,
                layout: 'fit',
                html: '<p>'
                    + i18n.getMsg('nameofmessprogramm')
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
     * Handle results of Probe creation from Messprogramm
     */
    onSuccess: function(results) {
        var i18n = Lada.getApplication().bundle;

        var data = [];

        //Concatenate result json data
        for (r in results) {
            var json = Ext.JSON.decode(results[r].responseText);
            if (json.data == null) {
                continue;
            }
            data = data.concat(json.data);
        }
        if (data.length == 0) {
            return;
        }

        var loadedStores = 0;

        //Create and load neccessary stores
        var umwStore = Ext.create('Lada.store.Umwelt', {
            asynchronousLoad: false
        });

        var mmtStore = Ext.create('Lada.store.MmtMessprogramm', {
            asynchronousLoad: false,
            autoLoad: true
        });

        var mpStore = Ext.create('Lada.store.MessprogrammeList');
        var stores = [umwStore, mpStore];
        storeJson = {
            umweltStore: umwStore,
            mpStore: mpStore,
            mmtStore: mmtStore
        };

        for (var i = 0; i < stores.length; i++) {
            stores[i].load({
                scope: this,
                callback: function() {
                    loadedStores++;
                    if (loadedStores == stores.length) {
                        this.createGrid(data, storeJson);
                    }
                }
            });
        }
    },

    createGrid: function(data, storeJson) {
        var umwStore = storeJson.umweltStore;
        var mpStore = storeJson.mpStore;
        var mmtStore = storeJson.mmtStore;

        var i18n = Lada.getApplication().bundle;
        var gridstore = Ext.create('Lada.store.Proben', {
        });
        //TODO: broken as of now, should be a DynamicGrid
        var frgrid = Ext.create('Lada.view.grid.ProbeList', {
            hideCreate: true,
            hideImport: true,
            hidePrintSheet: true,
            export_rowexp: true,
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
            header: i18n.getMsg('probeId'),
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
        }, {
            header: i18n.getMsg('messprogramm.form.fieldset.title'),
            dataIndex: 'mprId'
        }, {
            header: i18n.getMsg('mediaDesk'),
            dataIndex: 'mediaDesk'
        }, {
            //TODO: load description
            header: i18n.getMsg('umw_id'),
            dataIndex: 'umwId',
            renderer: function(value, metadata) {
                if (!value) {
                    return '';
                }
                var store = umwStore;
                var model = store.getById(value);
                if (model) {
                    return value + ' - ' + model.get('umweltBereich');
                } else {
                    return value;
                }
            }
        }, {
            header: 'Messungen',
            renderer: function(value, metadata, rec) {
                var mprId = rec.get('mprId');
                mmtStore.clearFilter();
                mmtStore.filter('messprogrammId', mprId);
                var count = mmtStore.getCount();
                if (!count) {
                    return '(0)';
                }
                var mgrtext = '';
                var mmth = mmtStore.getAt(0).get('mmtId');
                if (mmth) {
                    mgrtext = mmth;
                }
                for (var i = 1; i < count; i ++ ) {
                    var mmth = mmtStore.getAt(i).get('mmtId');
                    if (mmth) {
                        mgrtext += ', ' + mmth;
                    }
                }
                mgrtext += '(' + count + ')';
                return mgrtext;
            }
        }, {
            header: i18n.getMsg('entnahmeOrt'),
            renderer: function(value, metadata, rec) {
                var mprModel = mpStore.getById(rec.get('mprId'));
                if (mprModel) {
                    var eGemId = mprModel.get('eGemId');
                    var eGem = mprModel.get('eGem');
                    if (eGemId != null && eGem != null) {
                        return eGemId + ' - ' + eGem;
                    }
                }
                return '';
            }
        }, {
            header: i18n.getMsg('probe_nehmer_id'),
            dataIndex: 'probeNehmerId'
        }];
        frgrid.reconfigure(gridstore, columns);

        gridstore.loadData(data);
        gridstore.getFilters().add(function(item) {
            for (var i = 0; i < data.length; i++) {
                if (item.data.id == data[i].id) {
                    return true;
                }
            }
            return false;
        });
        var win = Ext.create('Ext.window.Window', {
            layout: 'fit',
            width: 800,
            minHeight: 500,
            maxHeight: 750,
            items: [frgrid]
        });
        me.hide();
        win.show();
        //contentPanel.add(frgrid);
        me.down('panel').setHtml(me.down('panel').html + '<br><br>'
                + me.evalResponseData(data));
    },

    /**
     * Callback on failure of request (HTTP status != 200)
     */
    onFailure: function(response) {
        me.setLoading(false);

        var i18n = Lada.getApplication().bundle;

        var json = null;
        try {
            json = Ext.JSON.decode(response.getResponse().responseText);
        } catch (err) {
            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                i18n.getMsg('err.msg.response.body'));
        }
        if (json) {
            /*
              SSO will send a 302 if the Client is not authenticated
              unfortunately this seems to be filtered by the browser.
              We assume that a 302 was send when the follwing statement
              is true.
            */
            if (response.status == 0 && response.getResponse().responseText === '') {
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

    evalResponseData: function(data) {
        var i18n = Lada.getApplication().bundle;
        var r = '';
        r += data.length;
        r += ' ' + i18n.getMsg('probecreated');
        r += '<br/>';
        return r;
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
