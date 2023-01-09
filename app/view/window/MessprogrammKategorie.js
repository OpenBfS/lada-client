/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to create/edit a MessprogrammKategorie
 */
Ext.define('Lada.view.window.MessprogrammKategorie', {
    extend: 'Lada.view.window.RecordWindow',
    alias: 'widget.mprkatedit',

    requires: [
        'Lada.view.window.HelpprintWindow',
        'Lada.view.form.MessprogrammKategorie'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: false,
    autoScroll: true,
    layout: 'fit',
    constrain: true,

    record: null,
    recordType: 'messprogrammkategorie',

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('mk.dialogTitle');

        this.on({
            activate: function() {
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function() {
                this.getEl().addCls('window-inactive');
            }
        });

        this.tools = [{
            type: 'help',
            tooltip: i18n.getMsg('help.qtip'),
            titlePosition: 0,
            callback: function() {
                var imprintWin = Ext.ComponentQuery.query(
                    'k-window-imprint')[0];
                if (!imprintWin) {
                    imprintWin = Ext.create(
                        'Lada.view.window.HelpprintWindow')
                        .show();
                    imprintWin.on('afterlayout', function() {
                        var imprintWinController = this.getController();
                        imprintWinController.setTopic('messprogrammkategorie');
                    }, imprintWin, {single: true});
                } else {
                    // BasiGX.util.Animate.shake(imprintWin);
                    var imprintWinController = imprintWin.getController();
                    imprintWinController.shake(imprintWin);
                    imprintWinController.setTopic('messprogrammkategorie');
                }
            }
        }];
        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }];
        this.modelClass = Lada.model.MpgCateg;
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
        this.add([{
            border: false,
            layout: 'fit',
            items: [{
                xtype: 'mprkatform',
                record: this.record
            }]
        }]);
    },

    /**
     * Instructs the fields / forms listed in this method to set a message.
     * @param errors These Errors shall be shown
     * @param warnings These Warning shall be shown
     */
    setMessages: function(errors, warnings) {
        this.down('mprkatform').setMessages(errors, warnings);
    },

    /**
     * Instructs the fields / forms listed in this method to clear their
     * messages.
     */
    clearMessages: function() {
        this.down('mprkatform').clearMessages();
    }
});
