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
    extend: 'Ext.form.RadioGroup',
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
       this.items= [{
            xtype: 'panel',
            border: false,
            items: [{
                xtype: 'radiogroup',
                fieldLabel: i18n.getMsg('modus'),
                //labelWidth: '30 px',
                columns: 'auto',
                vertical: false,
                width: '100%',
                items: [{
                    xtype: 'radiofield',
                    name: 'ppswitch',
                    boxLabel: i18n.getMsg('probelist'),
                    boxLabelAlign: 'before',
                    inputValue: 'probenliste',
                    checked: true,
                    handler: function(field, state){
                        if (state === true) {
                            this.fireEvent('check', field);
                        }
                    }
                },{
                    xtype: 'radiofield',
                    name: 'ppswitch',
                    boxLabel: i18n.getMsg('probeplanning'),
                    boxLabelAlign: 'before',
                    inputValue: 'probenplanung',
                    handler: function(field, state){
                        if (state === true) {
                            this.fireEvent('check', field);
                        }
                    }
                 }]
            }]
       }];
       this.callParent(arguments);
    }
});
