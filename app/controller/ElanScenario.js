/* Copyright (C) 2019 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
  * Controller listening to new ElanScenarios and controlling the scenario button and window
  */
Ext.define('Lada.controller.ElanScenario', {
    extend: 'Ext.app.Controller',

    listen: {
        component: {
            'button[action=elanscenarios]': {
                click: 'showElanScenarios'
            },
            'window[id=elanwindowid]': {
                hide: 'handleElanWindowHidden'
            }
        },
        global: {
            'elanEventsReceived': 'handleElanEventsReceived',
            'elanEventsUpdated': 'handleElanEventsUpdated',
            'localElanStorageUpdated': 'handleLocalElanStorageUpdated'
        }
    },

    /**
     * Array saving changes until the window is shown
     */
    changes: [],

    /**
     * Handles the reception of elan events.
     * @param {boolean} success True if request was successfull
     */
    handleElanEventsReceived: function(success) {
        var button = Ext.ComponentQuery.query('elanscenariobutton')[0];
        if (!success) {
            button.setState(Lada.view.widget.ElanScenarioButton.states.EVENTS_NONE);
        } else {
            if (button.getState() !== Lada.view.widget.ElanScenarioButton.states.EVENTS_CHANGED) {
                button.setState(Lada.view.widget.ElanScenarioButton.states.EVENTS_OLD);
            }
        }
    },

    /**
     * Handles update of elan events
     * @param {[string]} elanIds Ids of changed events
     * @param {boolean} routineMode True if there is only an event
     */
    handleElanEventsUpdated: function(elanIds, routineMode) {
        var me = this;
        var button = Ext.ComponentQuery.query('elanscenariobutton')[0];
        var window = Ext.getCmp('elanwindowid');
        if (routineMode) {
            button.setState(Lada.view.widget.ElanScenarioButton.states.EVENTS_NONE);
        } else {
            button.setState(Lada.view.widget.ElanScenarioButton.states.EVENTS_CHANGED);
            //If window is shown
            if (window) {
                //Mark event as changed
                elanIds.forEach(function(elanId) {
                    window.eventChanged(elanId);
                });
                if (window.isVisible()) {
                    window.update();
                }
            } else {
                // Save changes for the next window
                elanIds.forEach(function(elanId) {
                    if (!Ext.Array.contains(me.changes, elanId)) {
                        me.changes.push(elanId);
                    }
                });
            }
        }
    },

    /**
     * Handles update of the local storage
     */
    handleLocalElanStorageUpdated: function() {
        var win = Ext.getCmp('elanwindowid');
        if (win) {
            win.updateEventList();
        }
    },

    /**
     * Button handler that show the event window
     * @param {} button
     */
    showElanScenarios: function(button) {
        var win = Ext.getCmp('elanwindowid');
        if (!win) {
            win = Ext.create('Lada.view.window.ElanScenarioWindow', {
                changes: this.changes
            });
            win.show();
        } else {
            if (win.isVisible()) {
                win.focus();
            } else {
                win.show();
            }
            if (win.hasChanges()) {
                win.update();
            }
        }
        button.setState(Lada.view.widget.ElanScenarioButton.states.EVENTS_OLD);
    },

    /**
     * Handles hidden event of elan windows.
     * Reset button state as the window events has been read by the user
     */
    handleElanWindowHidden: function() {
        var button = Ext.ComponentQuery.query('button[action=elanscenarios]')[0];
        if (button) {
            button.setState(Lada.view.widget.ElanScenarioButton.states.EVENTS_OLD);
        }
    }
});
