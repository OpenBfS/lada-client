/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for the DownloadQueue actions: adding, removing, occasional
 * updates
 */
Ext.define('Lada.controller.grid.Downloads', {
    extend: 'Lada.controller.grid.Queue',
    alias: 'controller.export',

    store: 'downloadqueue-export',
    urlPrefix: 'lada-server/data/asyncexport/',
    downloadPath: 'download/',

    /**
     * Initialize the controller
     */
    init: function() {
        this.control({
            ['exportdata checkbox[name=allrows], ' +
                'exportdata combobox[name=formatselection], ' +
                'exportdata checkbox[name=allcolumns], ' +
                'exportdata checkbox[name=secondarycolumns], ' +
                'exportdata tagfield[name=exportcolumns], ' +
                'exportdata tagfield[name=exportexpcolumns]'
            ]: {
                change: this.updateUI
            }
        });

        this.callParent(arguments);
    },

    /**
     * Evaluates the options set and starts the corresponding export
     */
    doExport: function(button) {
        var win = button.up('window');

        var exportFormat = win.down('combobox[name=formatselection]')
            .getValue();

        var filename = win.down('textfield[name=filename]').getValue();
        const suffix = '.' + exportFormat;
        if (!filename.endsWith(suffix)) {
            filename += suffix;
        }

        var requestData = {
            filename: filename,
            encoding: win.down('combobox[name=encoding]').getValue()
        };
        switch (exportFormat) {
            case 'geojson':
                var data = JSON.stringify(win.getGeoJson());
                var blob = new Blob(
                    [data], {type: 'application/json;charset=utf-8'});
                saveAs(blob, filename, true);
                return; // GeoJSON is not handled by server-side export
            case 'laf':
                var dataset = win.getDataSets();
                if (win.hasMessung) {
                    requestData.messungen = [];
                    for (var i = 0; i < dataset.length; i++) {
                        var mid = dataset[i].get(win.hasMessung);
                        if (Array.isArray(mid)) {
                            for (var j = 0; j < mid.length; j++) {
                                requestData.messungen.push(mid[j]);
                            }
                        } else {
                            requestData.messungen.push(mid);
                        }
                    }
                } else if (win.hasProbe) {
                    requestData.proben = [];
                    for (var k = 0; k < dataset.length; k++) {
                        var pid = dataset[k].get(win.hasProbe);
                        requestData.proben.push(pid);
                    }
                }
                break;
            case 'csv':
                var colsep = win.down('combobox[name=colsep]').getValue();
                var decsep = win.down('combobox[name=decsep]').getValue();
                if (colsep === decsep) {
                    win.showError('export.differentcoldecimal');
                    return;
                }
                requestData.subDataColumnNames = win
                    .getSubdataColumNames(requestData.subDataColumns);
                Object.assign(requestData, {
                    rowDelimiter: win.down('combobox[name=linesep]')
                        .getValue(),
                    fieldSeparator: colsep,
                    decimalSeparator: decsep,
                    quote: win.down('combobox[name=textlim]').getValue()
                });
            case 'json':
                // Parameters for both CSV and JSON
                Object.assign(requestData, {
                    columns: win.getColumnDefinitions(win),
                    idField: win.grid.rowtarget.dataIndex,
                    idFilter: win.getExportIds(win),
                    subDataColumns: win.getSubdataColumns(win),
                    timezone: Lada.util.Date.getCurrentTimeZone()
                });
        }

        var queueItem = win.controller.addQueueItem(filename);

        Ext.Ajax.request({
            url: win.requestUrl + exportFormat,
            jsonData: requestData,
            scope: this,
            success: function(response) {
                var json = Ext.JSON.decode(response.responseText, true);
                if (json) {
                    if (json.refId) {
                        queueItem.set('refId', json.refId);
                        queueItem.set('status', 'waiting');
                        this.refreshItemInfo(queueItem);
                    } else {
                        queueItem.set('status', 'error');
                    }

                    if (json.error) {
                        queueItem.set('message', json.error );
                    } else {
                        queueItem.set('message', '' );
                    }
                } else {
                    // TODO: Handle SSO HTML form like in
                    // RestProxy.processResponse
                    queueItem.set('done', true);
                    queueItem.set('status', 'error');
                }
            },
            failure: function(response, opts) {
                queueItem.set('done', true);
                queueItem.set('status', 'error');
                queueItem.set('message', win.controller.handleRequestFailure(
                    response, opts, null, true));
            }
        });
    },

    doCopy: function(button) {
        var i18n = Lada.getApplication().bundle;
        button.setDisabled(true);
        button.setText(i18n.getMsg('export.button.loading'));
        var data = JSON.stringify(button.up('window').getGeoJson());
        window.localStorage.setItem('gis-transfer-data', data);
        window.localStorage.setItem(
            'gis-transfer-data-transfer-date', new Date().valueOf());
        button.setText(i18n.getMsg('export.button.copy.success'));
    },

    /**
     * Add an entry to the downloadqueue.
     * @param filename: The name used to save results
     * @returns reference to the model item
     */
    addQueueItem: function(filename) {
        var storeItem = Ext.create('Lada.model.DownloadQueue', {
            filename: filename,
            startDate: new Date().valueOf(),
            status: 'preparation',
            done: false
        });
        Ext.data.StoreManager.get(this.store).add(storeItem);
        return storeItem;
    },

    /**
     * updateUI sets the current state of the UI depending on selected values
     * @param win window context
     */
    updateUI: function(item) {
        var win = item.up('window');
        var FORMATSELEKTOR = 'combobox[name=formatselection]';
        var formatSelection = win.down(FORMATSELEKTOR).getValue();
        var isAllColumnsSet = win.down('checkbox[name=allcolumns]').getValue();
        var SECONDARYCOLS = 'checkbox[name=secondarycolumns]';
        var isSecondaryColumnsSet = win.down(SECONDARYCOLS).getValue();
        var isLAF = formatSelection === 'laf';
        var isCSV = formatSelection === 'csv';
        var isJSON = formatSelection === 'json';
        var isGeoJSON = formatSelection === 'geojson';
        win.down('fieldset[name=csvoptions]').setVisible(isCSV);
        win.down('combobox[name=encoding]').setVisible( isLAF || isCSV);
        win.down('checkbox[name=allrows]').setVisible(!isLAF);
        win.down('checkbox[name=allcolumns]').setVisible(!isLAF);
        win.down('checkbox[name=secondarycolumns]').setVisible(isCSV || isJSON);
        win.down('button[action=copyGeoJson]').setVisible(isGeoJSON);
        win.down('button[action=copyGeoJson]').setDisabled(!isGeoJSON);
        win.down('tagfield[name=exportcolumns]')
            .setVisible(!isLAF && !isAllColumnsSet);
        win.down('tagfield[name=exportexpcolumns]')
            .setVisible(!isAllColumnsSet &&
                !isLAF && !isGeoJSON && isSecondaryColumnsSet);
        win.down('button[action=export]').setDisabled(
            !win.down('form').isValid()
            || !win.grid.getSelectionModel().getSelection().length
            && (win.down('combobox[name=formatselection]').getValue() === 'laf'
                || !win.down('checkbox[name=allrows]').getValue()));
    }
});
