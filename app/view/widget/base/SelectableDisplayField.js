/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This widget creates a selectable displayfield.
 */
Ext.define('Lada.view.widget.base.SelectableDisplayField', {
    extend: 'Ext.form.field.Display',
    alias: 'widget.selectabledisplayfield',

    fieldStyle: 'background:none',

    onRender: function() {
        this.callParent(arguments);
        this.inputEl.selectable();
    }
});
