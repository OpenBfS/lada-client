/**
 * This Window is shown, when Proben could be imported from a LAF file
 */
Ext.define('Lada.view.window.ImportResponse', {
    extend: 'Ext.window.Window',
    alias: 'widget.importresponse',

    data: null,
    message: null,
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
        if (me.data && me.message) {
            html = me.parseShortResponse(me.message, me.data);
        }
        else {
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
        if (me.data && me.message) {
            download = me.parseResponse(me.message, me.data);
        }
    },

    /**
     * Parse the response and create a summary of the result
     * @param msg
     * @param data
     */
    parseShortResponse: function(msg, data) {
        data = Ext.JSON.decode(data, true);
        var errors = data.data.errors;
        var warnings = data.data.warnings;
        var out = [];
        // There is a entry for each imported proben in the errors dict (might be
        // empty)

        var numErrors;
        var numWarnings;
        if (!Ext.isObject(errors)) {
            numErrors = 0;
        }
        else {
            numErrors = Object.keys(errors).length;
        }
        if (!Ext.isObject(warnings)) {
            numWarnings = 0;
        }
        else {
            numWarnings = Object.keys(warnings).length;
        }
        if (msg !== '200') {
                out.push('Der Import der Datei ' + this.fileName +
                    ' war nicht erfolgreich. Der Importvorgang konnte ' +
                    'aufgrund eines Fehlers im Server nicht beendet werden.');
        }
        else {
            if (numErrors > 0) {
                out.push(numErrors + ' Probe(n) konnten nicht erfolgreich ' +
                        'importiert werden.');
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
            }
            else {
                out.push('Die Proben wurden importiert.');
                out.push('<br/>');
            }
        }
        return out.join('');
    },

    /**
     * Parse the Response
     * @param msg the Lada-Erro-Code
     * @param data the payload of the response
     */
    parseResponse: function(msg, data) {
        data = Ext.JSON.decode(data, true);
        var errors = data.data.errors;
        var warnings = data.data.warnings;
        var out = [];
        // There is a entry for each imported proben in the errors dict (might be
        // empty)

        var numErrors;
        var numWarnings;
        if (!Ext.isObject(errors)) {
            numErrors = 0;
        }
        else {
            numErrors = Object.keys(errors).length;
        }
        if (!Ext.isObject(warnings)) {
            numWarnings = 0;
        }
        else {
            numWarnings = Object.keys(warnings).length;
        }
        if (msg !== '200') {
                out.push('Der Import der Datei ' + this.fileName +
                    ' war nicht erfolgreich. Der Importvorgang konnte ' +
                    'aufgrund eines Fehlers im Server nicht beendet werden.');
        }
        else {
            if (numErrors > 0) {
                out.push('Folgende Proben konnten nicht erfolgreich ' +
                        'importiert werden:');
                out.push('<br/>');
                out.push('<ol>');
                var msgs;
                for (var key in errors) {
                    out.push('<li>Probe: ' + key);
                    msgs = errors[key];
                    out.push('<ol>');
                    validation = []
                    validation.push('Validierungsfehler: ');
                    for (var i = msgs.length - 1; i >= 0; i--) {
                        if (msgs[i].key === 'validation') {
                            validation.push('<ol>');
                            validation.push(Lada.getApplication().bundle.getMsg(msgs[i].value) + ' (' + Lada.getApplication().bundle.getMsg(msgs[i].code.toString()) + ')');
                            validation.push('</ol>');
                        }
                        else {
                            out.push('<li>' + msgs[i].key + ' (' + Lada.getApplication().bundle.getMsg(msgs[i].code.toString())+'): '+msgs[i].value+'</li>')
                        }
                    }
                    if (validation.length > 1) {
                        out.push('<li>')
                        out.push(validation.join(''));
                        out.push('</li>')
                    }
                    out.push('</ol>');
                    out.push('</li>');
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
                    validation = []
                    validation.push('Validierungswarnungen: ');
                    for (var i = msgs.length - 1; i >= 0; i--) {
                        if (msgs[i].key === 'validation') {
                            validation.push('<ol>');
                            validation.push(Lada.getApplication().bundle.getMsg(msgs[i].value) + ' (' + Lada.getApplication().bundle.getMsg(msgs[i].code.toString()) + ')');
                            validation.push('</ol>');
                        }
                        else {
                            out.push('<li>' + msgs[i].key + ' (' + Lada.getApplication().bundle.getMsg(msgs[i].code.toString())+'): '+msgs[i].value+'</li>')
                        }
                    }
                    if (validation.length > 1) {
                        out.push('<li>')
                        out.push(validation.join(''));
                        out.push('</li>')
                    }
                    out.push('</ol>');
                    out.push('</li>');
                }
                out.push('</ol>');
            }
            out.push('<br/>');
            if (numWarnings > 0 || numErrors > 0) {
                this.down('button[name=download]').enable();
            }
        }
        return out.join('');
    }
});
