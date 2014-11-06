/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to create a Probe
 */
Ext.define('Lada.view.proben.ImportForm', {
    extend: 'Ext.form.Panel',

    initComponent: function() {
        this.items = [{
            xtype: 'fileuploadfield',
            title: 'Importdate'
        }];
        this.callParent(arguments);
    }
});
