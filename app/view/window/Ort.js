/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window for new Ort, wraps around a {@link Lada.view.form.Ort}
 */
Ext.define('Lada.view.window.Ort', {
    extend: 'Lada.view.window.RecordWindow',
    alias: 'window.ort',
    requires: [
        'Lada.model.Site',
        'Lada.view.window.HelpprintWindow',
        'Lada.view.form.Ort'
    ],

    minWidth: 440,

    maxHeight: 700,

    margin: 10,

    shadow: false,

    border: false,

    bodyStyle: {background: '#fff'},

    layout: 'fit',

    mode: null,

    title: null,

    /** If set to true, he newly created Ort will be set as selected
     * Ortszuordnung
     */
    setOzOnComplete: false,

    /**
     * The record for the new Ort. Should be a {@link Lada.model.Ort}
     */
    record: null,

    recordType: 'ort',

    parentWindow: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('title.loading.ort');
        this.height = Ext.getBody().getViewSize().height - 30;
        this.tools = [{
            type: 'help',
            tooltip: i18n.getMsg('help.qtip'),
            callback: function() {
                var imprintWin = Ext.ComponentQuery.query(
                    'k-window-imprint')[0];
                if (!imprintWin) {
                    imprintWin = Ext.create(
                        'Lada.view.window.HelpprintWindow')
                        .show();
                    imprintWin.on('afterlayout', function() {
                        var imprintWinController = this.getController();
                        imprintWinController.setTopic('ort');
                    }, imprintWin, {single: true});
                } else {
                    var imprintWinController = imprintWin.getController();
                    imprintWinController.shake(imprintWin);
                    imprintWinController.setTopic('ort');
                }
            }
        }];
        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }];
        this.modelClass = Lada.model.Site;
        this.callParent(arguments);
        if (this.record) {
            this.initData(this.record);
        }
    },

    initData: function(record) {
        this.record = record;
        this.initializeUi();
    },

    initializeUi: function() {
        this.removeAll();
        if (this.record === null) {
            this.record = Ext.create('Lada.model.Site');
        }

        this.add([{
            xtype: 'ortform',
            record: this.record
        }]);

        this.setTitleAndReadOnly();
    },

    setTitleAndReadOnly: function() {
        var i18n = Lada.getApplication().bundle;

        var title = '';
        if (this.record.phantom) {
            title = i18n.getMsg('orte.new');
        } else {
            if (this.parentWindow !== null
                && (this.parentWindow.xtype === 'ortszuordnungwindow'
                    || this.parentWindow.xtype === 'ortstammdatengrid')
                || this.record.get('readonly')
            ) {
                this.down('ortform').setReadOnly(true);
                title = i18n.getMsg('orte.show');
            } else {
                title = i18n.getMsg('orte.edit');
            }
            title += ' - ' + i18n.getMsg('orte.ortId') + ': ' +
                this.record.get('extId');
        }

        this.setTitle(title);
    }
});
