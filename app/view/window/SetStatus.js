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
        'Lada.controller.SetStatus',
        'Lada.view.widget.StatuskombiSelect',
        'Lada.store.StatusKombi'
    ],

    controller: 'setstatus',

    store: Ext.create('Lada.store.StatusKombi'),
    grid: null,
    selection: null,

    sampleRecord: null,
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
                    displayField: 'name',
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
                handler: 'setStatus'
            }, {
                text: i18n.getMsg('cancel'),
                name: 'abort',
                handler: this.closeWindow
            }]
        }, {
            xtype: 'panel',
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

        //Set title
        var title = '';
        //If a sample record is set, this window is used from a measm window
        //else from the measm result grid
        if (this.sampleRecord === null) {
            title = i18n.getMsg('setStatus.count', this.selection.length);
        } else {
            var mainSampleId = this.sampleRecord.get('mainSampleId');
            var minSampleId = this.selection[0].get('minSampleId');
            var probenumber = mainSampleId
                ? i18n.getMsg('setStatus.sample.mainSampleId', mainSampleId)
                : i18n.getMsg('setStatus.sample.extId',
                    this.sampleRecord.get('extId'));
            var messungnumber = minSampleId
                ? i18n.getMsg('setStatus.measm.minSampleId', minSampleId)
                : i18n.getMsg('setStatus.measm.extId',
                    this.selection[0].get('extId'));
            title = i18n.getMsg('setStatus.hprnr',
                messungnumber,
                probenumber);
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

    getPossibleStatus: function(ids) {
        var me = this;
        Ext.Ajax.request({
            url: 'lada-server/rest/statusmp/getbyids',
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
            if (item.get('minSampleId') === undefined) {
                var probenumber = item.get('hpNr')
                    ? '<strong>' + i18n.getMsg('mainSampleId') + '</strong> '
                    + item.get('hpNr')
                    : item.get('extId')
                    ? '<strong>' + i18n.getMsg('extProbeId') + '</strong> '
                    + item.get('extId')
                    : '<strong>' + i18n.getMsg('mainSampleId')
                    + ' nicht definiert</strong> ';
                var messungsnumber = item.get('npNr')
                    ? '<strong>' + i18n.getMsg('minSampleId') + '</strong> '
                    + item.get('npNr')
                    : item.get('externeMessungsId')
                    ? '<strong>' + i18n.getMsg('measm.ext_id') + '</strong> '
                    + item.get('externeMessungsId')
                    : '<strong>' + i18n.getMsg('minSampleId')
                    + ' nicht definiert</strong> ';
                this.resultMessage +=
                        probenumber +
                        ' - ' + messungsnumber;
            }
        }
        this.resultMessage += text;
    }
});

