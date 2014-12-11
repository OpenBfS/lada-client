/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Window to edit a Probe
 */
Ext.define('Lada.view.proben.Edit', {
    extend: 'Ext.window.Window',
    alias: 'widget.probenedit',

    requires: [
        'Lada.view.proben.EditForm'
    ],

    title: 'Maske für §3-Proben',
    // Make size of the dialog dependend of the available space.
    // TODO: Handle resizing the browser window.
    autoShow: true,
    autoScroll: true,
    modal: true,
    layout: 'fit',

    initComponent: function() {
        this.buttons = [{
            text: 'Speichern',
            action: 'save'
        }, {
            text: 'Abbrechen',
            scope: this,
            handler: this.close
        }];
        this.width = 700// Ext.getBody().getViewSize().width - 30;
        this.height = Ext.getBody().getViewSize().height - 30;
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "modelId" param to load the correct item.

        /*
        this.items = [{
            xtype: 'fieldset',
            title: 'Probenangaben',
            layout: 'hbox',
            defaults: {
                labelWidth: 150
            },
            items: [{
                    layout: 'vbox',
                    border: 0,
                    items: [{
                        xtype: 'mst',
                        name: 'mstId',
                        fieldLabel: 'Messstelle',
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        name: 'hauptprobenNr',
                        maxLength: 20,
                        fieldLabel: 'Hauptprobennr.'
                    }]
            }]
            */
/*
            items: [{
                layout: 'hbox',
                border: 0,
                items: [{
                    layout: 'vbox',
                    border: 0,
                    items: [{
                        xtype: 'mst',
                        name: 'mstId',
                        fieldLabel: 'Messstelle',
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        name: 'hauptprobenNr',
                        maxLength: 20,
                        fieldLabel: 'Hauptprobennr.'
                    }]
                }, {
                    xtype: 'fieldset',
                    title: 'Erweiterte Probenangaben',
                    collapsible: true,
                    collapsed: true,
                    items: [{
                        xtype: 'datenbasis',
                        id: 'datenbasis',
                        editable: false,
                        name: 'datenbasisId',
                        fieldLabel: 'Datenbasis'
                    }, {
                        xtype: 'betriebsart',
                        name: 'baId',
                        fieldLabel: 'Betriebsart'
                    }, {
                        xtype: 'testdatensatz',
                        name: 'test',
                        fieldLabel: 'Testdatensatz',
                        allowBlank: false
                    }, {
                        xtype: 'probenart',
                        id: 'probenart',
                        editable: false,
                        name: 'probenartId',
                        fieldLabel: 'Probenart',
                        allowBlank: false
                    }, {
                        xtype: 'numberfield',
                        allowDecimals: false,
                        name: 'probeNehmerId',
                        fieldLabel: 'Probennehmer'
                    }, {
                        xtype: 'netzbetreiber',
                        name: 'netzbetreiberId',
                        editable: false,
                        fieldLabel: 'Netzbetreiber',
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        name: 'x11',
                        fieldLabel: 'Datensatzerzeuger'
                    }]
                }]
            }]
            */
//        }];
        var form = Ext.create('Lada.view.proben.EditForm',
            this.initialConfig);
        this.items = [{
            border: 0,
            autoScroll: true,
            items: [form]
        }];
        this.callParent(arguments);
    }
});
