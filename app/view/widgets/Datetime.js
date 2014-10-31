/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

/**
 * Datetimepicker with german date format.
 */
Ext.define('Lada.view.widgets.Datetime' ,{
    extend: 'Ext.ux.form.DateTimeField',
    alias: 'widget.datetime',
    format: 'd.m.Y',
    emptyText:'Wählen Sie einen Zeitpunkt',

    initComponent: function() {
        this.callParent(arguments);
    }
});
