/**
 * This Window is shown, when Proben could be imported from a LAF file
 */
Ext.define('Lada.view.window.ImportResponse', {
    extend: 'Ext.window.Window',
    alias: 'widget.importresponse',

    responseData: '',
    message: '',
    fileName: '',

    layout: 'fit',
    /**
     * @private
     * Initialize the view.
     */
    initComponent: function() {
        var me = this;
        var html;
        var download;
        var i18n = Lada.getApplication().bundle;
        try {
            var data = Ext.decode(me.responseData);
        } catch (e) {
            var data = null;
        }
        if (data) {
            html = me.parseShortResponse(data);
        } else {
            html = 'Der Import der Datei ' + this.fileName +
                    ' war nicht erfolgreich.';
        }
        this.bodyStyle = {background: '#fff'};
        me.items = [{
            xtype: 'panel',
            html: html,
            margin: 10,
            border: false
        }];

        me.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            name: 'close',
            handler: this.close
        }, {
            text: i18n.getMsg('download'),
            name: 'download',
            disabled: true,
            handler: function() {
                var blob = new Blob([download],{type: 'text/html'});
                saveAs(blob, 'report.html');
            }
        }];
        this.callParent(arguments);
        if (data) {
            download = me.parseResponse(data);
        }
    },

    /**
     * Parse the response and create a summary of the result
     * @param data
     */
    parseShortResponse: function(data) {
        var errors = data.data.errors;
        var warnings = data.data.warnings;
        var out = [];
        // There is a entry for each imported proben in the errors dict (might be
        // empty)

        var numErrors;
        var numWarnings;
        if (!Ext.isObject(errors)) {
            numErrors = 0;
        } else {
            numErrors = Object.keys(errors).length;
        }
        if (!Ext.isObject(warnings)) {
            numWarnings = 0;
        } else {
            numWarnings = Object.keys(warnings).length;
        }
        if (!data.success) {
            out.push('Der Import der Datei ' + this.fileName +
                    ' war nicht erfolgreich. Der Importvorgang konnte ' +
                    'aufgrund eines Fehlers im Server nicht beendet werden.');
        } else {
            if (numErrors > 0) {
                if (errors.parser) {
                    out.push('Die Probe(n) konnten nicht erfolgreich ' +
                             'importiert werden.');
                } else {
                    out.push(numErrors + ' Probe(n) konnten nicht ' +
                             'erfolgreich importiert werden.');
                }
                out.push('<br/>');
                out.push('<br/>');
            }
            if (numWarnings > 0) {
                out.push('Bei ' + numWarnings + ' Probe(n) traten Warnungen auf. ');
                out.push('<br/>');
                out.push('<br/>');
            }
            if (numErrors > 0 || numWarnings > 0) {
                out.push('Der ausführliche Bericht steht als Download bereit.');
                out.push('<br/>');
            } else {
                out.push('Die Proben wurden importiert.');
                out.push('<br/>');
            }
        }
        return out.join('');
    },

    /**
     * Parse the Response
     * @param data the payload of the response
     */
    parseResponse: function(data) {
        var i18n = Lada.getApplication().bundle;
        var errors = data.data.errors;
        var warnings = data.data.warnings;
        var out = [];
        // There is a entry for each imported proben in the errors dict (might be
        // empty)

        var numErrors;
        var numWarnings;
        if (!Ext.isObject(errors)) {
            numErrors = 0;
        } else {
            numErrors = Object.keys(errors).length;
        }
        if (!Ext.isObject(warnings)) {
            numWarnings = 0;
        } else {
            numWarnings = Object.keys(warnings).length;
        }
        if (!data.success) {
            out.push('Der Import der Datei ' + this.fileName +
                    ' war nicht erfolgreich. Der Importvorgang konnte ' +
                    'aufgrund eines Fehlers im Server nicht beendet werden.');
        } else {
            out.push('<!DOCTYPE html>' +
                '<head><meta charset="utf-8"></head><body>');
            if (numErrors > 0) {
                out.push('Folgende Fehler traten beim Import auf:');
                out.push('<br/>');
                out.push('<ol>');
                var msgs;
                for (var key in errors) {
                    msgs = errors[key];
                    if (key !== 'parser') {
                        out.push('<li>Probe: ' + key);
                    }
                    out.push('<ol>');
                    validation = [];
                    validation.push('Validierungsfehler: ');
                    for (var i = msgs.length - 1; i >= 0; i--) {
                        if (msgs[i].key === 'validation') {
                            validation.push('<ol>');
                            var parts = msgs[i].value.split('#');
                            var str = i18n.getMsg(parts[0]) +
                                (parts[1] === undefined ? '' : ' ' + parts[1]);
                            validation.push(str + ' ('
                                + i18n.getMsg(msgs[i].code.toString()) + ')');
                            validation.push('</ol>');
                        } else {
                            out.push('<li>' + msgs[i].key + ' ('
                                     + i18n.getMsg(msgs[i].code.toString())
                                     + '): ' + msgs[i].value + '</li>');
                        }
                    }
                    if (validation.length > 1) {
                        out.push('<li>');
                        out.push(validation.join(''));
                        out.push('</li>');
                    }
                    out.push('</ol>');
                    if (key !== 'parser') {
                        out.push('</li>');
                    }
                }
                out.push('</ol>');
                out.push('<br/>');
            }
            if (numWarnings > 0) {
                out.push('<br/>');
                out.push('Bei folgenden Proben traten  Warnungen auf:');
                out.push('<br/>');
                out.push('<ol>');
                for (key in warnings) {
                    out.push('<li>' + key);
                    msgs = warnings[key];
                    out.push('<ol>');
                    validation = [];
                    validation.push('Validierungswarnungen: ');
                    for (var i = msgs.length - 1; i >= 0; i--) {
                        if (msgs[i].key === 'validation') {
                            validation.push('<ol>');
                            var parts = msgs[i].value.split('#');
                            var str = i18n.getMsg(parts[0]) +
                                (parts[1] === undefined ? '' : ' ' + parts[1]);
                            validation.push(str + ' ('
                                + i18n.getMsg(msgs[i].code.toString()) + ')');
                            validation.push('</ol>');
                        } else {
                            out.push('<li>' + msgs[i].key + ' ('
                                     + i18n.getMsg(msgs[i].code.toString())
                                     + '): ' + msgs[i].value + '</li>');
                        }
                    }
                    if (validation.length > 1) {
                        out.push('<li>');
                        out.push(validation.join(''));
                        out.push('</li>');
                    }
                    out.push('</ol>');
                    out.push('</li>');
                }
                out.push('</ol>');
            }
            out.push('<br/>');
            out.push('</body></html>');
            if (numWarnings > 0 || numErrors > 0) {
                this.down('button[name=download]').enable();
            }
        }
        return out.join('');
    }
});
