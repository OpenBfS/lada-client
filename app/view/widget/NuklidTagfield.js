/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * TagField Box for Messgroessen
 */
Ext.define('Lada.view.widget.NuklidTagfield' ,{
    extend: 'Ext.form.field.Tag',
    alias: 'widget.nuklidtags',
    allowBlank: true,
    store: 'messgroessen',
    displayField: 'messgroesse',
    valueField: 'id',
    editable: this.editable || false,
    disableKeyFilter: false,
    forceSelection: true,
    autoSelect: false,
    queryMode: 'local',
    multiSelect: true,
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
            '{messgroesse}</div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">{messgroesse}</tpl>'),

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.callParent(arguments);
    }
});
