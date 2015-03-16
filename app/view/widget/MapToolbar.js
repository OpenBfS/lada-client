/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

Ext.define('Lada.view.widget.MapToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.maptoolbar',

    initComponent: function() {
        this.items = [{
            icon: 'resources/img/list-add.png',
            tooltip: 'Neuen Ort hinzufügen',
            action: 'add'
        }];
        this.callParent(arguments);
    }
});
