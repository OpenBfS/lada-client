/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This Widget extends a Fieldset
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
        if (this.errorText && this.errorText !== '') {
            this.errorText += '\n';
        }
        this.errorText += errorText;
        if (this.warningText && this.warningText !== '') {
            this.warningText += '\n';
        }
        this.warningText += warningText;
        this.plainTitle = this.title;
        this.origColor = this.getEl().dom.style['border-color'];
        var imgId = Ext.id();
        if (error) {
            this.getEl().dom.style['border-color'] = '#FF0000';
            this.setTitle('<img src="resources/img/emblem-important.png" width="13" height="13" id="'+ imgId +'"/>  '+
                    this.plainTitle);
            if (errorText) {
                if (!this.tooltip) {
                    Ext.create('Ext.tip.ToolTip', {
                        target: imgId,
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
            this.setTitle('<img src="resources/img/dialog-warning.png" width="13" height="13"  id="'+ imgId +'"/>  '+
                    this.plainTitle);
            if (warningText) {
                if (!this.tooltip) {
                    Ext.create('Ext.tip.ToolTip', {
                        target: Ext.get(imgId),
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
        if (this.plainTitle !== '') {
            this.setTitle(this.plainTitle);
            this.getEl().dom.style['border-color'] = this.origColor;
        }
    }
});
