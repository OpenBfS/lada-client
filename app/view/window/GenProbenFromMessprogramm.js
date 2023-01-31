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
        'Lada.store.Proben',
        'Lada.store.Umwelt'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: true,
    autoScroll: true,
    minHeight: 250,
    maxHeight: 500,
    minWidth: 340,
    layout: 'vbox',
    constrain: true,
    alwaysOnTop: true,
    parentWindow: null,
    ids: null,
    startUTC: null,
    endUTC: null,
    dryrun: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;

        this.on({
            activate: function() {
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function() {
                this.getEl().addCls('window-inactive');
            },
            show: function() {
                this.removeCls('x-unselectable');
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
                var startDate = new Date(
                    me.down('datefield[name=start]').getValue());
                var startUTC = Date.UTC(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    startDate.getDate());
                this.startUTC = startUTC;
                var endDate = new Date(
                    me.down('datefield[name=end]').getValue());
                var endUTC = Date.UTC(
                    endDate.getFullYear(),
                    endDate.getMonth(),
                    endDate.getDate());
                this.endUTC = endUTC;
                var dryrun = me.down('checkbox[name=dryrun]').getValue();
                this.dryrun = dryrun;
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
                    margin: '5, 5, 0, 5',
                    html: ''
                });
                this.down('panel').setLoading(true);
                var reqJsondata = {
                    ids: me.ids,
                    start: startUTC,
                    end: endUTC,
                    dryrun: dryrun
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
                        if (reqJsondata.dryrun) {
                            panel.setHtml(panel.html
                                + '<br>'
                                + i18n.getMsg('gpfm.window.test.result')
                                + '<br>'
                            );
                        }
                        if (json.success && json.data.proben) {
                            // Reload tag store to have generated tag available
                            var store = Ext.data.StoreManager.get('tags');
                            if (store) {
                                store.reload();
                            }

                            // Process response data
                            Ext.Object.each(json.data.proben,
                                function(key, result) {
                                    if (result.success) {
                                        results.push(result);
                                        var newRes = result.data.filter(
                                            function(r) {
                                                return r.found !== true;
                                            });
                                        var foundRes = result.data.filter(
                                            function(r) {
                                                return r.found === true;
                                            });
                                        panel.setHtml(
                                            panel.html +
                                            '<br>' +
                                            i18n.getMsg(
                                                'gpfm.generated.success',
                                                key)
                                            + ':<br>'
                                            + '<ul><li>'
                                            + i18n.getMsg(
                                                'gpfm.generated.found',
                                                foundRes.length)
                                            + ' </li><li>'
                                            + newRes.length
                                            + ' Probe(n) erzeugt</li></ul>'
                                        );
                                    } else {
                                        panel.setHtml(panel.html +
                                                '<br>' +
                                                i18n.getMsg(
                                                    'gpfm.generated.error',
                                                    key,
                                                    i18n.getMsg(
                                                        result.message)));
                                    }
                                });
                        }
                        me.down('toolbar').down('button').setDisabled(false);
                        me.processResults(
                            results,
                            json.data.tag ? json.data.tag : '',
                            reqJsondata);
                    },
                    failure: function(response) {
                        var panel = me.down('panel');
                        panel.setLoading(false);
                        if (reqJsondata.dryrun) {
                            panel.setHtml(panel.html
                                + '<br>'
                                + i18n.getMsg('gpfm.window.test.result')
                                + '<br>'
                            );
                        }
                        panel.setHtml(
                            i18n.getMsg(
                                'gpfm.generated.requestfail',
                                response.status,
                                response.statusText));
                        me.down('toolbar').down('button').setDisabled(false);

                    }
                });
            }
        }];
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

        this.items = [{
            border: false,
            width: 340,
            height: 270,
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
                formatText: '',
                period: 'start',
                value: this.startUTC || new Date()
            }, {
                xtype: 'datefield',
                fieldLabel: i18n.getMsg('to'),
                labelWidth: 90,
                margin: 5,
                width: 200,
                name: 'end',
                format: 'd.m.Y',
                formatText: '',
                period: 'end',
                value: this.endUTC || new Date(new Date().getFullYear(), 11, 31)
            }, {
                xtype: 'checkbox',
                name: 'dryrun',
                boxLabel: i18n.getMsg('gpfm.window.test'),
                value: this.dryrun || false
            }]
        }];
        this.callParent(arguments);
    },

    /**
     * @private
     * Handle results of Probe creation from Messprogramm
     * @param results Array of results object
     * @param genTagName Generated tag name
     * @param request the original request used
     */
    processResults: function(results, genTagName, request) {
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
        umwStore.load({
            callback: function() {
                me.genResultWindow(umwStore, data, genTagName, request);
            }
        });
    },

    /**
     * @private
     * Create generation result window
     * @param umwStore Umwelt store instance
     * @param data Generated probe instances
     * @param genTagname Generated tag name
     * @param request information about the original request (e.g. if it is
     *   a dryrun)
     */
    genResultWindow: function(umwStore, data, genTagName, request) {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var dbIdentifier = 'externeProbeId';
        var newStore = Ext.create('Lada.store.Proben', {data: data});
        var hidebuttons = ['genericadd', 'assigntags', 'gridexport'];
        if (request.dryrun) {
            // In dry runs, some additional actions need to stay unavailable:
            hidebuttons = hidebuttons.concat([
                'assigntags',
                'gridexport',
                'genericdelete',
                'expand'
            ]);
        }
        var title = i18n.getMsg('gpfm.generated.grid.title');
        if (request.dryrun) {
            title += i18n.getMsg('gpfm.window.test.result.title');
        }

        var win = Ext.create('Ext.window.Window', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            width: 800,
            constrain: true,
            title: title,
            items: [{
                xtype: 'panel',
                items: [{
                    xtype: 'panel',
                    name: 'genresultinfo',
                    html: ''
                }, {
                    xtype: 'checkbox',
                    name: 'newonly',
                    value: false,
                    boxLabel: i18n.getMsg('gpfm.newonly'),
                    handler: function(box, newState) {
                        var store = box.up('window').down('dynamicgrid')
                            .getStore();
                        if (!newState) {
                            store.clearFilter();
                        } else {
                            store.filterBy(function(rec) {
                                return rec.get('found') === false;
                            });
                        }
                    }
                }, {
                    xtype: 'button',
                    hidden: !request.dryrun,
                    text: i18n.getMsg('gpfm.repeatprobegen'),
                    handler: function(button) {
                        Ext.create(
                            'Lada.view.window.GenProbenFromMessprogramm', {
                                ids: request.ids,
                                parentWindow: me.parentWindow,
                                startUTC: me.startUTC,
                                endUTC: me.endUTC,
                                dryrun: me.dryrun
                            }).show();
                        button.up('window').close();
                    }
                }]
            }, {
                xtype: 'dynamicgrid',
                width: 800,
                minHeight: 500,
                maxHeight: 600,
                hidebuttons: hidebuttons,
                rowtarget: { dataType: 'probeId', dataIndex: 'id'},
                exportRowexp: true,
                store: newStore,
                emptyText: 'query.nodata',
                columns: [{
                    xtype: 'actioncolumn',
                    hideable: false,
                    width: 30,
                    header: '',
                    dataIndex: 'id',
                    sortable: false,
                    getClass: function(val, meta, rec) {
                        if (rec.get(dbIdentifier)) {
                            return 'edit';
                        }
                        return 'forbidden';
                    },
                    handler: function(grid, rowIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        if (rec.get(dbIdentifier)) {
                            grid.fireEvent('itemdblclick', grid, rec);
                        }
                    }
                }, {
                    header: i18n.getMsg('extProbeId'),
                    dataIndex: 'externeProbeId'
                }, {
                    header: i18n.getMsg('gpfm.pepstatus'),
                    dataIndex: 'found',
                    renderer: function(value) {
                        if (value) {
                            return i18n.getMsg('gpfm.existant');
                        }
                        return i18n.getMsg('gpfm.new');
                    }
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
                        if (!value || value === '') {
                            r = value;
                        }
                        var store = Ext.data.StoreManager.get(
                            'betriebsartStore');
                        var i = store.findExact('betriebsartId', value);
                        var record = store.getData().items[i];
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
                    xtype: 'datecolumn',
                    header: i18n.getMsg('sollVon'),
                    dataIndex: 'solldatumBeginn',
                    renderer : function(value) {
                        var dt = '';
                        var format = 'd.m.Y';
                        dt = Lada.util.Date.formatTimestamp(value, format, true);
                        return dt;
                    }
                }, {
                    xtype: 'datecolumn',
                    header: i18n.getMsg('sollBis'),
                    dataIndex: 'solldatumEnde',
                    renderer : function(value) {
                        var dt = '';
                        var format = 'd.m.Y';
                        dt = Lada.util.Date.formatTimestamp(value, format, true);
                        return dt;
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
                    renderer: function(value) {
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
                    renderer: function(value) {
                        if (value && value.length) {
                            var result = value.length
                                + ' (' + value.join(', ') + ')';
                            return result;
                        } else {
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
                plugins: request.dryrun ? false : Ext.create(
                    'Lada.view.plugin.GridRowExpander', {
                        gridType: 'Lada.view.grid.Messung',
                        idRow: 'id',
                        expandOnDblClick: false,
                        gridConfig: {
                            bottomBar: false
                        }
                    })
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    xtype: 'tbtext'
                }, '->', {
                    xtype: 'button',
                    text: i18n.getMsg('close'),
                    handler: function(button) {
                        button.up('window').close();
                    }
                },
                    {
                        xtype: 'button',
                        text: i18n.getMsg('button.tagToClipboard'),
                        name: 'tagclipboard'
                    }]
            }],
            onFocusEnter: function(event) {
                var resultWin = event.toComponent.up('window') ||
                    event.toComponent;
                var printWin = Lada.view.window.PrintGrid.getInstance();
                if (printWin) {
                    var grid = resultWin.down('dynamicgrid');
                    printWin.setParentGrid(grid);
                }
            }
        });
        win.on({
            show: function() {
                this.removeCls('x-unselectable');
            }
        });
        win.show();
        win.down('checkbox[name=newonly]').setValue(!request.dryrun);

        var resultHtml = '';
        if (request.dryrun) {
            resultHtml = i18n.getMsg('gpfm.window.test.result') + '<br>';
        }
        resultHtml += i18n.getMsg(
            'gpfm.window.result.period',
            Lada.util.Date.formatTimestamp(request.start, 'd.m.Y', true),
            Lada.util.Date.formatTimestamp(request.end, 'd.m.Y', true)
        );
        resultHtml += '<br>';
        if (genTagName.length !== 0) {
            resultHtml += i18n.getMsg('gpfm.generated.tag', genTagName)
                + '<br>';
            win.down('tbtext').setText(i18n.getMsg(
                'gpfm.generated.tag', genTagName));
            var btn = win.down('button[name=tagclipboard]').getEl().dom;
            btn.setAttribute('data-clipboard-text', genTagName);
            new ClipboardJS(btn);
        } else {
            win.down('button[name=tagclipboard]').setHidden(true);
        }

        win.down('panel[name=genresultinfo]').setHtml(resultHtml);
        win.down('dynamicgrid').setToolbar();
    },

    evalResponseData: function(data) {
        var i18n = Lada.getApplication().bundle;
        var r = '';
        var newData = data.filter(function(d) {
            return !d.found;
        });
        r += newData.length;
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
