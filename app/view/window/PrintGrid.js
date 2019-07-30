/* Copyright (C) 2019 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window for selecting/ prefilling print templates.
 */
Ext.define('Lada.view.window.PrintGrid', {
    alias: 'widget.printgrid',
    extend: 'Ext.window.Window',

    layout: 'vbox',
    defaults: {
        margin: '5, 5, 5, 5',
        border: false
    },

    // store containing all available templates for the currently selected data
    templateStore: Ext.create('Ext.data.Store', {
        model: Ext.create('Ext.data.Model',{
            fields: [{ name: 'name', type: 'string' }]
        })
    }),
    // the grid with the current query and the items to be printed
    parentGrid: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('print.window.title');
        this.items = [ {
            xtype: 'radio',
            boxLabel: i18n.getMsg('print.table'),
            name: 'variant',
            id: 'radio_printtable',
            value: true
        }, {
            xtype: 'radio',
            boxLabel: i18n.getMsg('print.template'),
            name: 'variant',
            id: 'radio_printtemplate'
        }, {
            xtype: 'combobox',
            name: 'template',
            fieldLabel: i18n.getMsg('print.window.template'),
            store: this.templateStore,
            valueField: 'name',
            displayField: 'name',
            allowBlank: false,
            editable: true,
            disableKeyFilter: false,
            forceSelection: true,
            queryMode: 'local',
            minChars: 0,
            typeAhead: false,
            disabled: true,
            triggerAction: 'all'
        } , {
            xtype: 'fieldset',
            title: i18n.getMsg('print.presets'), // TODO better name
            collapsible: true,
            collapsed: true,
            scrollable: true,
            height: 300,
            name: 'dynamicfields',
            items: [],
            hidden: true
        }, {
            xtype: 'textfield',
            name: 'filename',
            fieldLabel: i18n.getMsg('export.filename'),
            value: 'lada-export.pdf'
        }, {
            xtype: 'label',
            name: 'results',
            hidden: true
        }

        ];
        this.buttons = [{
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
        }, {
            text: i18n.getMsg('button.print'),
            action: 'doPrint'
        }];
        this.callParent(arguments);
    },

    setTemplateData: function(data) {
        if (data) {
            this.templateStore.setData(data);
        } else {
            this.templateStore.removeAll();
        }
    }
});
