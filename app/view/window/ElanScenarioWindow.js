/* Copyright (C) 2019 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Singleton window showing elan scenario information.
 */
Ext.define('Lada.view.window.ElanScenarioWindow', {
    extend: 'Ext.window.Window',
    alias: 'window.elanscenariowindow',

    /**
     * Component id. Should not be changed, as there should only be one event
     * window which can be updated.
     */
    id: 'elanwindowid',

    /**
     * @private
     * Array containing ids of changed events
     */
    changes: [],

    closeAction: 'method-hide',

    /**
     * Object containing event objects and display html strings
     */
    eventObjs: {},

    /**
     * Html templates to be used for various entries.
     * The String $VALUE will be replaced by scenario content
     */
    displayTemplate: {
        //Used for title string
        // eslint-disable-next-line max-len
        title: '<p style=\'font-size: 1.5em; margin: 25px 0 5px 0;\'><a href="$LINK" target="_blank"> $VALUE</a></p>',
        //Use for string that marks the event as changed or unchanged
        change: {
            changed: '<div style=\'color:red; margin: 0;\'>$VALUE<br></div>',
            unchanged: '$VALUE<br>'
        },
        //Used for event keys
        key: {
            //Field was modified
            unchanged: '<b>$VALUE</b>: ',
            //Field is unmodified
            changed: '<div style=\'color:red; margin: 0;\'><b>$VALUE</b>: '
        },
        //Used for event values
        value: {
            unchanged: '$VALUE <br>',
            changed: '$VALUE<br></div>'
        }
    },

    /**
     * Keys to be displayed in the event window
     */
    displayValues: ['description',
        'EventType.title',
        'TimeOfEvent',
        'OperationMode.title',
        'SectorizingNetworks',
        'SectorizingSampleTypes',
        'modified',
        'modified_by'
    ],

    height: 550,

    layout: 'fit',

    /**
     * Key that contains the event title
     */
    titleProperty: 'title',

    /**
     * Key that contains the hyperlink to the event
     */
    linkProperty: '@id',

    title: 'Dokpool-Messenger',

    width: 450,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.title = i18n.getMsg('title.elanscenarios');
        this.items = [{
            xtype: 'panel',
            layout: 'fit',
            margin: '5 5 5 5',
            html: 'No events',
            scrollable: true
        }];
        this.bbar = ['->', {
            xtype: 'button',
            text: i18n.getMsg('close'),
            handler: function() {
                me.close();
            }
        }];

        this.eventObjs = Lada.util.LocalStorage.getDokpoolEvents();
        this.callParent(arguments);
    },

    /**
     * Saves event that have been changed
     * @param {String} eventId Event ID that has changed
     */
    eventChanged: function(eventId) {
        this.changes.push(eventId);
    },

    /**
     * Get fields of an event that changed since last update
     * @param {Object} event Event object
     * @return {Array} Array containing the names of the changed fields
     */
    getChanges: function(event) {
        var me = this;
        var changes = [];
        var id = event.id;
        me.displayValues.forEach(function(key) {
            if (me.eventObjs[id] === null ||
                me.getPropertyByString(me.eventObjs[id], key) === null ||
                    me.getPropertyByString(me.eventObjs[id], key) !==
                    me.getPropertyByString(event, key)
            ) {
                changes.push(key);
            }
        });
        return changes;
    },

    /**
     * Get object property by string
     * @param {Object} o Object to get property from
     * @param {String} s String path
     * @return {} Property
     */
    getPropertyByString: function(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1');
        s = s.replace(/^\./, '');
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
                if (Array.isArray(o) && o.length > 0) {
                    if (o[0].hasOwnProperty('title')) {
                        // currently true for all second level arrays
                        o = o.map(function(x) {
                            return x.title;
                        });
                    } else {
                        return JSON.stringify(o);
                    }
                }
            } else {
                return;
            }
        }
        return o;
    },

    /**
     * Check if this window has pending changes that has not been shown
     * @return true If changes are pending.
     */
    hasChanges: function() {
        return this.changes.length > 0;
    },

    /**
     * Parse elan object and create a String representation
     * @param {Object} scenario Scenario object
     * @return String represenation
     */
    parseElanObject: function(scenario) {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var scenarioString = '';

        //Add title
        var title = scenario[me.titleProperty];
        scenarioString += me.displayTemplate.title.replace('$VALUE', title);
        //Add hyperlink to title
        var link = scenario[me.linkProperty];
        scenarioString = scenarioString.replace('$LINK', link);

        //Check if Scenario was changed
        var changeString = i18n.getMsg('elan.unchanged');
        var changeTemplate = me.displayTemplate.change.unchanged;
        if (Ext.Array.contains(me.changes, scenario.id)) {
            changeString = i18n.getMsg('elan.changed');
            changeTemplate = me.displayTemplate.change.changed;
        }
        scenarioString += changeTemplate.replace('$VALUE', changeString);

        //Check for changes since last update
        var changedFields = Ext.Array.contains(me.changes, scenario.id) ?
            me.getChanges(scenario): [];

        //Add display values
        Ext.Array.each(this.displayValues, function(key) {
            var value = me.getPropertyByString(scenario, key);//scenario[key];
            if (!value || value.length !== undefined && value.length === 0) {
                return true;
            }
            var keyString = i18n.getMsg('elan.' + key);
            if (typeof value === 'boolean') {
                value = value? i18n.getMsg('true'): i18n.getMsg('false');
            }

            //Choose template
            var keyTpl;
            var valTpl;
            if (Ext.Array.contains(me.changes, scenario.id)
                && Ext.Array.contains(changedFields, key)) {
                keyTpl = me.displayTemplate.key.changed;
                valTpl = me.displayTemplate.value.changed;
            } else {
                keyTpl = me.displayTemplate.key.unchanged;
                valTpl = me.displayTemplate.value.unchanged;
            }
            scenarioString += keyTpl.replace('$VALUE', keyString);
            scenarioString += valTpl.replace('$VALUE', value);
        });
        return scenarioString;
    },

    /**
     * Update window content and call show
     */
    show: function() {
        this.update();
        this.callParent(arguments);
    },

    /**
     * Sort an object holding events by modified date
     * @param {Object} newEvents Event object
     * @return {Array} containing object ids, sorted by modified date, asc.
     */
    sortEventsByModifiedDate: function(newEvents) {
        return Ext.Array.sort(Ext.Object.getKeys(newEvents),function(a, b) {
            if (newEvents[a]['modified'] > newEvents[b]['modified']) {
                return -1;
            } else if (newEvents[a]['modified'] < newEvents[b]['modified']) {
                return 1;
            }
            return 0;
        });
    },

    /**
     * Updates the event list without updating its content.
     * Can be used to remove a now inactive event without reseting
     * change markers.
     */
    updateEventList: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var content = '';
        var newEvents = me.eventObjs;

        //Check if an event has been removed
        var eventKeys = Lada.util.LocalStorage.getDokpoolEventKeys();
        Ext.Object.each(newEvents, function(key) {
            if (!Ext.Array.contains(eventKeys, key)) {
                delete newEvents[key];
            }
        });

        //Sort events by modified date
        var displayOrder = me.sortEventsByModifiedDate(newEvents);

        if (!newEvents || newEvents === '') {
            content = i18n.getMsg('window.elanscenario.emptytext');
        }
        displayOrder.forEach(function(key) {
            var value = me.eventObjs[key].displayText;
            content += value + '<br />';
        });
        this.down('panel').setHtml(content);
    },

    /**
     * Update the window content using the localStorage module.
     * Note: The event content itself is not refresh using the remote server
     * @param {boolean} preserveChanges If true, changes are not cleared
     */
    update: function(preserveChanges) {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        var content = '';
        var newEvents = Lada.util.LocalStorage.getDokpoolEvents();

        //Sort events by modified date
        var displayOrder = me.sortEventsByModifiedDate(newEvents);

        if (!newEvents || newEvents === '') {
            content = i18n.getMsg('window.elanscenario.emptytext');
        }
        Ext.Object.each(newEvents, function(key, value) {
            var text = me.parseElanObject(value);
            newEvents[key].displayText = text;
        });
        displayOrder.forEach(function(key) {
            var value = newEvents[key].displayText;
            content += value + '<br />';
        });
        this.down('panel').setHtml(content);
        me.eventObjs = newEvents;
        if (preserveChanges !== true) {
            this.changes = [];
        }
    }
});
