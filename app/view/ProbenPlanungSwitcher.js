/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * This is a Widget for a ProbenPlanungSwitcher
 */
Ext.define('Lada.view.ProbenPlanungSwitcher', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.probenplanungswitcher',

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
        this.items= [{
            xtype: 'radiogroup',
            columns: 1,
            width: '100%',
            items: [{
                xtype: 'radiofield',
                name: 'ppswitch',
                boxLabel: i18n.getMsg('probelist'),
                inputValue: 'ProbeList', //this determines the store
                    // which will be loaded,
                //checked: true,
                handler: function(field, state){
                    if (state === true) {
                        this.fireEvent('check', field);
                    }
                }
            },{
                xtype: 'radiofield',
                name: 'ppswitch',
                boxLabel: i18n.getMsg('probeplanning'),
                inputValue: 'MessprogrammList', //name of a store
                handler: function(field, state){
                    if (state === true) {
                        this.fireEvent('check', field);
                    }
                }
            }]
        }];
        this.callParent(arguments);
    }
});
