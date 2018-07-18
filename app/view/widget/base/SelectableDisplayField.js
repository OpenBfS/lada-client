/* Copyright (C) 2018 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This Widget creates a (selectable, but read-only) textField to replace
 * non-selectable displayFields
 */
Ext.define('Lada.view.widget.base.SelectableDisplayField', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.selectabledisplayfield',

    editable: false,
    inputWrapCls: '',
    triggerWrapCls: '',
    fieldStyle: 'background:none',
    submitValue: false

});
