/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Window to edit a Probe
 */
Ext.define('Lada.view.window.ProbeEdit', {
    extend: 'Ext.window.Window',
    alias: 'widget.probenedit',

    requires: [
        'Lada.view.form.Probe',
        'Lada.view.grid.Ort',
        'Lada.view.grid.Probenzusatzwert',
        'Lada.view.grid.PKommentar',
        'Lada.view.grid.Messungen'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: true,
    autoScroll: true,
    layout: 'fit',

    record: null,

    initComponent: function() {
        if (this.record === null) {
            Ext.Msg.alert('Keine valide Probe ausgewählt!');
            this.callParent(arguments);
            return;
        }
        this.title = '§3-Probe ' + this.record.get('probeId');
        this.buttons = [{
            text: 'Schließen',
            scope: this,
            handler: this.close
        }];
        this.width = 700;
        this.height = Ext.getBody().getViewSize().height - 30;
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "modelId" param to load the correct item.

        this.items = [{
            border: 0,
            autoScroll: true,
            items: [{
                xtype: 'probeform',
                recordId: this.record.get('id')
            }, {
                xtype: 'fset',
                name: 'orte',
                title: 'Ortsangaben',
                padding: '5, 5',
                margin: 5,
                items: [{
                    xtype: 'ortgrid',
                    recordId: this.record.get('id')
                }]
            }, {
                xtype: 'fset',
                name: 'probenzusaetzwerte',
                title: 'Zusatzwerte',
                padding: '5, 5',
                margin: 5,
                collapsible: true,
                collapsed: true,
                items: [{
                    xtype: 'probenzusatzwertgrid',
                    recordId: this.record.get('id')
                }]
            }, {
                xtype: 'fset',
                name: 'pkommentare',
                title: 'Kommentare',
                padding: '5, 5',
                margin: 5,
                collapsible: true,
                collapsed: true,
                items: [{
                    xtype: 'pkommentargrid',
                    recordId: this.record.get('id')
                }]
             }, {
                xtype: 'fset',
                name: 'messungen',
                title: 'Messungen',
                padding: '5, 5',
                margin: 5,
                collapsible: false,
                collapsed: false,
                items: [{
                    xtype: 'messungengrid',
                    recordId: this.record.get('id')
                }]
            }]
        }];
        this.callParent(arguments);
    },

    initData: function() {
        this.clearMessages();
        Ext.ClassManager.get('Lada.model.Probe').load(this.record.get('id'), {
            failure: function(record, action) {
                // TODO
            },
            success: function(record, response) {
                this.down('probeform').setRecord(record);
                var json = Ext.decode(response.response.responseText);
                if (json) {
                    this.setMessages(json.errors, json.warnings);
                }
            },
            scope: this
        });
    },

    setMessages: function(errors, warnings) {
        this.down('probeform').setMessages(errors, warnings);
        var errorOrtText = '';
        var errorOrt = false;
        var warningOrtText = '';
        var warningOrt = false;
        var key;
        var content;
        var i;
        var keyText;
        var i18n = Lada.getApplication().bundle;
        for (key in errors) {
            if (key && key.contains('Ort')) {
                errorOrt = true;
                content = errors[key];
                keyText = i18n.getMsg(key);
                for (i = 0; i < content.length; i++) {
                    errorOrtText += keyText + ': ' +
                        i18n.getMsg(content[i].toString()) + '\n';
                }
            }
        }
        for (key in warnings) {
            if (key && key.contains('Ort')) {
                warningOrt = true;
                content = warnings[key];
                keyText = i18n.getMsg(key);
                for (i = 0; i < content.length; i++) {
                    warningOrtText += keyText + ': ' +
                        i18n.getMsg(content[i].toString()) + '\n';
                }
            }
        }
        this.down('fset[name=orte]').showWarningOrError(
            warningOrt,
            warningOrtText === '' ? null : warningOrtText,
            errorOrt,
            errorOrtText === '' ? null : errorOrtText);
    },

    clearMessages: function() {
        this.down('probeform').clearMessages();
        this.down('fset[name=orte]').clearMessages();
    }
});
