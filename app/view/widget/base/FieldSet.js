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

    /**
     * Show warnings or errors for this fieldset.
     * If this component is not rendered, the warnings will be shown after
     * rendering.
     * @param {Boolean} warning True if there are warnings
     * @param {String} warningText Warning text
     * @param {Boolean} error True if there are errors
     * @param {String} errorText Error Text
     */
    showWarningOrError: function(warning, warningText, error, errorText) {
        //If component is rendered, show warnings, else add afterRender listener
        if (this.rendered === true) {
            this.doShowWarningOrError(warning, warningText, error, errorText);
        } else {
            this.onAfter(
                'render',
                function() {
                    this.doShowWarningOrError(
                        warning, warningText, error, errorText);
                },
                this,
                {single: true});
        }
    },

    /**
     * @private
     * Render the given warnings or errors.
     * should now be called directly, use showWarningOrError instead.
     * @param {Boolean} warning True if there are warnings
     * @param {String} warningText Warning text
     * @param {Boolean} error True if there are errors
     * @param {String} errorText Error Text
     */
    doShowWarningOrError: function(warning, warningText, error, errorText) {
        this.clearMessages(); //Clear Errors and Warning first
        if (this.errorText && this.errorText !== '') {
            this.errorText += '\n';
        }
        this.errorText += errorText;
        if (this.warningText && this.warningText !== '') {
            this.warningText += '\n';
        }
        this.warningText += warningText;

        if (this.title) {
            this.plainTitle = this.title;
        }
        this.origColor = this.getEl().dom.style['border-color'];
        var imgId = Ext.id();
        if (error) {
            this.getEl().dom.style['border-color'] = '#FF0000';
            // eslint-disable-next-line max-len
            this.setTitle('<img src="resources/img/emblem-important.png" width="13" height="13" id="'+ imgId +'"/>  '+
                    this.plainTitle);
            if (errorText) {
                if (!this.tooltip) {
                    Ext.create('Ext.tip.ToolTip', {
                        target: imgId,
                        html: errorText
                    });
                } else {
                    this.tooltip.html = errorText;
                }
            }
            return;
        }
        if (warning) {
            this.getEl().dom.style['border-color'] = '#FFE25D';
            // eslint-disable-next-line max-len
            this.setTitle('<img src="resources/img/dialog-warning.png" width="13" height="13"  id="'+ imgId +'"/>  '+
                    this.plainTitle);
            if (warningText) {
                if (!this.tooltip) {
                    Ext.create('Ext.tip.ToolTip', {
                        target: Ext.get(imgId),
                        html: warningText
                    });
                } else {
                    this.tooltip.html = warningText;
                }
            }
            return;
        }
    },

    clearMessages: function() {
        if (this.plainTitle) {
            this.setTitle(this.plainTitle);
        }
        if (this.getEl()) {
            this.getEl().dom.style['border-color'] = this.origColor;
        }
    }
});
