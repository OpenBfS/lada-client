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
                });
                this.down('panel').setLoading(true);
                var reqJsondata = {
                    ids: me.ids,
                    start: startUTC,
                    end: endUTC
                };
                Ext.Ajax.request({
                    url: 'lada-server/rest/probe/messprogramm',
                    method: 'POST',
                    timeout: 2 * 60 * 1000,
                    jsonData: reqJsondata,
                    success: function(response) {
                        var panel = me.down('panel');
                        panel.setLoading(false);
                        var json = Ext.JSON.decode(response.responseText);
                        if (json.success && json.data.proben) {
                            Ext.Object.each(json.data.proben, function(key, result) {
                                if (result.success) {
                                    results.push(result);
                                    panel.setHtml(panel.html + '<br>'
                                    + i18n.getMsg('gpfm.generated.success',
                                        result.data.length, key));
                                } else {
                                    panel.setHtml(panel.html + '<br>'
                                            + i18n.getMsg('gpfm.generated.error',
                                                key, i18n.getMsg(result.message)));
                                }
                            });
                        }
                        me.down('toolbar').down('button').setDisabled(false);
                        me.processResults(results, json.data.tag? json.data.tag: '');
                    },
                    failure: function(response) {
                        var panel = me.down('panel');
                        panel.setLoading(false);
                        panel.setHtml(i18n.getMsg('gpfm.generated.requestfail', response.status, response.statusText));
                        me.down('toolbar').down('button').setDisabled(false);

                    }
                });
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
     * @private
     * Handle results of Probe creation from Messprogramm
     * @param results Array of results object
     * @param genTagName Generated tag name
     */
    processResults: function(results, genTagName) {
        var data = [];
        for (var r in results) {
            var result = results[r];
            if (result === null) {
                continue;
            }
            data = data.concat(result.data);
        }
        if (data.length === 0) {
            return;
        }
        var umwStore = Ext.create('Lada.store.Umwelt', {
            asynchronousLoad: false
        });
        var me = this;
        umwStore.load({callback: function(){
            me.genResultWindow(umwStore, data, genTagName)
        }});
    },

    /**
     * @private
     * Create generation result window
     * @param umwStore Umwelt store instance
     * @param data Generated probe instances
     * @param genTagname Generated tag name
     */
    genResultWindow: function(umwStore, data, genTagName) {
        var i18n = Lada.getApplication().bundle;
        var me = this;

        var columnstore = Ext.data.StoreManager.get('columnstore');
        columnstore.clearFilter();
        columnstore.filter({
            property: 'baseQuery',
            value: '1',
            exactMatch: true
        });
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
            constrain: true,
            title: i18n.getMsg('gpfm.generated.grid.title', genTagName? genTagName: ''),
            items: [{
                xtype: 'dynamicgrid',
                hidebuttons: ['importprobe', 'genericadd', 'gridexport'],
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
                        return Lada.util.Date.formatTimestamp(
                            value, 'd.m.Y', true
                        );
                    }
                }, {
                    header: i18n.getMsg('sollBis'),
                    dataIndex: 'solldatumEnde',
                    renderer: function(value) {
                        if (!value) {
                            return '';
                        }
                        return Lada.util.Date.formatTimestamp(
                            value, 'd.m.Y', true
                        );
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
                        if (!rec) {
                            return value;
                        }
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
                        if (!rec) {
                            return value;
                        }
                        var id = rec.get('gemId');
                        if (id) {
                            return id;
                        }
                        return '';
                    }
                }, {
                    header: i18n.getMsg('probenehmer'),
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
            }],
            onFocusEnter: function(event) {
                var resultWin = event.toComponent;
                var printWin = Lada.view.window.PrintGrid.getInstance();
                if (printWin) {
                    var grid = resultWin.down('dynamicgrid');
                    printWin.setParentGrid(grid);
                }
            }
        });
        win.show();
        win.down('dynamicgrid').setToolbar();
        me.down('panel').setHtml(me.down('panel').html + '<br><br>'
                + me.evalResponseData(data));
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
