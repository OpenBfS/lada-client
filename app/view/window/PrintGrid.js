/* Copyright (C) 2019 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Singleton window for selecting/ prefilling print templates.
 * This class should not be instanced directly, instead
 * Lada.View.PrintGrid.getInstance() can be used to create or get the instance.
 */
Ext.define('Lada.view.window.PrintGrid', {
    alias: 'widget.printgrid',
    extend: 'Ext.window.Window',
    requires: [
        'Koala.view.form.IrixFieldSet',
        'Lada.controller.Print',
        'Lada.view.grid.DownloadQueue'
    ],

    controller: 'print',

    id: 'printgridwindow',

    statics: {
        /**
         * @private
         * Static instance
         */
        instance: null,

        /**
         * Get the PrintGrid window instance
         */
        getInstance: function() {
            if (!Lada.view.window.PrintGrid.instance) {
                var win = Ext.create('Lada.view.window.PrintGrid', {
                    parentGrid: Ext.ComponentQuery.query(
                        'dynamicgrid')[0] || null,
                    closeAction: 'hide'
                });
                Lada.view.window.PrintGrid.instance = win;
            }
            return Lada.view.window.PrintGrid.instance;
        }
    },

    dokPoolEnabled: true,

    constrain: true,
    resizable: false,
    defaults: {
        margin: '5, 5, 5, 5',
        border: false
    },

    // store containing all available templates for the currently selected data
    templateStore: Ext.create('Ext.data.Store', {
        model: Ext.create('Ext.data.Model', {
            fields: [{ name: 'name', type: 'string' }]
        })
    }),

    // store containing all the layouts for the currently selected template
    layoutStore: Ext.create('Ext.data.Store', {
        model: Ext.create('Ext.data.Model', {
            fields: [
                { name: 'id', type: 'number' },
                { name: 'name', type: 'string' }
            ]
        })
    }),

    formatStore: Ext.create('Ext.data.Store', {
        model: Ext.create('Ext.data.Model', {
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
        this.templateStore.sort('name', 'ASC');
        this.items = [{
            layout: 'vbox',
            minWidth: 500,
            border: false,
            scrollable: true,
            defaults: {
                margin: '5 5 5 5',
                width: '100%'
            },
            items: [{
                xtype: 'combobox',
                name: 'template',
                fieldLabel: i18n.getMsg('print.window.template'),
                store: this.templateStore,
                displayField: 'name',
                allowBlank: false,
                editable: true,
                disableKeyFilter: false,
                forceSelection: true,
                queryMode: 'local',
                minChars: 0,
                matchFieldWidth: false,
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
                xtype: 'panel',
                name: 'generic-fieldset',
                border: false,
                margin: '0 135 0 0'
            }, {
                xtype: 'fieldset',
                title: i18n.getMsg('print.presets'),
                collapsible: true,
                collapsed: false,
                scrollable: true,
                maxWidth: '100%',
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
            }, {
                xtype: 'downloadqueuegrid',
                store: 'downloadqueue-print',
                width: '100%'
            }]
        }];
        this.buttons = [{
            text: i18n.getMsg('button.print'),
            action: 'doPrint'
        }, {
            text: i18n.getMsg('close'),
            scope: this,
            handler: this.close
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

    // taken from
    // openBFS/gis-client/src/view/form/Print.js by terrestris GmbH & Co. KG
    addIrixCheckbox: function() {
        if (this.down('checkbox[name=irix-fieldset-checkbox]')) {
            return;
        }
        var me = this;
        var genericFieldset = me.down('panel[name=generic-fieldset]');
        var printDisabled = this.down('combobox[name=template]').getValue() ?
            false :
            true ;
        var irixCheckbox = Ext.create('Ext.form.field.Checkbox', {
            name: 'irix-fieldset-checkbox',
            boxLabel: 'DokPool:',
            boxLabelAlign: 'before',
            border: false,
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

    // taken from
    // openBFS/gis-client/src/view/form/Print.js by terrestris GmbH & Co. KG
    addIrixFieldset: function() {
        var fs = this.down('k-form-irixfieldset');
        var checkBox = this.down('[name="irix-fieldset-checkbox"]');

        if (!fs) {
            var irixFieldset = Ext.create('Koala.view.form.IrixFieldSet', {
                dock: 'right',
                scrollable: true,
                margin: '5,5,5,5'
            });
            this.addDocked(irixFieldset);
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
    },

    /**
     * Update the window after the parent grid changed.
     * @param {Lada.view.widget.DynamicGrid} parentGrid The new parent grid
     */
    updateGrid: function(parentGrid) {
        //If parentGrid was null before, the query has been updated
        if (!this.parentGrid) {
            this.parentGrid = parentGrid;
            this.updateQuery();
        } else {
            this.parentGrid = parentGrid;
        }
    },

    /**
     * Update the window after the selected query changed.
     * Fires a gridupdate event.
     */
    updateQuery: function() {
        //If layout is selected, trigger template update
        var layoutBox = this.down('combobox[name=layout]');
        if (layoutBox.getValue() !== null && !this.isHidden()) {
            this.fireEvent('gridupdate', this);
        }
    },

    /**
     * Set the current grid from which the items are extracted
     * @param {Ext.grid.Panel} grid New parent grid
     */
    setParentGrid: function(grid) {
        if (grid) {
            this.parentGrid = grid;
        }
    },

    /**
     * Reset window and show if its hidden, else focus on window
     */
    show: function() {
        this.controller.getAvailableTemplates(this);
        if (this.isHidden()) {
            this.callParent(arguments);

            this.down('label[name=results]').setHidden(true);
            this.down('combobox[name=template]').clearValue();
            this.down('combobox[name=layout]').clearValue();

        } else {
            this.focus();
        }
    }
});
