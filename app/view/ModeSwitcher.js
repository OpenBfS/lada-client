/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a Widget for a ModeSwitcher
 */
Ext.define('Lada.view.ModeSwitcher', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.modeswitcher',

    mixins: {
        observable: 'Ext.util.Observable'
    },
    /**
     * Initialise the Widget.
     * When the Checkbox is checked, it fires a 'check' Event
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.title = i18n.getMsg('modus');
        this.items = [{
            xtype: 'radiogroup',
            columns: 1,
            width: '100%',
            items: [{
                xtype: 'radiofield',
                name: 'modeswitch',
                boxLabel: i18n.getMsg('proben'),
                inputValue: 'proben', //this determines the store
                    // which will be loaded by the controller,
                checked: true,
                handler: function(field, state) {
                    if (state === true) {
                        this.fireEvent('check', field);
                    }
                }
            }, {
                xtype: 'radiofield',
                name: 'modeswitch',
                boxLabel: i18n.getMsg('messungen'),
                inputValue: 'messungen', //this determines the store
                    // which will be loaded by the controller,
                handler: function(field, state) {
                    if (state === true) {
                        this.fireEvent('check', field);
                    }
                }
            }, {
                xtype: 'radiofield',
                name: 'modeswitch',
                boxLabel: i18n.getMsg('messprogramme'),
                inputValue: 'messprogramme',
                handler: function(field, state) {
                    if (state === true) {
                        this.fireEvent('check', field);
                    }
                }
            }, {
                xtype: 'radiofield',
                name: 'modeswitch',
                boxLabel: i18n.getMsg('stammdaten'),
                inputValue: 'stammdaten',
                handler: function(field, state) {
                    if (state === true) {
                        this.fireEvent('check', field);
                    }
                }
            }]
        }];
        this.callParent(arguments);
    }
});
