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
    alias: 'widget.audittrail',

    layout: 'fit',
    padding: '10 5 3 10',
    width: 400,
    height: 500,
    constrain: true,

    type: null,

    objectId: null,
    titleText: null,

    /**
     * @private
     * A pending request object
     */
    pendingRequest: null,

    dateItems: [
        'sample_start_date',
        'sample_end_date',
        'sched_start_date',
        'sched_end_date',
        'measm_start_date',
        'date'
    ],

    /**
     * Types that have a date string as identifier.
     */
    dateIdentifier: [
        'comm_sample',
        'comm_measm'
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
                me.removeCls('x-unselectable');
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
        Ext.on('timezonetoggled', this.handleTimezoneToggled, this);
    },

    handleTimezoneToggled: function() {
        if (this.type === null || this.objectId === null) {
            return;
        }
        this.pendingRequest = Ext.Ajax.request({
            url: 'lada-server/rest/audit/' + this.type + '/' + this.objectId,
            method: 'GET',
            scope: this,
            callback: function(options, success, response) {
                Ext.ComponentQuery.query(
                    'timezonebutton[action=toggletimezone]')[0]
                    .requestFinished();
                if (success) {
                    this.loadSuccess(response);
                } else {
                    this.loadFailure(response);
                }
            }
        });
    },

    initData: function() {
        if (this.type === null || this.objectId === null) {
            return;
        }
        this.showLoadingMask();
        Ext.Ajax.request({
            url: 'lada-server/rest/audit/' + this.type + '/' + this.objectId,
            method: 'GET',
            scope: this,
            success: this.loadSuccess,
            failure: this.loadFailure
        });
    },

    loadSuccess: function(response) {
        var i18n = Lada.getApplication().bundle;
        var json = Ext.decode(response.responseText);
        var container = this.down('panel[name=auditcontainer]');
        var title;
        switch (this.type) {
            case 'probe':
                container.update(this.createHtmlProbe(json));
                title = i18n.getMsg('audit.title') + ' '
                + i18n.getMsg('probe') + ': ' + this.titleText;
                this.setTitle(title);
                break;
            case 'messung':
                container.update(this.createHtmlMessung(json));
                title = i18n.getMsg('audit.title') + ' ' + this.titleText;
                this.setTitle(title);
                break;
            case 'messprogramm':
                container.update(this.createHtmlMessprogramm(json));
        }
        Ext.ComponentQuery.query('panel#' + this.down('panel')
            .getId())[0].loadingMask.hide();
    },

    loadFailure: function() {
        var i18n = Lada.getApplication().bundle;
        var container = this.down('panel[name=auditcontainer]');
        var html = '<p><strong>' + i18n.getMsg('err.msg.generic.title')
            + '</strong></p>' + i18n.getMsg('err.msg.generic.body');
        container.update(html);
    },

    createHtmlProbe: function(json) {
        var i18n = Lada.getApplication().bundle;
        var html = '<p><strong>Probe: ' +
            json.identifier +
            '</strong><br></p>';
        var audit = json.audit;
        if (audit.length === 0) {
            html += '<p>Keine Änderungen</p>';
        } else {
            if (audit.length > 1) {
                audit.sort(function(a, b) {
                    return b.timestamp - a.timestamp;
                });
            }
            for (var i = 0; i < audit.length; i++) {
                html += '<p style="margin-bottom:0"><b>' +
                    i18n.getMsg('date') +
                    ': ' +
                    Lada.util.Date.formatTimestamp(
                        audit[i].timestamp, 'd.m.Y H:i', true) +
                    '</b>';
                if (!Ext.isObject(audit[i].identifier)) {
                    if (audit[i].type !== 'sample') {
                        html += '<br>' + i18n.getMsg(audit[i].type) + ': ';
                        html += audit[i].identifier === '(deleted)' ?
                            i18n.getMsg('deleted') :
                            this.getIdentifier(audit[i]);
                    }
                } else {
                    html += '<br>' + i18n.getMsg('messung') + ': ' +
                        audit[i].identifier.measm + ' -> ' +
                        i18n.getMsg(audit[i].type) + ': ' +
                        this.getIdentifier(audit[i]);

                }
                html += this.createHtmlChangedFields(audit[i]);
            }
        }
        return html;
    },

    createHtmlMessung: function(json) {
        var i18n = Lada.getApplication().bundle;
        var html = '<p><strong>Messung: ' +
            json.identifier +
            '</strong><br></p>';
        var audit = json.audit;
        if (audit.length === 0) {
            html += '<p>Keine Änderungen</p>';
        } else {
            if (audit.length > 1) {
                audit.sort(function(a, b) {
                    return b.timestamp - a.timestamp;
                });
            }
            for (var i = 0; i < audit.length; i++) {
                html += '<p style="margin-bottom:0"><b>' +
                    i18n.getMsg('date') +
                    ': ' +
                    Lada.util.Date.formatTimestamp(
                        audit[i].timestamp, 'd.m.Y H:i', true) +
                    '</b>';
                if (audit[i].type !== 'measm') {
                    html += '<br>' + i18n.getMsg(audit[i].type) + ': ';
                    html += audit[i].identifier === '(deleted)' ?
                        i18n.getMsg('deleted') :
                        audit[i].identifier;
                }
                html += this.createHtmlChangedFields(audit[i]);
            }
        }
        return html;
    },

    createHtmlMessprogramm: function(json) {
        var i18n = Lada.getApplication().bundle;
        var html = '<p><strong>Messprogramm: '
                + json.id + '</strong><br></p>';
        var audit = json.audit;
        if (audit.length === 0) {
            html += '<p>Keine Änderungen</p>';
        } else {
            if (audit.length > 1) {
                audit.sort(function(a, b) {
                    return b.timestamp - a.timestamp;
                });
            }
            for (var i = 0; i < audit.length; i++) {
                html += '<p style="margin-bottom:0"><b>' + i18n.getMsg('date')
                        + ': '
                        + (Ext.Date.format(
                            new Date(audit[i].timestamp), 'd.m.Y H:i'))
                        + '</b>';
                if (audit[i].type !== 'mpg') {
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
                if (key === 'sched_start_date' || key === 'sched_end_date') {
                    value = Lada.util.Date.formatTimestamp(
                        audit.changedFields[key], 'd.m.Y', true);
                } else {
                    value = Lada.util.Date.formatTimestamp(
                        audit.changedFields[key], 'd.m.Y H:i', true);
                }
            } else {
                value = audit.changedFields[key];
            }
            if (value === null || value === '') {
                value = i18n.getMsg('noValue');
            } else if (value === true) {
                value = i18n.getMsg('true');
            } else if (value === false) {
                value = i18n.getMsg('false');
            } else if (key === 'meas_val' ||
                key === 'detect_lim'
            ) {
                var strValue = Lada.getApplication().toExponentialString(
                    value, 2)
                    .replace('.', Ext.util.Format.decimalSeparator);
                var splitted = strValue.split('e');
                var exponent = parseInt(splitted[1], 10);
                value = splitted[0] + 'e'
                    + ((exponent < 0) ? '-' : '+')
                    + ((Math.abs(exponent) < 10) ? '0' : '')
                    + Math.abs(exponent).toString();
            }
            if (key === 'ext_id') {
                switch (audit.type) {
                    case 'probe':
                        html += '' + i18n.getMsg('sample.ext_id') + ': ' +
                            value + '<br>';
                        break;
                    case 'messung':
                        html += '' + i18n.getMsg('measm.ext_id') + ': ' +
                            value + '<br>';
                        break;
                }
            } else {
                html += '' + i18n.getMsg(key) + ': ' +
                    value + '<br>';
            }
        }
        html += '</div>';
        html += '</p>';
        return html;
    },

    close: function() {
        if (this.pendingRequest) {
            this.pendingRequest.abort();
        }
        this.callParent(arguments);
    },

    showLoadingMask: function() {
        var at = this.down('panel');
        if (!at.loadingMask) {
            at.loadingMask = Ext.create('Ext.LoadMask', {
                target: at
            });
        }
        at.loadingMask.show();
    },

    /**
     * Get the identier of the given audit entry.
     *
     * If identifier is a date, convert to local time
     * @param {*} auditEntry Audit Entry
     * @returns Identifier string.
     */
    getIdentifier: function(auditEntry) {
        var id = !Ext.isObject(auditEntry.identifier)
            ? auditEntry.identifier
            : auditEntry.identifier.identifier;
        if (Ext.Array.contains(this.dateIdentifier, auditEntry.type)) {
            id = Lada.util.Date.formatTimestamp(
                id.replaceAll('"', ''),
                'd.m.Y H:i', true);
            id = '"' + id + '"';
        }
        return id;
    }
});
