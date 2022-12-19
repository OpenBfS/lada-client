/* Copyright (C) 2022 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Form panel base class.
 */
Ext.define('Lada.view.form.LadaForm', {
    extend: 'Ext.form.Panel',

    /**
     * Set readOnly config of all fields in the component.
     */
    setReadOnly: function(readOnly) {
        this.query('field').forEach(function(field) {
            field.setReadOnly(readOnly);
        });
    }
});
