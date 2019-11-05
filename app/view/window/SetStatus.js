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
    record: null,

    modal: true,
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
                this.removeCls("x-unselectable");
            }
        });
        var possibleStatusStore;
        if ( this.selection) {
            var selectionIds = [];
            for (var i=0; i< this.selection.length; i++) {
                selectionIds.push(this.selection[i].get(
                    this.grid.rowtarget.dataIndex));
            }
            this.getPossibleStatus(selectionIds);
        } else {
            this.getPossibleStatus([this.record.get('id')]);
        }
        this.items = [{
            xtype: 'form',
            name: 'valueselection',
            border: false,
            items: [{
                xtype: 'fieldset',
                title: '',
                margin: '5, 5, 10, 5',
                items: [{
                    xtype: 'combobox',
                    store: Ext.data.StoreManager.get('messstellenFiltered'),
                    displayField: 'messStelle',
                    valueField: 'id',
                    allowBlank: false,
                    queryMode: 'local',
                    editable: false,
                    width: 350,
                    labelWidth: 100,
                    emptyText: i18n.getMsg('emptytext.erzeuger'),
                    fieldLabel: i18n.getMsg('erzeuger')
                }, {
                    xtype: 'statuskombiselect',
                    store: possibleStatusStore,
                    allowBlank: false,
                    width: 350,
                    labelWidth: 100,
                    fieldLabel: i18n.getMsg('header.statuskombi')
                }, {
                    xtype: 'textarea',
                    width: 350,
                    height: 100,
                    labelWidth: 100,
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
            layout: 'fit',
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
        if (this.record) {
            var probenform = Ext.ComponentQuery.query('probeform');
            if (probenform) {
                var hauptprobennummer = probenform[0].getRecord().get('hauptprobenNr');
                if (hauptprobennummer) {
                    title = i18n.getMsg('setStatus.hprnr',
                        hauptprobennummer,
                        me.record.get('nebenprobenNr'));
                }
            }
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
        if (this.selection) {
            for (var i = 0; i < this.selection.length; i++) {
                var data = {
                    messungsId: this.selection[i].get('id'),
                    mstId: this.down('combobox').getValue(),
                    datum: new Date(),
                    statusKombi: kombi,
                    text: this.down('textarea').getValue()
                };
                Ext.Ajax.request({
                    url: 'lada-server/rest/status',
                    method: 'POST',
                    jsonData: data,
                    success: function(response) {
                        var json = Ext.JSON.decode(response.responseText);
                        me.resultMessage += '<strong>' + i18n.getMsg('messung') + ': ';
                        var sel = me.selection[count];
                        me.resultMessage += sel.get('hpNr') + ' - ' + sel.get('npNr') + '</strong><br><dd>';
                        me.resultMessage += i18n.getMsg('status-' + json.message) + '</dd><br>';
                        count++;
                        progress.updateProgress(count / me.selection.length, progressText + ' (' + count + ')');
                        if (count === me.selection.length) {
                            var result = me.down('panel[name=result]');
                            var values = me.down('panel[name=valueselection]');
                            me.down('button[name=start]').hide();
                            me.down('button[name=abort]').hide();
                            me.down('button[name=close]').show();
                            result.setMaxHeight('400');
                            result.setHtml(me.resultMessage);
                            result.show();
                            values.hide();
                        }
                        me.fireEvent('statussetend');
                    },
                    failure: function(response) {
                        count++;
                        progress.updateProgress(count / me.selection.length);
                        if (count === me.selection.length) {
                            me.close();
                        }
                    }
                });
            }
        } else {
            if (this.record) {
                var data = {
                    messungsId: this.record.get('id'),
                    mstId: this.down('combobox').getValue(),
                    datum: new Date(),
                    statusKombi: kombi,
                    text: this.down('textarea').getValue()
                };
                Ext.Ajax.request({
                    url: 'lada-server/rest/status',
                    method: 'POST',
                    jsonData: data,
                    success: function(response) {
                        var i18n = Lada.getApplication().bundle;
                        var json = Ext.JSON.decode(response.responseText);

                        var probenform = Ext.ComponentQuery.query('probeform');
                        var hauptprobennummer = probenform[0].getRecord().get('hauptprobenNr');
                        var extPID = probenform[0].getRecord().get('externeProbeId');
                        var extMessungsId = Ext.ComponentQuery.query('messungform')[0].getRecord().get('externeMessungsId');
                        me.resultMessage += '<strong>' + i18n.getMsg('hauptprobenNr') + ' - ' + i18n.getMsg('nebenprobenNr') + ': ';
                        me.resultMessage += hauptprobennummer || '';
                        me.resultMessage += ' - ';
                        me.resultMessage +=  me.record.get('nebenprobenNr') || '';
                        me.resultMessage += '</strong><br><dd>' + i18n.getMsg('status-' + json.message) + '</dd><br>';
                        progress.updateProgress(1, progressText + ' (' + 1 + ')');
                        var errors = json.errors;
                        var out = [];
                        var numErrors;
                        if (!Ext.isObject(errors)) {
                            numErrors = 0;
                        } else {
                            numErrors = Object.keys(errors).length;
                        }
                        if (numErrors > 0) {
                            var msgs;
                            out.push('<ul>');
                            for (var key in errors) {
                                msgs = errors[key];
                                var validation = [];
                                for (var i = msgs.length - 1; i >= 0; i--) {
                                        validation.push('<li><b>' + i18n.getMsg(key) + ':</b> ' + i18n.getMsg(msgs[i].toString()) + '</li>');
                                }
                                out.push(validation.join(''));
                            }
                            out.push('</ul>');
                            out.push('<br/>');
                        }
                        var result = me.down('panel[name=result]');
                        var values = me.down('panel[name=valueselection]');
                        me.down('button[name=start]').hide();
                        me.down('button[name=abort]').hide();
                        me.down('button[name=close]').show();
                        me.resultMessage += out.join('');
                        result.setHtml(me.resultMessage);
                        result.setSize(values.getWidth(), values.getHeight());
                        result.show();
                        var grids = Ext.ComponentQuery.query('statusgrid');
                        if (grids.length) {
                            grids[0].store.reload();
                        }
                        me.fireEvent('statussetend');
                    },
                    failure: function(response) {
                        me.resultMessage += '<strong>Ein interner Fehler ist aufgetreten' ;
                        var result = me.down('panel[name=result]');
                        result.setHtml(me.resultMessage);
                    }
                });
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
                }
            }
        });
    }
});

