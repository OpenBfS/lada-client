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
    resizable: false,

    /**
     * @private
     * Initialize the view.
     */
    initComponent: function() {
        var me = this;
        var html;
        var download;
        var i18n = Lada.getApplication().bundle;
        var data = null;
        try {
            data = Ext.decode(me.responseData);
        } catch (e) {
            data = null;
        }
        if (data) {
            html = me.parseShortResponse(data);
        } else {
            html = i18n.getMsg('importResponse.failure.server', this.fileName);
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
            this.down('panel').html = html + me.parseResponse(data, true);
        }
    },

    /**
     * Parse the response and create a summary of the result
     * @param data
     */
    parseShortResponse: function(data) {
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
            out.push(i18n.getMsg('importResponse.failure.server',
                this.fileName));
        } else {
            if (numErrors > 0) {
                if (errors.Parser) {
                    out.push(i18n.getMsg('importResponse.failure', this.fileName));
                } else {
                    out.push(i18n.getMsg(
                        'importResponse.failure.generic.partial', numErrors));
                }
                out.push('<br/>');
                out.push('<br/>');
            }
            if (numWarnings > 0) {
                if (warnings.Parser) {
                    out.push(i18n.getMsg('importResponse.numWarnings',
                        numWarnings - 1));
                    out.push('<br/>');
                    out.push(i18n.getMsg('importResponse.warnings'));
                } else {
                    out.push(i18n.getMsg('importResponse.numWarnings',
                        numWarnings));
                }
                out.push('<br/>');
                out.push('<br/>');
            }
            if (numErrors > 0 || numWarnings > 0) {
                out.push(i18n.getMsg('importResponse.failure.details'));
                out.push('<hr>');
            } else {
                out.push(i18n.getMsg('importResponse.success', this.fileName));
            }
            out.push('<br/>');
        }
        return out.join('');
    },

    /**
     * Parse the Response
     * @param data the payload of the response
     * @param divHtml (optional boolaen) indicate that the data are to be
     * rendered inline (without header)
     */
    parseResponse: function(data, divHtml) {
        var i18n = Lada.getApplication().bundle;
        var errors = data.data.errors;
        var warnings = data.data.warnings;
        var out = [];
        // There is a entry for each imported proben in the errors dict (might be
        // empty)

        var divStyle = '<DIV style="max-height:300px;overflow-y:auto;">';
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
            if (divHtml) {
                out.push(divStyle + i18n.getMsg(
                    'importResponse.failure.server', this.fileName) + '</DIV>');
            } else {
                out.push(i18n.getMsg(
                    'importResponse.failure.server', this.fileName));
            }
        } else {
            if (!divHtml) {
                out.push('<!DOCTYPE html>' +
                    '<head><meta charset="utf-8"></head><body>');
            } else {
                out.push(divStyle);
            }
            if (numErrors > 0) {
                out.push(i18n.getMsg('importResponse.failure.errorlist'));
                out.push('<br/>');
                out.push('<ol>');
                var msgs;
                for (var key in errors) {
                    msgs = errors[key];
                    if (key !== 'parser') {
                        out.push(i18n.getMsg(
                            'importResponse.list.probe', key));
                    }
                    out.push('<ol>');
                    var validation = [];
                    validation.push(
                        i18n.getMsg('importResponse.failure.validations'));
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
                out.push(i18n.getMsg('importResponse.warnings.warninglist'));
                out.push('<br/>');
                out.push('<ol>');
                if (warnings.Parser) {
                    out.push(i18n.getMsg('importResponse.parser'));
                    out.push('<ol>');
                    msgs = warnings.Parser;
                    for (var i = msgs.length - 1; i >= 0; i--) {
                        out.push('<li>' + msgs[i].key + ' ('
                                 + i18n.getMsg(msgs[i].code.toString())
                                 + '): ' + msgs[i].value + '</li>');
                    }
                    out.push('</ol>');
                }
                for (key in warnings) {
                    if (key !== 'Parser') {
                        out.push(i18n.getMsg('importResponse.list.probe', key));
                    } else {
                        continue;
                    }
                    msgs = warnings[key];
                    out.push('<ol>');
                    validation = [];
                    validation.push(i18n.getMsg(
                        'importResponse.warnings.validations'));
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
                    if (key !== 'Parser') {
                        out.push('</li>');
                    }
                }
                out.push('</ol>');
            }
            out.push('<br/>');
            if (!divHtml) {
                out.push('</body></html>');
            } else {
                out.push('</DIV>');
            }
            if (numWarnings > 0 || numErrors > 0) {
                this.down('button[name=download]').enable();
            }
        }
        return out.join('');
    }
});
