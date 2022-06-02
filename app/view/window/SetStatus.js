/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a simple Window to set the Status for multiple Messungen on bulk.
 */
Ext.define('Lada.view.window.SetStatus', {
    extend: 'Ext.window.Window',
    alias: 'setstatuswindow',

    requires: [
        'Lada.view.widget.StatuskombiSelect',
        'Lada.store.StatusKombi'
    ],
    store: Ext.create('Lada.store.StatusKombi'),
    grid: null,
    selection: null,
    dataId: null,
    sendIds: null,
    modal: true,
    constrain: true,
    closable: false,
    resultMessage: '',

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.on({
            show: function() {
                this.removeCls('x-unselectable');
            }
        });
        var possibleStatusStore;
        if (this.grid) {
            this.dataId = this.grid.rowtarget.messungIdentifier ||
                this.grid.rowtarget.dataIndex;
        } else {
            // Assume a normal Messung record
            this.dataId = 'id';
        }
        this.sendIds = [];
        for (var i = 0; i < this.selection.length; i++) {
            this.sendIds.push(this.selection[i].get(this.dataId));
        }
        this.getPossibleStatus(this.sendIds);
        this.items = [{
            xtype: 'form',
            name: 'valueselection',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            border: false,
            items: [{
                xtype: 'fieldset',
                title: '',
                margin: '5, 5, 10, 5',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    labelWidth: 100
                },
                items: [{
                    xtype: 'combobox',
                    store: Ext.data.StoreManager.get('messstellenFiltered'),
                    displayField: 'messStelle',
                    valueField: 'id',
                    allowBlank: false,
                    queryMode: 'local',
                    editable: true,
                    matchFieldWidth: false,
                    emptyText: i18n.getMsg('emptytext.erzeuger'),
                    fieldLabel: i18n.getMsg('erzeuger')
                }, {
                    xtype: 'statuskombiselect',
                    store: possibleStatusStore,
                    allowBlank: false,
                    fieldLabel: i18n.getMsg('header.statuskombi')
                }, {
                    xtype: 'textarea',
                    height: 100,
                    fieldLabel: i18n.getMsg('text'),
                    emptyText: i18n.getMsg('emptytext.kommentar.widget')
                }]
            }],
            buttons: [{
                text: i18n.getMsg('statusSetzen'),
                name: 'start',
                icon: 'resources/img/mail-mark-notjunk.png',
                formBind: true,
                disabled: true,
                handler: this.setStatus
            }, {
                text: i18n.getMsg('cancel'),
                name: 'abort',
                handler: this.closeWindow
            }]
        }, {
            xtype: 'panel',
            scrollable: true,
            hidden: true,
            margin: '5, 5, 5, 5',
            scrollable: true,
            name: 'result'
        }, {
            xtype: 'progressbar',
            margin: '5, 5, 5, 5',
            height: 25,
            hidden: true,
            text: i18n.getMsg('statusprogress')
        }];
        this.buttons = [{
            text: i18n.getMsg('close'),
            name: 'close',
            hidden: true,
            handler: this.closeWindow
        }];

        var title = '';
        if (Ext.ComponentQuery.query('probeform').length !== 0) {
            var probenform = Ext.ComponentQuery.query('probeform');
            var probenumber = probenform[0].getRecord().get('hauptprobenNr') ? 'mit HP-Nr ' + probenform[0].getRecord().get('hauptprobenNr') : 'mit extPID ' + probenform[0].getRecord().get('externeProbeId');
            var messungnumber = this.selection[0].get('nebenprobenNr') ? 'mit NP-Nr ' + this.selection[0].get('nebenprobenNr') : 'mit extMId ' + this.selection[0].get('externeMessungsId');
            title = i18n.getMsg('setStatus.hprnr',
                    messungnumber,
                    probenumber);
        } else {
            title = i18n.getMsg('setStatus.count', this.selection.length);
        }
        this.callParent(arguments);
        this.down('fieldset').setTitle(title);

        // Initially validate to indicate mandatory fields clearly.
        this.down('form').isValid();
    },

    /**
     * @private
     * A handler for a Abort-Button
     */
    closeWindow: function(button) {
        var win = button.up('window');
        win.close();
    },

    /**
     * @private
     * A handler to setStatus on Bulk.
     */
    setStatus: function(button) {
        var win = button.up('window');
        win.down('panel').disable();
        win.down('button[name=start]').disable();
        win.down('button[name=abort]').disable();
        var progress = win.down('progressbar');
        progress.show();
        win.send();
    },

    send: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var progress = me.down('progressbar');
        var progressText = progress.getText();
        var count = 0;
        var kombi = me.down('statuskombiselect').getValue();
        if (kombi < 0) {
            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                i18n.getMsg('setStatus.wrongstatusstufe'));
            me.down('button[name=close]').show();
            return;
        }
        var data;
        var done = [];
        for (var i = 0; i < this.sendIds.length; i++) {
            if (!done.includes(this.sendIds[i])) {
                done.push(this.sendIds[i]);
                data = {
                    messungsId: this.sendIds[i],
                    mstId: this.down('combobox').getValue(),
                    datum: new Date(),
                    statusKombi: kombi,
                    text: this.down('textarea').getValue()
                };
                var finalcallback = function() {
                    var result = me.down('panel[name=result]');
                    var values = me.down('panel[name=valueselection]');
                    me.down('button[name=start]').hide();
                    me.down('button[name=abort]').hide();
                    me.down('button[name=close]').show();
                    result.setMaxHeight('400');
                    var title = me.down('fieldset').title;
                    me.resultMessage = '<h4>' + title + '</h4>' + me.resultMessage;
                    result.setHtml(me.resultMessage);
                    result.show();
                    values.hide();
                };
                Ext.Ajax.request({
                    url: 'lada-server/rest/status',
                    method: 'POST',
                    jsonData: data,
                    // eslint-disable-next-line no-loop-func
                    success: function(response) {
                        var json = Ext.JSON.decode(response.responseText);
                        var errors = json.errors;
                        var warnings = json.warnings;
                        var notifications = json.notifications;
                        var out = [];
                        var numErrors, numWarnings, numNotifications, j;
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
                        if (!json.success || numErrors > 0) {
                            var msgs;
                            out.push('<dl><dd>' +
                                i18n.getMsg('errors') +
                                '</dd>');
                            out.push('<dd><ul>');
                            if (!json.success) {
                                out.push('<li>' +
                                    i18n.getMsg(json.message) + '</li>');
                            }
                            for (var key in errors) {
                                msgs = errors[key];
                                var validation = [];
                                if (key.indexOf('#') > -1) {
                                    var keyParts = key.split('#');
                                    for (j = msgs.length - 1; j >= 0; j--) {
                                        validation.push('<li><b>' +
                                            i18n.getMsg(keyParts[0]) +
                                            '</b><i> ' +
                                            keyParts[1].toString() +
                                            '</i>: ' +
                                            i18n.getMsg(msgs[j].toString()) +
                                            '</li>');
                                    }
                                } else {
                                    for (j = msgs.length - 1; j >= 0; j--) {
                                        validation.push('<li><b>' +
                                            i18n.getMsg(key) +
                                            ':</b> ' +
                                            i18n.getMsg(msgs[j].toString()) +
                                            '</li>');
                                    }
                                }
                                out.push(validation.join(''));
                            }
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
                            for (var key2 in warnings) {
                                msgs = warnings[key2];
                                validation = [];
                                if (key2.indexOf('#') > -1) {
                                    keyParts = key2.split('#');
                                    for (j = msgs.length - 1; j >= 0; j--) {
                                        validation.push('<li><b>' +
                                            i18n.getMsg(keyParts[0]) +
                                            '</b><i> ' +
                                            keyParts[1].toString() +
                                            '</i>: ' +
                                            i18n.getMsg(msgs[j].toString()) +
                                            '</li>');
                                    }
                                } else {
                                    for (j = msgs.length - 1; j >= 0; j--) {
                                        validation.push('<li><b>' +
                                            i18n.getMsg(key2) +
                                            ':</b> ' +
                                            i18n.getMsg(msgs[j].toString()) +
                                            '</li>');
                                    }
                                }
                                out.push(validation.join(''));
                            }
                            out.push('</ul></dd>');
                        }

                        if (numNotifications > 0) {
                            out.push('<dl><dd>' +
                                i18n.getMsg('notes') +
                                '</dd>');
                            out.push('<dd><ul>');
                            for (var key3 in notifications) {
                                msgs = notifications[key3];
                                validation = [];
                                if (key3.indexOf('#') > -1) {
                                    keyParts = key3.split('#');
                                    for (j = msgs.length - 1; j >= 0; j--) {
                                        validation.push('<li><b>' +
                                            i18n.getMsg(keyParts[0]) +
                                            '</b><i> ' +
                                            keyParts[1].toString() +
                                            '</i>: ' +
                                            i18n.getMsg(msgs[j].toString()) +
                                            '</li>');
                                    }
                                } else {
                                    for (j = msgs.length - 1; j >= 0; j--) {
                                        validation.push('<li><b>' +
                                            i18n.getMsg(key3) +
                                            ':</b> ' +
                                            i18n.getMsg(msgs[j].toString()) +
                                            '</li>');
                                    }
                                }
                                out.push(validation.join(''));
                            }
                            out.push('</ul></dd>');
                        }
                        if (out.length > 0) {
                            // Print delimiter between different requests
                            out.push('<hr>');
                            // Add generated HTML to overall output
                            me.addLogItem(out.join(''), json.data.messungsId);
                        }

                        count++;
                        progress.updateProgress(
                            count / me.selection.length,
                            progressText + ' (' + count + ')');
                        if (count === me.selection.length) {
                            finalcallback();
                        }
                        me.fireEvent('statussetend');
                    },
                    // eslint-disable-next-line no-loop-func
                    failure: function(response, request) {
                        me.addLogItem(
                            '<dl><dd>' +
                                i18n.getMsg('errors') + '</dd><dd><ul><li>' +
                                i18n.getMsg('err.msg.generic.body') +
                                '</li></ul></dd></dl><hr>',
                            request.jsonData.messungsId
                                ? request.jsonData.messungsId
                                : null
                        );
                        count++;
                        progress.updateProgress(
                            count / me.selection.length,
                            progressText + ' (' + count + ')');
                        if (count === me.selection.length) {
                            finalcallback();
                        }
                    }
                });
            } else {
                count++;
                progress.updateProgress(
                    count / me.selection.length,
                    progressText + ' (' + count + ')');
                if (count === me.selection.length) {
                    finalcallback();
                }
            }
        }
    },

    getPossibleStatus: function(ids) {
        var me = this;
        Ext.Ajax.request({
            url: 'lada-server/rest/statuskombi/getbyids',
            jsonData: JSON.stringify(ids),
            method: 'POST',
            success: function(response) {
                var json = Ext.JSON.decode(response.responseText);
                if (json.data) {
                    me.store.setData(json.data);
                    me.down('statuskombiselect').down(
                        'combobox').getStore().setData(json.data);
                    if (!json.data.length) {
                        me.down('button[name=start]').disable();
                    }
                }
            }
        });
    },

    addLogItem: function(text, id) {
        var i18n = Lada.getApplication().bundle;
        if (id) {
            var item = Ext.Array.findBy(
                this.selection, function(it) {
                    return it.get(this.dataId) === id;
                }, this);
            if (item.get('nebenprobenNr') === undefined) {
                var probenumber = item.get('hpNr') ? '<strong>' + i18n.getMsg('hauptprobenNr') + '</strong> ' + item.get('hpNr') :
                        item.get('externeProbeId') ? '<strong>' + i18n.getMsg('extProbeId') + '</strong> ' + item.get('externeProbeId') :
                        '<strong>' + i18n.getMsg('hauptprobenNr') + ' nicht definiert</strong> ';
                var messungsnumber = item.get('npNr') ? '<strong>' + i18n.getMsg('nebenprobenNr') + '</strong> ' + item.get('npNr') :
                        item.get('externeMessungsId') ? '<strong>' + i18n.getMsg('extMessungsId') + '</strong> ' + item.get('externeMessungsId') :
                        '<strong>' + i18n.getMsg('nebenprobenNr') + ' nicht definiert</strong> ';
                this.resultMessage +=
                        probenumber +
                        ' - ' + messungsnumber;
            }
        }
        this.resultMessage += text;
    }
});

