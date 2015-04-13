/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.view.widget.base.FieldSet', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.fset',

    plainTitle: '',
    origColor: '',
    errorText: '',
    warningText: '',
    tooltip: null,

    showWarningOrError: function(warning, warningText, error, errorText) {
        this.clearMessages(); //Clear Errors and Warning first
        var ndx = 0;
        if (this.collapsible === true) {
            ndx = 1;
        }
        if (this.errorText && this.errorText !== '') {
            this.errorText += '\n';
        }
        this.errorText += errorText;
        if (this.warningText && this.warningText !== '') {
            this.warningText += '\n';
        }
        this.warningText += warningText;
        this.plainTitle = this.getEl().dom.firstChild
            .firstChild.firstChild
            .children[ndx].innerHTML;
        this.origColor = this.getEl().dom.style['border-color'];
        if (error) {
            this.getEl().dom.style['border-color'] = '#FF0000';
            this.getEl().dom.firstChild.firstChild.firstChild
                .children[ndx].innerHTML =
                    '<img src="resources/img/emblem-important.png" width="13" height="13" />  ' +
                    this.plainTitle;
            if (errorText) {
                if (!this.tooltip) {
                    Ext.create('Ext.tip.ToolTip', {
                        target: this.getEl().dom.firstChild.firstChild.firstChild.children[ndx],
                        html: errorText
                    });
                }
                else {
                    tooltip.html = errorText;
                }
            }
            return;
        }
        if (warning) {
            this.getEl().dom.style['border-color'] = '#FFE25D';
            this.getEl().dom.firstChild.firstChild.firstChild
                .children[ndx].innerHTML =
                    '<img src="resources/img/dialog-warning.png" width="13" height="13" />  ' +
                    this.plainTitle;
            if (warningText) {
                if (!this.tooltip) {
                    Ext.create('Ext.tip.ToolTip', {
                        target: this.getEl().dom.firstChild.firstChild.firstChild.children[ndx],
                        html: warningText
                    });
                }
                else {
                    tooltip.html = warningText;
                }
            }
            return;
        }
    },

    clearMessages: function() {
        var ndx = 0;
        if (this.collapsible === true) {
            ndx = 1;
        }
        if (this.plainTitle !== '') {
            this.getEl().dom.firstChild
                .firstChild.firstChild
                .children[ndx].innerHTML = this.plainTitle;
            this.getEl().dom.style['border-color'] = this.origColor;
        }
    }
});
