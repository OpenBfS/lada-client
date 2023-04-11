/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to show a confirmation dialog to delete a Probe and a progress bar
 * after confirmation
 */
Ext.define('Lada.view.window.DeleteMultipleItems', {
    extend: 'Ext.window.Window',
    alias: 'widget.deleteMultipleItems',

    collapsible: true,
    maximizable: true,
    autoShow: true,
    layout: 'vbox',
    constrain: true,
    selection: null,
    parentWindow: null,
    confWin: null,
    maxSteps: 0,
    currentProgress: 0,

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
            }
        });
        this.items = [{
            xtype: 'panel',
            height: 300,
            width: 500,
            autoScroll: true,
            overflow: 'auto',
            html: '',
            margin: '5, 5, 5, 5'
        }, {
            xtype: 'progressbar',
            text: i18n.getMsg('progress'),
            height: 25,
            width: 340,
            hidden: false,
            margin: '5, 5, 5, 5'
        }];
        var title = '';
        var dialog1 = '';
        var dialog2 = i18n.getMsg('delete.multiple.warning');

        switch (this.parentGrid.rowtarget.dataType) {
            case 'probeId':
                title = i18n.getMsg('delete.multiple_probe.window.title');
                dialog1 = i18n.getMsg('delete.multiple_probe');
                break;
            case 'mpId':
                title = i18n.getMsg('delete.multiple_mpr.window.title');
                dialog1 = i18n.getMsg('delete.multiple_mpr');
                break;
            case 'probenehmer':
                title = i18n.getMsg('delete.multiple_probenehmer.window.title');
                dialog1 = i18n.getMsg('delete.multiple_probenehmer');
                break;
            case 'dsatzerz':
                title = i18n.getMsg(
                    'delete.multiple_datensatzerzeuger.window.title');
                dialog1 = i18n.getMsg('delete.multiple_datensatzerzeuger');
                break;
            case 'mprkat':
                title = i18n.getMsg('delete.multiple_mpr_kat.window.title');
                dialog1 = i18n.getMsg('delete.multiple_mpr_kat');
                break;
            case 'ortId':
                title = i18n.getMsg('delete.multiple_ort.window.title');
                dialog1 = i18n.getMsg('delete.multiple_ort');
                break;
            case 'messungId':
                title = i18n.getMsg('delete.multiple_messung.window.title');
                dialog1 = i18n.getMsg('delete.multiple_messung');
                break;
            case 'tagId':
                title = i18n.getMsg('delete.multiple_tag.window.title');
                dialog1 = i18n.getMsg('delete.multiple_tag');
                break;


        }
        var me = this;
        this.confWin = Ext.create('Ext.window.Window', {
            title: title,
            zIndex: 1,
            items: [{
                xtype: 'panel',
                border: false,
                margin: 5,
                layout: 'fit',
                html: '<p>'
                    + dialog1
                    + '<br/>'
                    + '<br/>'
                    + dialog2
                    + '</p>'
            }, {
                xtype: 'panel',
                layout: 'hbox',
                items: [{
                    xtype: 'button',
                    margin: '5, 5, 5, 5',
                    text: i18n.getMsg('cancel'),
                    scope: me,
                    handler: function() {
                        me.confWin.close();
                        me.close();
                    }
                }, {
                    xtype: 'button',
                    margin: '5, 5, 5, 5',
                    text: i18n.getMsg('delete'),
                    handler: function(btn) {
                        me.confWin.close();
                        me.startDelete(btn);
                    }
                }]
            }]
        });
        this.callParent(arguments);
    },

    /**
     * Refreshes Dynamic grid
     */
    refresh: function() {
        if (this.parentGrid) {
            var qp = Ext.ComponentQuery.query('querypanel')[0];
            var qp_button = Ext.ComponentQuery.query('button', qp)[0];
            var queryController = Lada.app.getController(
                'Lada.controller.Query');
            queryController.search(qp_button);
        }
    },

    /**
     * Shows window
     */
    show: function() {
        this.callParent(arguments);
        this.confWin.show();
        this.confWin.toFront();
    },

    /**
     * Finish deletion of all selected items
     */
    finishDelete: function() {
        var me = this;
        me.refresh();
        me.down('progressbar').hide();
        me.add({
            xtype: 'button',
            margin: '5, 5, 5, 5',
            text: Lada.getApplication().bundle.getMsg('close'),
            handler: function() {
                me.close();
            }
        });
    },

    /**
     * Initiates deletion of all selected items
     */
    startDelete: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        me.maxSteps = me.selection.length;
        me.down('progressbar').show();
        var url = Lada.model.LadaBase.schema.getUrlPrefix();
        var datatype = '';

        switch (me.parentGrid.rowtarget.dataType) {
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
        for (var i = 0; i < me.selection.length; i++) {
            var id = me.selection[i].get(me.parentGrid.rowtarget.dataIndex);
            Ext.Ajax.request({
                url: url + '/' + id,
                method: 'DELETE',
                success: function(resp) {
                    var delId = resp.request.url.split('/').pop();

                    /* Remove successfully deleted items from store
                     * (and thus from grid) to avoid obsolete items in
                     * grid, if not refreshed immediately */
                    var store = me.parentGrid.getStore();
                    var delIdx = store.find(
                        me.parentGrid.rowtarget.dataIndex,
                        delId, 0, false, true, true);
                    if (delIdx > -1) {
                        store.removeAt(delIdx);
                    }

                    var html = me.down('panel').html;
                    html = html +
                        i18n.getMsg(
                            'deleteItems.callback.success',
                            datatype,
                            delId) +
                        '<br>';
                    me.down('panel').setHtml(html);
                    me.currentProgress += 1;
                    me.down('progressbar').updateProgress(
                        me.currentProgress / me.maxSteps);
                    if (me.currentProgress === me.maxSteps) {
                        me.finishDelete();
                    }
                },
                failure: function(resp) {
                    var delId = resp.request.url.split('/').pop();
                    var html = me.down('panel').html;
                    me.currentProgress += 1;
                    me.down('progressbar').updateProgress(
                        me.currentProgress / me.maxSteps);
                    html += i18n.getMsg(
                        'deleteItems.callback.failure', datatype, delId)
                        + i18n.getMsg('200') + '<br>';
                    me.down('panel').setHtml(html);
                    if (me.currentProgress === me.maxSteps) {
                        me.finishDelete();
                    }
                }
            });
        }
    }
});

