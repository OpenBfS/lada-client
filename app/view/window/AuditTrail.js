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

    dateItems: [
        'probeentnahme_beginn',
        'probeentnahme_ende',
        'solldatum_beginn',
        'solldatum_ende',
        'messzeitpunkt',
        'datum'
    ],


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

        me.title = i18n.getMsg('audit.title');
        me.buttons = [{
            text: i18n.getMsg('close'),
            scope: me,
            handler: me.close
        }];
        me.items = [{
            border: false,
            //autoscroll: true,
            overflowY: 'auto',
            items: [{
                border: false,
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
            success: this.loadSuccess
            // failure: this.loadFailure //TODO does not exist
        });
    },

    loadSuccess: function(response) {
        var i18n = Lada.getApplication().bundle;
        var json = Ext.decode(response.responseText);
        var container = this.down('panel[name=auditcontainer]');
        if (!json.success) {
            var html = '<p><strong>' + i18n.getMsg(json.message.toString())
                + '</strong></p>';
            container.update(html);
        } else {
            if (this.type === 'probe') {
                var html = this.createHtmlProbe(json);
                container.update(html);
            } else if (this.type === 'messung') {
                container.update(this.createHtmlMessung(json));
            }
        }
    },

    createHtmlProbe: function(json) {
        var i18n = Lada.getApplication().bundle;
        var html = '<p><strong>Probe: ' + json.data.identifier + '</strong><br></p>';
        var audit = json.data.audit;
        if (audit.length === 0) {
            html += '<p>Keine Änderungen</p>';
        } else {
            if (audit.length > 1) {
                audit.sort(function(a, b) {
                    return b.timestamp - a.timestamp;
                });
            }
            for (var i = 0; i < audit.length; i++) {
                html += '<p style="margin-bottom:0"><b>' + i18n.getMsg('date') + ': ' +
                (Ext.Date.format(new Date(audit[i].timestamp), 'd.m.Y H:i')) + '</b>';
                if (!Ext.isObject(audit[i].identifier)) {
                    if (audit[i].type !== 'probe') {
                        html += '<br>' + i18n.getMsg(audit[i].type) + ': ';
                        html += audit[i].identifier;
                    }
                } else {
                    html += '<br>' + i18n.getMsg('messung') + ': ' +
                        audit[i].identifier.messung + ' -> ' +
                        i18n.getMsg(audit[i].type) + ': ' +
                        audit[i].identifier.identifier;

                }
                html += this.createHtmlChangedFields(audit[i]);
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
        } else {
            if (audit.length > 1) {
                audit.sort(function(a, b) {
                    return b.timestamp - a.timestamp;
                });
            }
            for (var i = 0; i < audit.length; i++) {
                html += '<p style="margin-bottom:0"><b>' + i18n.getMsg('date') + ': ' +
                (Ext.Date.format(new Date(audit[i].timestamp), 'd.m.Y H:i')) + '</b>';
                if (audit[i].type !== 'messung') {
                    html += '<br>' + i18n.getMsg(audit[i].type) + ': ';
                    html += audit[i].identifier;
                }
                html += this.createHtmlChangedFields(audit[i]);
            }
        }
        return html;
    },

    createHtmlChangedFields: function(audit) {
        var i18n = Lada.getApplication().bundle;
        var html = '<br>' + i18n.getMsg(audit.action)
            + '<br><div style="margin-left:2em;">';

        for (var key in audit.changedFields) {
            var value = '';
            if (Ext.Array.contains(this.dateItems, key)) {
                value = Ext.Date.format(new Date(audit.changedFields[key]),
                    'd.m.Y H:i');
            } else {
                value = audit.changedFields[key];
            }
            if (value === null || value === '') {
                value = i18n.getMsg('noValue');
            } else if (value === true) {
                value = i18n.getMsg('true');
            } else if (value === false) {
                value = i18n.getMsg('false');
            }
            if (key === 'messwert' ||
                key === 'messwert_pzs' ||
                key === 'nwg_zu_messwert'
            ) {
                var strValue = value.toExponential(2).toString()
                    .replace('.', Ext.util.Format.decimalSeparator);
                var splitted = strValue.split('e');
                var exponent = parseInt(splitted[1],10);
                value = splitted[0] + 'e'
                    + ((exponent < 0) ? '-' : '+')
                    + ((Math.abs(exponent) < 10) ? '0' : '')
                    + Math.abs(exponent).toString();
            }
            html += '' + i18n.getMsg(key) + ': ' +
                value + '<br>';
        }
        html += '</div>';
        html += '</p>';
        return html;
    }
});
