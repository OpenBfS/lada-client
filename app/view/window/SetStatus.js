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
        'Lada.view.widget.Status'
    ],

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
        var statusWerteStore = Ext.create('Lada.store.StatusWerte');
        if ( this.selection) {
            statusWerteStore.load({
                params: {
                    messungsId: Ext.Array.pluck(this.selection, 'id').toString()
                }
            });
        } else {
            statusWerteStore.load({
                params: {
                    messungsId: this.record.get('id')
                }
            });
        }
        this.items = [{
            xtype: 'form',
            name: 'valueselection',
            border: 0,
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
                    width: 300,
                    labelWidth: 100,
                    emptyText: 'Wählen Sie einen Erzeuger aus.',
                    fieldLabel: i18n.getMsg('statusgrid.header.erzeuger')
                }, {
                    xtype: 'statuswert',
                    store: statusWerteStore,
                    allowBlank: false,
                    width: 300,
                    labelWidth: 100,
                    fieldLabel: i18n.getMsg('statusgrid.header.statusWert')
                }, {
                    xtype: 'combobox',
                    name: 'statusstufe',
                    store: Ext.data.StoreManager.get('statusstufe'),
                    displayField: 'stufe',
                    valueField: 'id',
                    allowBlank: false,
                    editable: false,
                    forceSelection: true,
                    width: 300,
                    labelWidth: 100,
                    fieldLabel: i18n.getMsg('statusgrid.header.statusStufe')
                }, {
                    xtype: 'textarea',
                    width: 300,
                    height: 100,
                    labelWidth: 100,
                    fieldLabel: i18n.getMsg('statusgrid.header.text'),
                    emptyText: 'Geben Sie einen Kommentar ein.'
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
            hidden: true,
            margin: '5, 5, 5, 5',
            overflow: 'auto',
            name: 'result'
        }, {
            xtype: 'progressbar',
            margin: '5, 5, 5, 5',
            hidden: true,
            text: 'Verarbeite Statusänderungen'
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
                    title = 'Status für Messung ' + hauptprobennummer +
                ' - ' + me.record.get('nebenprobenNr') + ' setzen';
                }
            }
        } else {
            title = 'Status für ' + this.selection.length + ' Messung(en) setzen';
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

        var wert = me.down('statuswert').getValue();
        var stufe = me.down('[name=statusstufe]').getValue();
        var kombis = Ext.data.StoreManager.get('statuskombi');
        var kombiIdx = kombis.findBy(function(record) {
            return record.get('statusStufe').id === stufe
                && record.get('statusWert').id === wert;
        });
        if (kombiIdx < 0) {
            Ext.Msg.alert(i18n.getMsg('err.msg.generic.title'),
                'Unerlaubte Kombination aus Status und Stufe');
            me.down('button[name=close]').show();
            return;
        }
        if (this.selection) {
            for (var i = 0; i < this.selection.length; i++) {
                var data = {
                    messungsId: this.selection[i].get('id'),
                    mstId: this.down('combobox').getValue(),
                    datum: new Date(),
                    statusKombi: kombis.getAt(kombiIdx).get('id'),
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
                        me.resultMessage += sel.get('hauptprobenNr') + ' - ' + sel.get('nebenprobenNr') + '</strong><br><dd>';
                        me.resultMessage += i18n.getMsg('status-' + json.message) + '</dd><br>';
                        count++;
                        progress.updateProgress(count / me.selection.length, progressText + ' (' + count + ')');
                        if (count === me.selection.length) {
                            var result = me.down('panel[name=result]');
                            var values = me.down('panel[name=valueselection]');
                            me.down('button[name=start]').hide();
                            me.down('button[name=abort]').hide();
                            me.down('button[name=close]').show();
                            result.setSize(values.getWidth(), values.getHeight());
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
                var me = this;
                var data = {
                    messungsId: this.record.get('id'),
                    mstId: this.down('combobox').getValue(),
                    datum: new Date(),
                    statusKombi: kombis.getAt(kombiIdx).get('id'),
                    text: this.down('textarea').getValue()
                };
                Ext.Ajax.request({ //TODO not checked yet
                    url: 'lada-server/rest/status',
                    method: 'POST',
                    jsonData: data,
                    success: function(response) {
                        var json = Ext.JSON.decode(response.responseText);
                        var probenform = Ext.ComponentQuery.query('probeform');
                        var hauptprobennummer = probenform[0].getRecord().get('hauptprobenNr');
                        me.resultMessage += '<strong>' + i18n.getMsg('messung') + ': ';
                        me.resultMessage += hauptprobennummer || '';
                        me.resultMessage += ' - ' + me.record.get('nebenprobenNr') +
                          '</strong><br><dd>' +
                          i18n.getMsg('status-' + json.message) + '</dd><br>';
                        progress.updateProgress(1, progressText + ' (' + 1 + ')');
                        var result = me.down('panel[name=result]');
                        var values = me.down('panel[name=valueselection]');
                        me.down('button[name=start]').hide();
                        me.down('button[name=abort]').hide();
                        me.down('button[name=close]').show();
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
                        // TODO
                    }
                });
            }
        }
    }
});

