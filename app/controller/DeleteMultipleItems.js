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
Ext.define('Lada.controller.DeleteMultipleItems', {
    extend: 'Lada.controller.BaseController',
    alias: 'controller.deletemultipleitems',

    requires: [
        'Lada.model.Sample',
        'Lada.model.Measm',
        'Lada.model.Mpg',
        'Lada.model.Sampler',
        'Lada.model.DatasetCreator',
        'Lada.model.MpgCateg',
        'Lada.model.Site',
        'Lada.model.Tag'
    ],

    /**
     * Initiates deletion of all selected items
     */
    handleDelete: function() {
        var win = this.getView();

        // Init progressbar
        var currentProgress = 0;
        var maxSteps = win.selection.length;
        win.down('progressbar').show();

        var url = Lada.model.LadaBase.schema.getUrlPrefix();
        var datatype = '';
        var i18n = Lada.getApplication().bundle;
        switch (win.parentGrid.rowtarget.dataType) {
            case 'probeId':
                url += Lada.model.Sample.entityName.toLowerCase();
                datatype = 'Probe ';
                break;
            case 'messungId':
                url += Lada.model.Measm.entityName.toLowerCase();
                datatype = 'Messung ';
                break;
            case 'mpId':
                url += Lada.model.Mpg.entityName.toLowerCase();
                datatype = i18n.getMsg('messprogramm');
                break;
            case 'probenehmer':
                url += Lada.model.Sampler.entityName.toLowerCase();
                datatype = i18n.getMsg('probenehmer');
                break;
            case 'dsatzerz':
                url += Lada.model.DatasetCreator.entityName.toLowerCase();
                datatype = i18n.getMsg('datensatzerzeuger');
                break;
            case 'mprkat':
                url += Lada.model.MpgCateg.entityName.toLowerCase();
                datatype = i18n.getMsg('messprogrammkategorie');
                break;
            case 'ortId':
                url += Lada.model.Site.entityName.toLowerCase();
                datatype = 'Ort';
                break;
            case 'tagId':
                url += Lada.model.Tag.entityName.toLowerCase();
                datatype = 'Tag';
                break;
        }
        for (var i = 0; i < win.selection.length; i++) {
            var id = win.selection[i].get(win.parentGrid.rowtarget.dataIndex);
            Ext.Ajax.request({
                url: url + '/' + id,
                method: 'DELETE',
                scope: this,
                success: function(resp) {
                    var json = Ext.JSON.decode(resp.responseText);
                    var delId = resp.request.url.split('/').pop();
                    var html = win.down('panel').html;
                    if (json.success && json.message === '200') {
                        /* Remove successfully deleted items from store
                         * (and thus from grid) to avoid obsolete items in
                         * grid, if not refreshed immediately */
                        var store = win.parentGrid.getStore();
                        var delIdx = store.find(
                            win.parentGrid.rowtarget.dataIndex,
                            delId, 0, false, true, true);
                        if (delIdx > -1) {
                            store.removeAt(delIdx);
                        }

                        html = html +
                            i18n.getMsg(
                                'deleteItems.callback.success',
                                datatype,
                                delId) +
                            '<br>';
                        win.down('panel').setHtml(html);
                    } else {
                        html = html + i18n.getMsg(
                            'deleteItems.callback.failure', datatype, delId)
                            + '<li>' + i18n.getMsg(json.message) + '</li><br>';
                        win.down('panel').setHtml(html);
                    }
                    currentProgress += 1;
                    win.down('progressbar').updateProgress(
                        currentProgress / maxSteps);
                    if (currentProgress === maxSteps) {
                        this.finishDelete();
                    }
                },
                failure: function(resp, opts) {
                    var delId = resp.request.url.split('/').pop();
                    var html = win.down('panel').html;
                    currentProgress += 1;
                    win.down('progressbar').updateProgress(
                        currentProgress / maxSteps);
                    var msg = this.handleRequestFailure(resp, opts, '', true);
                    html += i18n.getMsg(
                        'deleteItems.callback.failure', datatype, delId)
                        + ': ' + msg + '<br>';
                    win.down('panel').setHtml(html);
                    if (currentProgress === maxSteps) {
                        this.finishDelete();
                    }
                }
            });
        }
    },

    /**
     * Finish deletion of all selected items
     */
    finishDelete: function() {
        var win = this.getView();
        if (win.parentGrid) {
            var qp = Ext.ComponentQuery.query('querypanel')[0];
            var qp_button = Ext.ComponentQuery.query('button', qp)[0];
            var queryController = qp.getController();
            queryController.search(qp_button);
        }
        win.down('progressbar').hide();
        win.add({
            xtype: 'button',
            margin: '5, 5, 5, 5',
            text: Lada.getApplication().bundle.getMsg('close'),
            scope: win,
            handler: 'close'
        });
    }
});
