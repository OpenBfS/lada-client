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
        'Lada.store.GridColumnValue',
        'Lada.store.Proben'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: true,
    autoScroll: true,
    layout: 'vbox',
    constrain: true,
    alwaysOnTop: true,
    parentWindow: null,
    ids: null,

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
                    border: false,
                    layout: 'fit',
                    autoScroll: true,
                    margin: '5, 5, 0, 5',
                    height: 135,
                    width: 340,
                    html: ''
                }, {
                    xtype: 'progressbar',
                    text: i18n.getMsg('progress'),
                    height: 25,
                    width: 340,
                    margin: '5, 5, 5, 5'
                });
                var finished = 0;
                for (var r=0; r < me.ids.length; r++) {
                    var reqJsondata = {
                        id: me.ids[r],
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
                            me.down('progressbar').updateProgress(finished/me.ids.length);
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
                            if (finished === me.ids.length) {
                                me.down('toolbar').down('button').setDisabled(false);
                                me.onSuccess(results);
                            }
                        },
                        failure: function(response) {
                            finished++;
                            me.down('progressbar').updateProgress(finished/me.ids.length);
                            var panel = me.down('panel');
                            var error = response.statusText;
                            var id = response.request.options.jsonData.id;
                            panel.setHtml(panel.html + '<br>'
                                    + i18n.getMsg('gpfm.generated.error', id, error));
                            me.onFailure(response);
                            if (finished === me.ids.length) {
                                me.down('toolbar').down('button').setDisabled(false);
                            }
                        }
                    });
                }
            }
        }];

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
            border: false,
            width: 340,
            height: 165,
            margin: '5, 5, 5, 5',
            autoScroll: true,
            items: [{
                xtype: 'panel',
                border: false,
                margin: 5,
                layout: 'fit',
                html: '<p>'
                    + i18n.getMsg('nameofmessprogramm')
                    + '</p>'
            }, {
                xtype: 'panel',
                border: false,
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
        var data = [];
        for (var r in results) {
            var json = Ext.JSON.decode(results[r].responseText);
            if (json.data === null) {
                continue;
            }
            data = data.concat(json.data);
        }
        if (data.length === 0) {
            return;
        }
        var umwStore = Ext.create('Lada.store.Umwelt', {
            asynchronousLoad: false
        });
        var me = this;
        umwStore.load({callback: function(){
            me.genResultWindow(umwStore, data)
        }});
    },

    genResultWindow: function(umwStore, data){
        var i18n = Lada.getApplication().bundle;
        var me = this;

        var columnstore = Ext.data.StoreManager.get('columnstore');
        columnstore.clearFilter();
        columnstore.filter({
            property: 'baseQuery',
            value: '1',
            exactMatch: true});
        var gcs = Ext.create('Lada.store.GridColumnValue');
        //TODO basequery needed for this to work
        var columns = ['externeProbeId', 'mstId', 'datenbasisId', 'baId', 'probenartId',
            'solldatumBeginn', 'solldatumEnde', 'mprId', 'mediaDesk', 'umwId',
            'probeNehmerId', 'mmt', 'gemId'];
        for (var i=0; i < columns.length; i++) {
            var col = columnstore.findRecord('dataIndex', columns[i], false,
                false, false, true); // TODO col is unused here?
            gcs.add( new Ext.create('Lada.model.GridColumnValue',{
                columnIndex: i,
                filterActive: false,
                qid: 0, //TODO: hardcoded value based on example data
                dataIndex: columns[i],
                visible: true,
                gridColumnId: i
            }));
        }

        var newStore = Ext.create('Lada.store.Proben', {data: data});

        var win = Ext.create('Ext.window.Window', {
            layout: 'fit',
            width: 800,
            minHeight: 500,
            maxHeight: 600,
            items: [{
                xtype: 'dynamicgrid',
                hidebuttons: ['importprobe', 'genericadd'],
                rowtarget: { dataType: 'probeId', dataIndex: 'id'},
                exportRowexp: true,
                store: newStore,
                columns: [{
                    header: 'probe_id',
                    dataIndex: 'id',
                    hidden: true
                }, {
                    header: i18n.getMsg('extProbeId'),
                    dataIndex: 'externeProbeId'
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
                    header: i18n.getMsg('umwId'),
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
                    header: i18n.getMsg('messungen'),
                    dataIndex: 'mmt',
                    renderer: function(value, metadata, rec) {
                        var mmth = rec.get('mmt');
                        if (mmth) {
                            return mmth;
                        }
                        else {
                            return '-';
                        }
                    }
                }, {
                    header: i18n.getMsg('entnahmeOrt'),
                    dataIndex: 'gemId',
                    renderer: function(value, metadata, rec) {
                        var id = rec.get('gemId');
                        if (id){
                            return id;
                        }
                        return '';
                    }
                }, {
                    header: i18n.getMsg('probenehmerId'),
                    dataIndex: 'probeNehmerId'
                }],
                plugins: Ext.create('Lada.view.plugin.GridRowExpander', {
                    gridType: 'Lada.view.grid.Messung',
                    idRow: 'id',
                    expandOnDblClick: false,
                    gridConfig: {
                        bottomBar: false
                    }
                })
            }],
            buttons: [{
                text: i18n.getMsg('close'),
                handler: function(button) {
                    button.up('window').close();
                }
            }]
        });
        win.show();
        win.down('dynamicgrid').setToolbar();
        me.down('panel').setHtml(me.down('panel').html + '<br><br>'
                + me.evalResponseData(data));
    },

    /**
     * Callback on failure of request (HTTP status != 200)
     */
    onFailure: function(response) {
        this.setLoading(false);

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
            if (response.status === 0 && response.getResponse().responseText === '') {
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
    }
});
