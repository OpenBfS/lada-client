/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Number field for display and editing of exponential numbers
 */
Ext.define('Lada.view.form.ExpNumberField', {
    extend: 'Ext.form.field.Number',
    alias: 'widget.expnumberfield',

    baseChars: '0123456789eE.,',

    hideTrigger: true,
    keyNavEnabled: false,
    mouseWheelEnabled: false,

    valueToRaw: function(value) {
        if (!value || value === '') {
            return value;
        }

        // XXX: this will be applied to any input before being sent to
        // the server! Thus, toExponential(2) would lead to incorrectly
        // rounded numbers at this point.
        value = parseFloat(value).toExponential()
            .toString().replace('.', this.decimalSeparator)
            .replace(',', this.decimalSeparator);

        return value;
    },

    rawToValue: function(value) {
        if (!value || value === '') {
            return value;
        }

        value = parseFloat(
            value.toString().replace(this.decimalSeparator, '.'));

        return value;
    }
});
