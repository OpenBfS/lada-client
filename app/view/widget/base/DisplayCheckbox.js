/* Copyright (C) 2022 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This widget creates a checkbox field only for display.
 */
Ext.define('Lada.view.widget.base.DisplayCheckbox', {
    extend: 'Ext.form.field.Checkbox',
    alias: 'widget.displaycheckbox',

    disabled: true,
    disabledCls: '',

    /**
     * Override method from base class to prevent enabling.
     */
    enable: function() {
        // Do nothing
    }
});
