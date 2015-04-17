/**
 *
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
        if (me.data && me.message) {
            html = me.parseResponse(me.message, me.data);
        }
        this.bodyStyle = {background: '#fff'};
        me.items = [{
            xtype: 'panel',
            html: html,
            margin: 10,
            border: false
        }];

        this.callParent(arguments);
    },

    parseResponse: function(msg, data) {
        console.log(Ext.JSON.decode(data));
        data = Ext.JSON.decode(data);
        var errors = data.data.errors;
        var warnings = data.data.warnings;
        var out = [];
        // There is a entry for each imported proben in the errors dict (might be
        // empty)

        var numErrors;
        var numWarnings;
        if (Ext.isEmpty(Object.keys(errors))) {
            numErrors = 0;
        }
        else {
            numErrors = Object.keys(errors).length;
        }
        if (Ext.isEmpty(Object.keys(warnings))) {
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
                    for (var i = msgs.length - 1; i >= 0; i--) {
                        if (msgs[i].key === 'validation') {
                            out.push('Validierungsfehler: ');
                            out.push('<ol>');
                            for (var vKey in msgs[i].value) {
                                out.push(Lada.getApplication().bundle.getMsg(vKey) + ': ');
                                for (var j = 0; j < msgs[i].value[vKey].length; j++) {
                                    console.log(msgs[i].value[vKey][j]);
                                    out.push(Lada.getApplication().bundle.getMsg(msgs[i].value[vKey][j].toString()));
                                }
                            }
                            out.push('</ol>');
                        }
                        else {
                            out.push(msgs[i].key +
                                ' (' + Lada.getApplication().bundle.getMsg(
                                    msgs[i].code.toString()) +
                                '): ' + msgs[i].value);
                        }
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
                    for (var i = msgs.length - 1; i >= 0; i--) {
                        if (msgs[i].key === 'validation') {
                            out.push('Validierungswarnungen: ');
                            out.push('<ol>');
                            for (var vKey in msgs[i].value) {
                                out.push(Lada.getApplication().bundle.getMsg(vKey) + ': ');
                                for (var j = 0; j < msgs[i].value[vKey].length; j++) {
                                    console.log(msgs[i].value[vKey][j]);
                                    out.push(Lada.getApplication().bundle.getMsg(msgs[i].value[vKey][j].toString()));
                                }
                            }
                            out.push('</ol>');
                        }
                        else {
                            out.push('<li>' + msgs[i].key + ' (' + Lada.getApplication().bundle.getMsg(msgs[i].code.toString())+'): '+msgs[i].value+'</li>')
                        }
                    }
                    out.push('</ol>');
                    out.push('</li>');
                }
                out.push('</ol>');
            }
            out.push('<br/>');
        }
        console.log(out.join(''));
        return out.join('');
    }
});
