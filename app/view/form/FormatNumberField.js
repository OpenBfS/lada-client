/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Number field for display and editing Messfehler Format ####.#
 */
Ext.define('Lada.view.form.FormatNumberField', {
    extend: 'Ext.form.field.Number',
    alias: 'widget.formatnumberfield',

    baseChars: '0123456789.,',

    hideTrigger: true,
    keyNavEnabled: false,
    mouseWheelEnabled: false,

    valueToRaw: function(value) {
        if (!value || value === '') {
            return value;
        }
        value = parseFloat(value)
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
