/* Copyright (C) 2023 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Controller for SetStatus window.
 */
Ext.define('Lada.controller.SetStatus', {
    extend: 'Lada.controller.BaseController',
    alias: 'controller.setstatus',

    getPossibleStatus: function() {
        var win = this.getView();
        Ext.Ajax.request({
            url: 'lada-server/rest/statusmp/getbyids',
            jsonData: win.sendIds,
            method: 'POST',
            scope: this,
            success: function(response) {
                var json = Ext.JSON.decode(response.responseText);
                if (json.data) {
                    win.down('statuskombiselect').down(
                        'combobox').getStore().setData(json.data);
                    if (!json.data.length) {
                        win.down('button[name=start]').disable();
                    }
                }
            },
            failure: this.handleRequestFailure
        });
    },

    /**
     * A handler to set status in bulk.
     */
    setStatus: function() {
        var win = this.getView();
        win.down('panel').disable();
        win.down('button[name=start]').disable();
        win.down('button[name=abort]').disable();

        var progress = win.down('progressbar');
        progress.show();

        var i18n = Lada.getApplication().bundle;
        var progressText = progress.getText();
        var count = 0;
        var kombi = win.down('statuskombiselect').getValue();
        if (kombi < 0) {
            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                i18n.getMsg('setStatus.wrongstatusstufe'));
            win.down('button[name=close]').show();
            return;
        }
        var data;
        var done = [];
        for (var i = 0; i < win.sendIds.length; i++) {
            if (!done.includes(win.sendIds[i])) {
                done.push(win.sendIds[i]);
                data = Ext.create('Lada.model.StatusProt', {
                    measmId: win.sendIds[i],
                    measFacilId: win.down('combobox').getValue(),
                    date: new Date(),
                    statusMpId: kombi,
                    text: win.down('textarea').getValue()
                });
                data.set('id', null);
                var finalcallback = function() {
                    var result = win.down('panel[name=result]');
                    var values = win.down('panel[name=valueselection]');
                    win.down('button[name=start]').hide();
                    win.down('button[name=abort]').hide();
                    win.down('button[name=close]').show();
                    result.setMaxHeight('400');
                    var title = win.down('fieldset').title;
                    win.resultMessage = '<h4>' + title + '</h4>' +
                        win.resultMessage;
                    result.setHtml(win.resultMessage);
                    result.show();
                    values.hide();
                };
                data.save({
                    scope: this,
                    // eslint-disable-next-line no-loop-func
                    callback: function(record, operation, success) {
                        var json = this.handleServiceFailure(
                            record, operation, '', true);
                        if (json) {
                            var errors = json.data.errors;
                            var warnings = json.data.warnings;
                            var notifications = json.data.notifications;
                            var out = [];
                            var numErrors, numWarnings, numNotifications;
                            if (!Ext.isObject(errors)) {
                                numErrors = 0;
                            } else {
                                numErrors = Object.keys(errors).length;
                            }
                            if (!Ext.isObject(warnings)) {
                                numWarnings = 0;
                            } else {
                                numWarnings = Object.keys(warnings).length;
                            }
                            if (!Ext.isObject(notifications)) {
                                numNotifications = 0;
                            } else {
                                numNotifications = Object.keys(notifications)
                                    .length;
                            }

                            // Print lists of errors, warnings and notifications
                            if (!success || numErrors > 0) {
                                out.push('<dl><dd>' +
                                         i18n.getMsg('errors') +
                                         '</dd>');
                                out.push('<dd><ul>');
                                if (!success && json.message) {
                                    out.push('<li>' +
                                             i18n.getMsg(json.message) +
                                             '</li>');
                                }
                                this.printMessages(errors, out);
                                out.push('</ul></dd>');
                            } else {
                                out.push('<dl><dd>' +
                                         i18n.getMsg('status-' + json.message) +
                                         '</dd>');
                                out.push('</dd></dl>');
                            }

                            if (numWarnings > 0) {
                                out.push('<dl><dd>' +
                                         i18n.getMsg('warns') +
                                         '</dd>');
                                out.push('<dd><ul>');
                                this.printMessages(warnings, out);
                                out.push('</ul></dd>');
                            }

                            if (numNotifications > 0) {
                                out.push('<dl><dd>' +
                                         i18n.getMsg('notes') +
                                         '</dd>');
                                out.push('<dd><ul>');
                                this.printMessages(notifications, out);
                                out.push('</ul></dd>');
                            }
                            if (out.length > 0) {
                                // Print delimiter between different requests
                                out.push('<hr>');
                                // Add generated HTML to overall output
                                win.addLogItem(
                                    out.join(''), record.get('measmId'));
                            }
                        } else {
                            win.addLogItem(
                                '<dl><dd>' +
                                    i18n.getMsg('errors') +
                                    '</dd><dd><ul><li>' +
                                    i18n.getMsg('err.msg.generic.body') +
                                    '</li></ul></dd></dl><hr>',
                                record.get('measmId')
                            );
                        }

                        count++;
                        progress.updateProgress(
                            count / win.selection.length,
                            progressText + ' (' + count + ')');
                        if (count === win.selection.length) {
                            finalcallback();
                        }
                        win.fireEvent('statussetend');
                    }
                });
            } else {
                count++;
                progress.updateProgress(
                    count / win.selection.length,
                    progressText + ' (' + count + ')');
                if (count === win.selection.length) {
                    finalcallback();
                }
            }
        }
    },

    printMessages: function(messages, out) {
        var i18n = Lada.getApplication().bundle;
        for (var key in messages) {
            var msgs = messages[key];
            var validation = [];
            for (var msg of msgs.reverse()) {
                // Translate keys in list-like messages where list items
                // start with something like '- measmId:'
                for (const matchResult of msg.matchAll(/- (\w+):/g)) {
                    const match = matchResult[1];
                    msg = msg.replace(
                        match,
                        Lada.util.I18n.getMsgIfDefined(match));
                }

                validation.push(
                    '<li><b>' + i18n.getMsg(key) + ':</b> ' +
                        Lada.util.I18n.getMsgIfDefined(msg.toString()) +
                        '</li>');
            }
            out.push(validation.join(''));
        }
    }
});
