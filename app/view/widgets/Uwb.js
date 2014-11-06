/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Umweltbereich
 */
Ext.define('Lada.view.widgets.Uwb' ,{
    extend: 'Ext.form.ComboBox',
    require: ['Lada.store.StaUmwelt'],
    alias: 'widget.uwb',
    store: 'StaUmwelt',
    displayField: 'id',
    valueField: 'id',
    emptyText: 'Wählen Sie einen Umweltbereich',
    // Enable filtering of comboboxes
    autoSelect: false,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: false,
    minChars: 0,
    tpl: '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
        '{id} - {umweltBereich}</div></tpl>',
    // TODO: Set value in disply after selection. Can not figure out why
    // accessing the recored.data attribute fails here (ti) <2013-08-06 16:52>
    // listeners: {
    //     select: function(combo, record, index) {
    //         console.log("1");
    //         console.log(record);
    //         console.log("2");
    //         var text = record.data['umwId'] +
    //             " - " + record.data['umweltBereich'];
    //         console.log("3");
    //         Ext.form.ComboBox.superclass.setValue.call(this, text);
    //         combo.value = record.id;
    //     }
    // },

    initComponent: function() {
        this.store = Ext.data.StoreManager.get('staUmwelt');
        if (!this.store) {
            this.store = Ext.create('Lada.store.StaUmwelt');
        }
        this.callParent(arguments);
    }
});
