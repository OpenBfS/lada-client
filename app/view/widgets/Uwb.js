/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details. 
 */

var uwbStore = Ext.create('Ext.data.Store', {
    fields: ['umwId', 'umweltBereich'],
    sorters: [{
        property: 'umwId'
    }],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        api: {
        read: 'server/rest/uwb'
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

/**
 * Combobox for Umweltbereich
 */
Ext.define('Lada.view.widgets.Uwb' ,{
        tpl: '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >{umwId} - {umweltBereich}</div></tpl>',
        extend: 'Ext.form.ComboBox',
        alias: 'widget.uwb',
        store: uwbStore,
        displayField:'umwId',
        valueField: 'umwId',
        emptyText:'Wählen Sie einen Umweltbereich',
        // Enable filtering of comboboxes
        autoSelect: false,
        queryMode: 'local',
        triggerAction : 'all',
        typeAhead: true,
        minChars: 0,
        // TODO: Set value in disply after selection. Can not figure out why
        // accessing the recored.data attribute fails here (ti) <2013-08-06 16:52> 
        //listeners: {
        //    select: function(combo, record, index) {
        //        console.log("1");
        //        console.log(record);
        //        console.log("2");
        //        var text = record.data['umwId'] + " - " + record.data['umweltBereich'];
        //        console.log("3");
        //        Ext.form.ComboBox.superclass.setValue.call(this, text);
        //        combo.value = record.id;
        //    }
        //},
    initComponent: function() {
        this.callParent(arguments);
    }
});
