/**
 * This Window is shown, when Proben could be imported from a LAF file
 */
Ext.define('Lada.view.window.ImportResponse', {
    extend: 'Ext.window.Window',
    alias: 'widget.importresponse',

    responseData: '',
    message: '',
    fileName: '',
    fileNames: [],

    downloadPrefix: '',
    downloadPostfix: '',

    //Downloadable report content
    download: '',

    /**
     * Imported file encoding
     */
    encoding: null,

    /**
     * Preselected mst
     */
    mstId: null,

    /**
     * String containg mst and encoding
     */
    mstEncoding: null,

    /**
     * Json object containing import response
     */
    response: null,

    layout: 'fit',
    resizable: true,

    fileCount: -1,

    finished: 0,

    finishedHandler: null,

    /**
     * @private
     * List of ids of imported probe records
     */
    importedProbeIds: [],

    /**
     * @private
     * Initialize the view.
     */
    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;

        this.downloadPrefix = '<!DOCTYPE html>' +
                '<head><meta charset="utf-8"></head><body>';
        this.downloadPostfix = '</body></html>'

        me.mstEncoding = i18n.getMsg('encoding') + ' ' + this.encoding;
        if (this.mst !== null) {
            me.mstEncoding += '&emsp;' + i18n.getMsg('import.configMst') + ': ' +  this.mst;
        }

        this.bodyStyle = {background: '#fff'};
        me.items = [{
            xtype: 'panel',
            html: '',
            width: '100%',
            height: '100%',
            scrollable: true,
            margin: '10 0 15 10',
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
                var downloadJoin = me.downloadPrefix + me.download + me.downloadPostfix;
                var blob = new Blob([downloadJoin],{type: 'text/html'});
                saveAs(blob, 'report.html');
            }
        }];
        this.callParent(arguments);
        this.initContent(this.response.data);
    },

    /**
     * Init window content to display file import results
     * @param data Response data containing warnings and errors
     */
    initContent: function(data) {
        var i18n = Lada.getApplication().bundle;
        var me = this;

        Ext.Object.each(data, function(fileName, fileResult) {
            var response = '<br/><hr><b>' + fileName + ':</b><br/><ol>&#40' + me.mstEncoding + '&#41</ol>';
            response += i18n.getMsg('import.messages') + ':<br/><hr>';
            response += me.parseResponse(fileResult, true);
            me.download += response;
            me.down('panel').setHtml(me.down('panel').html + response);
    
        });
        me.down('button[name=download]').enable();
    },

    /**
     * Update the result window after an error has occured during the upload.
     * Updates the result text and the progress bar.
     * @param status HTTP status code
     * @param statusText Status text
     * @param fileIndex Index of the file in the name array
     */
    updateOnError: function (status, statusText, fileIndex) {
        var i18n = Lada.getApplication().bundle;
        this.finished++;
        this.down('progressbar').updateProgress(this.finished/this.fileCount);
        var filename = this.fileNames[fileIndex];
        var response = '<br/><hr><b>' + filename + ':</b><br/><ol>&#40' + this.mstEncoding + '&#41</ol>';
        response += i18n.getMsg('import.messages') + ':<br/><hr>';
        response += status + ' - ' + statusText;
        this.down('panel').setHtml(this.down('panel').html + response);
        this.download += response;
        if (this.finished == this.fileCount) {
            this.down('button[name=download]').enable();
        }
    },

    /**
     * Parse the response and create a summary of the result
     * @param data
     */
    parseShortResponse: function(data) {
        var i18n = Lada.getApplication().bundle;
        var errors = data.errors;
        var warnings = data.warnings;
        var notifications = data.notifications;
        var out = [];
        // There is a entry for each imported proben in the errors dict (might be
        // empty)

        var numErrors;
        var numWarnings;
        var numNotifications;
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

            if (numNotifications > 0) {
                if (notifications.Parser) {
                    out.push(i18n.getMsg('importResponse.numNotifications',
                        numNotifications - 1));
                    out.push('<br/>');
                    out.push(i18n.getMsg('importResponse.Notifications'));
                } else {
                    out.push(i18n.getMsg('importResponse.numNotifications',
                        numNotifications));
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
        var errors = data.errors;
        var warnings = data.warnings;
        var notifications = data.notifications;
        var out = [];
        // There is a entry for each imported proben in the errors dict (might be
        // empty)

        //TODO. overflow is now neccessary
        var divStyle = '<DIV>';//'<DIV style="max-height:300px;overflow-y:auto;">';
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
        if (!Ext.isObject(notifications)) {
            numNotifications = 0;
        } else {
            numNotifications = Object.keys(notifications).length;
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
            } else {
                out.push('<br>Beim Import traten keine Fehler auf.</br>');
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
            } else {
                out.push('<br>Beim Import traten keine Warnungen auf.</br>');
            }

            if (numNotifications > 0) {
                out.push('<br/>');
                out.push(i18n.getMsg('importResponse.notifications.notificationlist'));
                out.push('<br/>');
                out.push('<ol>');
                if (notifications.Parser) {
                    out.push(i18n.getMsg('importResponse.parser'));
                    out.push('<ol>');
                    msgs = notifications.Parser;
                    for (var i = msgs.length - 1; i >= 0; i--) {
                        out.push('<li>' + msgs[i].key + ' ('
                                 + i18n.getMsg(msgs[i].code.toString())
                                 + '): ' + msgs[i].value + '</li>');
                    }
                    out.push('</ol>');
                }
                for (key in notifications) {
                    if (key !== 'Parser') {
                        out.push(i18n.getMsg('importResponse.list.probe', key));
                    } else {
                        continue;
                    }
                    msgs = notifications[key];
                    out.push('<ol>');
                    validation = [];
                    validation.push(i18n.getMsg(
                        'importResponse.notifications.validations'));
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
            } else {
                out.push('<br>Beim Import traten keine Hinweismeldungen auf.</br>');
            }

            if (!divHtml) {
                out.push('</body></html>');
            } else {
                out.push('</DIV>');
            }
        }
        return out.join('');
    },

    getGeneratedTags: function() {
        var me = this;
        return new Ext.Promise(function(resolve, reject) {
            Ext.Ajax.request({
                url: 'lada-server/rest/tag/imported',
                method: 'POST',
                jsonData: {
                    probeIds: me.importedProbeIds,
                    mstId: Lada.mst[0]
                },
                success: function(response) {
                    var responseJson = Ext.JSON.decode(response.responseText);
                    if (responseJson.success) {
                        var tagName = '';
                        if (responseJson.data.length > 0) {
                            tagName = responseJson.data[0].tag.tag;
                        }
                        resolve(tagName);
                    } else {
                        reject();
                    }
                },
                failure: function(response) {
                    reject();
                }
            })
        });
    }
});
