/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window with information about history of probe/messung objects..
 */
Ext.define('Lada.view.window.AuditTrail', {
    extend: 'Ext.window.Window',

    layout: 'fit',

    width: 300,
    height: 300,

    type: null,

    objectId: null,


    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        me.on({
            show: function() {
                me.initData();
            }
        });

        me.title = i18n.getMsg("audit.title");
        me.buttons = [{
            text: i18n.getMsg('close'),
            scope: me,
            handler: me.close
        }];
        me.items = [{
            border: 0,
            //autoscroll: true,
            overflowY: 'auto',
            items: [{
                border: 0,
                name: 'auditcontainer'
            }]
        }];
        me.callParent(arguments);
    },

    initData: function() {
        if (this.type === null || this.objectId === null) {
            return;
        }
        Ext.Ajax.request({
            url: 'lada-server/rest/audit/' + this.type + '/' + this.objectId,
            method: 'GET',
            scope: this,
            success: this.loadSuccess,
            failure: this.loadFailure
        });
    },

    loadSuccess: function(response) {
        var json = Ext.decode(response.responseText);
        var container = this.down('panel[name=auditcontainer]');
        if (this.type === 'probe') {
            var html = this.createHtmlProbe(json);
            container.update(html);
        }
        else if (this.type === 'messung') {
            container.update(this.createHtmlMessung(json));
        }
    },

    createHtmlProbe: function(json) {
        var i18n = Lada.getApplication().bundle;
        var html = '<p><strong>Probe: ' + json.data.identifier + '</strong><br></p>';
        var audit = json.data.audit;
        if (audit.length === 0) {
            html += '<p>Keine Änderungen</p>';
        }
        else {
            for (var i = 0; i < audit.length; i++) {
                html += '<p style="margin-bottom:0"><b>' + i18n.getMsg('date') + ': ' +
                (Ext.Date.format(new Date(audit[i].timestamp), 'd.m.Y H:i')) + '</b>';
                if (!Ext.isObject(audit[i].identifier)) {
                    if (audit[i].type !== 'probe') {
                        html += '<br>' + i18n.getMsg(audit[i].type) + ': ';
                        html += audit[i].identifier;
                    }
                }
                else {
                    html += '<br>' + i18n.getMsg('messung') + ': ' +
                        audit[i].identifier.messung + ' -> ' +
                        i18n.getMsg(audit[i].type) + ': ' +
                        audit[i].identifier.identifier;

                }
                html += '<br>geändert<br><div style="margin-left:2em;">'
                for (var key in audit[i].changedFields) {
                    html += '' + i18n.getMsg(key) + ': ' +
                        audit[i].changedFields[key] + '<br>';
                }
                html += '</div>';
                html += '</p>';
            }
        }
        return html;
    },

    createHtmlMessung: function(json) {
        var i18n = Lada.getApplication().bundle;
        var html = '<p><strong>Messung: ' + json.data.identifier + '</strong><br></p>';
        var audit = json.data.audit;
        if (audit.length === 0) {
            html += '<p>Keine Änderungen</p>';
        }
        else {
            for (var i = 0; i < audit.length; i++) {
                html += '<p style="margin-bottom:0"><b>' + i18n.getMsg('date') + ': ' +
                (Ext.Date.format(new Date(audit[i].timestamp), 'd.m.Y H:i')) + '</b>';
                if (audit[i].type !== 'messung') {
                    html += '<br>' + i18n.getMsg(audit[i].type) + ': ';
                    html += audit[i].identifier;
                }
                html += '<br>geändert<br><div style="margin-left:2em;">'
                for (var key in audit[i].changedFields) {
                    html += '' + i18n.getMsg(key) + ': ' +
                        audit[i].changedFields[key] + '<br>';
                }
                html += '</div>';
                html += '</p>';
            }
        }
        return html;
    }
});