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
    requires: ['Koala.view.form.IrixFieldSet'],

    layout: 'vbox',
    minWidth: 400,
    defaults: {
        margin: '5, 5, 5, 5',
        width: '100%',
        border: false
    },

    // store containing all available templates for the currently selected data
    templateStore: Ext.create('Ext.data.Store', {
        model: Ext.create('Ext.data.Model',{
            fields: [{ name: 'name', type: 'string' }]
        })
    }),

    // store containing all the layouts for the currently selected template
    layoutStore: Ext.create('Ext.data.Store', {
        model: Ext.create('Ext.data.Model',{
            fields: [
                { name: 'id', type: 'number' },
                { name: 'name', type: 'string' }
            ]
        })
    }),

    formatStore: Ext.create('Ext.data.Store', {
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
        this.items = [{
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
        }, {
            xtype: 'combobox',
            name: 'layout',
            fieldLabel: i18n.getMsg('print.layout'),
            store: this.layoutStore,
            valueField: 'id',
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
        }, {
            xtype: 'fieldset',
            name: 'generic-fieldset'
        }, {
            xtype: 'fieldset',
            title: i18n.getMsg('print.presets'),
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
            value: 'lada-export'
        }, {
            xtype: 'combobox',
            name: 'filetype',
            fieldLabel: i18n.getMsg('export.filetype'),
            store: this.formatStore,
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
            triggerAction: 'all',
            value: 'pdf'
        }, {
            xtype: 'label',
            name: 'results',
            hidden: true
        }];
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
            this.down('combobox[name=template]').setDisabled(false);
        } else {
            this.templateStore.removeAll();
            this.down('combobox[name=template]').setDisabled(true);
        }
    },

    // taken from openBFS/gis-client/src/view/form/Print.js by terrestris GmbH & Co. KG
    addIrixCheckbox: function() {
        var me = this;
        var genericFieldset = me.down('fieldset[name=generic-fieldset]');
        var printDisabled = this.down('combobox[name=template]').getValue() ? false: true ;
        var irixCheckbox = Ext.create('Ext.form.field.Checkbox', {
            name: 'irix-fieldset-checkbox',
            boxLabel: 'DokPool',
            checked: this.config.chartPrint,
            disabled: printDisabled,
            handler: function(checkbox, checked) {
                var irixFieldset = me.down('k-form-irixfieldset');
                if (checked) {
                    irixFieldset.show();
                } else {
                    irixFieldset.hide();
                }
            }
        });

        genericFieldset.add(irixCheckbox);

    },

    // taken from openBFS/gis-client/src/view/form/Print.js by terrestris GmbH & Co. KG
    addIrixFieldset: function() {
        var me = this;
        var fs = me.down('k-form-irixfieldset');
        var checkBox = me.down('[name="irix-fieldset-checkbox"]');

        if (!fs) {
            var irixFieldset = Ext.create('Koala.view.form.IrixFieldSet',{
                flex: 2
            });
            me.add(irixFieldset);
            // me.resolveIrixFieldsetLoaded();
        } else {
            checkBox.setValue(false);
        }
    },

    setDisabled: function(newValue) {
        this.down('button[action=doPrint]').setDisabled(newValue);
        this.down('combobox[name=layout]').setDisabled(newValue);
        var irixBox = this.down('checkbox[name=irix-fieldset-checkbox]');
        if (irixBox) {
            irixBox.setDisabled(newValue);
        }
    }

});
