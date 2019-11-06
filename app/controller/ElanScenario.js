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
            }
        },
        global: {
            'elanEventsReceived': 'handleElanEventsReceived',
            'elanEventsUpdated': 'handleElanEventsUpdated',
            'localElanStorageUpdated': 'handleLocalElanStorageUpdated'
        }
    },

    handleElanEventsReceived: function(success) {
        var button = Ext.ComponentQuery.query('elanscenariobutton')[0];
        if (!success) {
            button.setState(Lada.view.widget.ElanScenarioButton.states.EVENTS_NONE);
        } else {
            button.setState(Lada.view.widget.ElanScenarioButton.states.EVENTS_OLD);
        }
    },

    handleElanEventsUpdated: function(elanId, routineMode) {
        var button = Ext.ComponentQuery.query('elanscenariobutton')[0];
        if (routineMode) {
            button.setState(Lada.view.widget.ElanScenarioButton.states.EVENTS_NONE);
        } else {
            button.setState(Lada.view.widget.ElanScenarioButton.states.EVENTS_CHANGED);
        }
    },

    handleLocalElanStorageUpdated: function() {
        var window = Ext.ComponentQuery.query('elanscenariowindow')[0];
        if (window) {
            window.update();
        }
    },

    showElanScenarios: function(button) {
        var win = Ext.getCmp('elanwindowid');
        if (!win) {
            win = Ext.create('Lada.view.window.ElanScenarioWindow');
            win.show();
        } else {
            win.update();
            win.isVisible() ? win.focus(): win.show();
        }
        button.setState(Lada.view.widget.ElanScenarioButton.states.EVENTS_OLD);

    }
});