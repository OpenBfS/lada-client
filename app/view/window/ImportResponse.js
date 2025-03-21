/**
 * This Window is shown, when Proben could be imported from a LAF file
 */
Ext.define('Lada.view.window.ImportResponse', {
    extend: 'Ext.window.Window',
    alias: 'widget.importresponse',

    responseData: '',
    fileName: '',
    fileNames: [],

    downloadPrefix: '',
    downloadPostfix: '',

    // submitted generated tags, to be offered as "send to clipboard"
    importtag: null,

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

        this.on({
            show: function() {
                this.removeCls('x-unselectable');
            }
        });
        this.downloadPrefix = '<!DOCTYPE html>' +
                '<head><meta charset="utf-8"></head><body>';
        this.downloadPostfix = '</body></html>';

        me.mstEncoding = i18n.getMsg('encoding') + ' ' + this.encoding;
        if (this.mst !== null) {
            me.mstEncoding += '&emsp;' +
            i18n.getMsg('import.configMst') + ': ' + this.mst;
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

        var isClip = ClipboardJS && ClipboardJS.isSupported();
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
                var downloadJoin = me.downloadPrefix +
                    me.download +
                    me.downloadPostfix;
                var blob = new Blob([downloadJoin], {type: 'text/html'});
                saveAs(blob, 'report.html');
            }
        }, {
            text: i18n.getMsg('button.tagToClipboard'),
            name: 'tagclipboard',
            hidden: !isClip,
            disabled: true,
            listeners: {
                afterrender: function(cmp) {
                    if (ClipboardJS && ClipboardJS.isSupported() && me.importtag) {
                        var btnDom = cmp.getEl().dom;
                        btnDom.setAttribute('data-clipboard-text', me.importtag);
                        new ClipboardJS(btnDom);
                    } else {
                        cmp.setHidden(true);
                    }

                }
            }
        }];
        this.callParent(arguments);
        this.initContent(this.response);
    },

    /**
     * Init window content to display file import results
     * @param data Response data containing warnings and errors
     */
    initContent: function(response) {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        var responsedata = Ext.decode(response.responseText);
        var html = '';
        if (response.status === 200 && responsedata) {
            Ext.Object.each(responsedata, function(fileName, fileResult) {
                html = '<br/><hr><b>' +
                    fileName +
                    ':</b>' +
                    '<p/>';
                html += me.parseResponse(fileResult, true);
                me.download += html;
            });
            me.down('button[name=download]').enable();
            me.importtag = Object.values(responsedata)[0].tag;
            if (me.importtag) {
                me.down('button[name=tagclipboard]').enable();
                me.setTitle(i18n.getMsg('title.importresult', Object.values(responsedata)[0].tag));
            }
        } else {
            html += i18n.getMsg(response.message) + ':<br/>'
                + response.data;
        }
        me.download = '<p>' + me.mstEncoding + '<p>' + me.download;
        if (me.importtag) {
            me.download = 'Tag: ' + me.importtag + me.download;
        }
        me.down('panel').setHtml(me.download);
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
        // There is a entry for each imported proben in the errors dict
        // (might be empty)

        var divStyle = '<DIV>';
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
        var numNotifications = Ext.isObject(notifications) ?
            Object.keys(notifications).length :
            0;
        if (!data.success && numErrors === 0) {
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
                if (!data.success) {
                    out.push(i18n.getMsg('importResponse.failure.mandatory'));
                    out.push('<p/>');
                }
                out.push(i18n.getMsg('importResponse.failure.errorlist'));
                out.push('<br/>');
                out.push('<ol>');
                this.printMessages(
                    errors, out, 'importResponse.failure.validations');
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
                    var msgs = warnings.Parser;
                    for (var i2 = msgs.length - 1; i2 >= 0; i2--) {
                        out.push('<li>' + msgs[i2].key + ' ('
                                 + i18n.getMsg(msgs[i2].code.toString())
                                 + '): ' + msgs[i2].value + '</li>');
                    }
                    out.push('</ol>');
                }
                this.printMessages(
                    warnings, out, 'importResponse.warnings.validations');
                out.push('</ol>');
            } else {
                out.push('<br>Beim Import traten keine Warnungen auf.</br>');
            }

            if (numNotifications > 0) {
                out.push(
                    i18n.getMsg(
                        'importResponse.notifications.notificationlist'));
                out.push('<br/>');
                out.push('<ol>');
                if (notifications.Parser) {
                    out.push(i18n.getMsg('importResponse.parser'));
                    out.push('<ol>');
                    msgs = notifications.Parser;
                    for (var i4 = msgs.length - 1; i4 >= 0; i4--) {
                        out.push('<li>' + msgs[i4].key + ' ('
                                 + i18n.getMsg(msgs[i4].code.toString())
                                 + '): ' + msgs[i4].value + '</li>');
                    }
                    out.push('</ol>');
                }
                this.printMessages(
                    notifications,
                    out,
                    'importResponse.notifications.validations');
                out.push('</ol>');
            } else {
                out.push(
                    '<br>Beim Import traten keine Hinweismeldungen auf.</br>');
            }

            if (!divHtml) {
                out.push('</body></html>');
            } else {
                out.push('</DIV>');
            }
        }
        return out.join('');
    },

    printMessages: function(msgs, out, msg) {
        var i18n = Lada.getApplication().bundle;
        for (var key in msgs) {
            msgs = msgs[key];
            if (key !== 'parser') {
                out.push(i18n.getMsg('importResponse.list.probe', key));
            }
            out.push('<ol>');
            var validation = [];
            validation.push(i18n.getMsg(msg));
            for (var i = msgs.length - 1; i >= 0; i--) {
                var keySplit = msgs[i].key.split('#');
                if (keySplit[0] === 'validation') {
                    validation.push('<ol>');
                    var parts = msgs[i].value.split('#');
                    var str = i18n.getMsg(parts[0]) +
                        (parts[1] === undefined ? '' : ' ' + parts[1]);
                    validation.push(str + ' ('
                                    + Lada.util.I18n.getMsgIfDefined(
                                        msgs[i].code.toString()) + ')');
                    validation.push('</ol>');
                } else {
                    out.push('<li>' + msgs[i].key + ' ('
                             + Lada.util.I18n.getMsgIfDefined(
                                 msgs[i].code.toString())
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
    }
});
