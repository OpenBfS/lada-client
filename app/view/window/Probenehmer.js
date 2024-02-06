/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to create/edit a Probenehmer
 */
Ext.define('Lada.view.window.Probenehmer', {
    extend: 'Lada.view.window.RecordWindow',
    alias: 'widget.probenehmeredit',

    requires: [
        'Lada.view.window.HelpprintWindow'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: false,
    autoScroll: true,
    layout: 'fit',
    constrain: true,

    width: 650,

    record: null,
    recordType: 'probenehmer',

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('pn.dialogTitle');

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
                        imprintWinController.setTopic('probenehmer');
                    }, imprintWin, {single: true});
                } else {
                    // BasiGX.util.Animate.shake(imprintWin);
                    var imprintWinController = imprintWin.getController();
                    imprintWinController.shake(imprintWin);
                    imprintWinController.setTopic('probenehmer');
                }
            }
        }];
        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }];
        this.modelClass = Lada.model.Sampler;
        this.callParent(arguments);
        if (this.record) {
            this.initData(this.record);
        }
    },

    /**
     * Init the window using the given record
     * @param {Lada.model.Probenehmer} record Record to use
     */
    initData: function(record) {
        this.record = record;
        this.initializeUi();
        this.down('probenehmerform').setMessages(
            record.get('errors'),
            record.get('warnings'),
            record.get('notifications')
        );
    },

    initializeUi: function() {
        this.removeAll();
        this.add([{
            border: false,
            layout: 'fit',
            items: [{
                xtype: 'probenehmerform',
                record: this.record
            }]
        }]);
    }
});
