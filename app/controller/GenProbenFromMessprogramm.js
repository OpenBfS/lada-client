/* Copyright (C) 2024 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for GenProbenFromMessprogramm window.
 */
Ext.define('Lada.controller.GenProbenFromMessprogramm', {
    extend: 'Lada.controller.BaseController',
    alias: 'controller.genprobenfrommessprogramm',

    generateSamples: function() {
        var i18n = Lada.getApplication().bundle;
        var win = this.getView();
        var startDate = new Date(
            win.down('datefield[name=start]').getValue());
        var startUTC = Date.UTC(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate());
        win.startUTC = startUTC;
        var endDate = new Date(
            win.down('datefield[name=end]').getValue());
        var endUTC = Date.UTC(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate());
        win.endUTC = endUTC;
        var dryrun = win.down('checkbox[name=dryrun]').getValue();
        win.dryrun = dryrun;
        var results = [];
        win.removeAll();
        win.down('toolbar').removeAll();
        win.down('toolbar').add({
            xtype: 'button',
            text: i18n.getMsg('close'),
            handler: win.close,
            disabled: true,
            scope: win
        });
        win.add({
            xtype: 'panel',
            border: false,
            layout: 'fit',
            margin: '5, 5, 0, 5',
            html: ''
        });
        win.down('panel').setLoading(true);
        var reqJsondata = {
            ids: win.ids,
            start: Ext.Date.format(
                new Date(win.startUTC), Ext.data.field.Date.DATE_FORMAT),
            end: Ext.Date.format(
                new Date(win.endUTC), Ext.data.field.Date.DATE_FORMAT),
            dryrun: dryrun
        };
        var me = this;
        Ext.Ajax.request({
            url: Lada.model.LadaBase.schema.getUrlPrefix() + '/'
                + Lada.model.Sample.entityName.toLowerCase()
                + '/messprogramm',
            method: 'POST',
            headers: {
                Accept: 'application/json'
            },
            timeout: 2 * 60 * 1000,
            jsonData: reqJsondata,
            success: function(response) {
                var panel = win.down('panel');
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
                    Ext.Object.each(
                        json.data.proben,
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
                                panel.setHtml(
                                    panel.html +
                                        '<br>' +
                                        i18n.getMsg(
                                            'gpfm.generated.error',
                                            key,
                                            i18n.getMsg(
                                                result.message)));
                            }
                        });
                }
                win.down('toolbar').down('button').setDisabled(false);
                me.processResults(
                    results,
                    json.data.tag ? json.data.tag : '',
                    reqJsondata);
            },
            failure: function(response) {
                var panel = win.down('panel');
                panel.setLoading(false);
                if (reqJsondata.dryrun) {
                    panel.setHtml(
                        panel.html
                            + '<br>'
                            + i18n.getMsg('gpfm.window.test.result')
                            + '<br>'
                    );
                }
                //Get detailed error message
                var msg = me.handleRequestFailure(response, null, null, true);
                panel.setHtml(
                    i18n.getMsg(
                        'gpfm.generated.requestfail',
                        response.status,
                        msg));
                win.down('toolbar').down('button').setDisabled(false);
            }
        });
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
        var win = this.getView();
        umwStore.load({
            callback: function() {
                win.genResultWindow(umwStore, data, genTagName, request);
            }
        });
    }
});
