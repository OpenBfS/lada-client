/* Copyright (C) 2019 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Button widget which changes its style depending on its current state.
 */
Ext.define('Lada.view.widget.ElanScenarioButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.elanscenariobutton',

    statics: {
        /**
         * Available states
         */
        states: {
            /**
             * New events were received or current events changed
             */
            EVENTS_CHANGED: 0,
            /**
             * Current events were already ready read by the user
             */
            EVENTS_OLD: 1,
            /**
             * No Events are available
             */
            EVENTS_NONE: 2
        }
    },

    /**
     * {Lada.view.widget.ElanScenarioButton.states}
     * Current state
     */
    state: null,

    /**
     * Init function
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.text = i18n.getMsg('elanscenarios');
        this.callParent(arguments);
        if (this.state) {
            this.setState(state);
        } else {
            this.setState(Lada.view.widget.ElanScenarioButton.states.EVENTS_NONE);
        }
    },

    /**
     * Set the current state and change style accordingly.
     * If in invalid state is passed, the current state is set to EVENTS_NONE.
     * @param {Lada.view.widget.ElanScenarioButton.states} state The new state
     */
    setState: function(state) {
        var states = Lada.view.widget.ElanScenarioButton.states;
        switch (state) {
            case states.EVENTS_CHANGED:
                this.show();
                this.setIconCls('x-fa fa-exclamation-triangle');
                this.addCls('x-lada-elan-button-new');
                break;
            case states.EVENTS_OLD:
                this.show();
                this.removeCls('x-lada-elan-button-new');
                this.setIconCls('x-fa fa-check');
                break;
            case states.EVENTS_NONE:
                this.hide();
                break;
            default:
                console.log('Unknown event state: ' + state);
                state = states.EVENTS_NONE;
        }
        this.state = state;
    }
})