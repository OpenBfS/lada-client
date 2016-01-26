/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to edit a Probe
 */
Ext.define('Lada.view.window.ProbeEdit', {
    extend: 'Ext.window.Window',
    alias: 'widget.probenedit',

    requires: [
        'Lada.view.form.Probe',
        'Lada.view.grid.Ortszuordnung',
        'Lada.view.grid.Probenzusatzwert',
        'Lada.view.grid.PKommentar',
        'Lada.view.grid.Messung'
    ],

    collapsible: true,
    maximizable: true,
    autoShow: true,
    autoScroll: true,
    layout: 'fit',
    constrain: true,

    record: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        if (this.record === null) {
            Ext.Msg.alert('Keine valide Probe ausgewählt!');
            this.callParent(arguments);
            return;
        }
        var extendedTitle = this.record.get('probeId') ? this.record.get('probeId') : '';
        this.title = '§3-Probe ' + extendedTitle;
        this.buttons = [{
            text: 'Schließen',
            scope: this,
            handler: this.close
        }];
        this.width = 700;

        // add listeners to change the window appearence when it becomes inactive
        this.on({
            activate: function(){
                this.getEl().removeCls('window-inactive');
            },
            deactivate: function(){
                this.getEl().addCls('window-inactive');
            }
        });

        this.height = Ext.getBody().getViewSize().height - 30;
        // InitialConfig is the config object passed to the constructor on
        // creation of this window. We need to pass it throuh to the form as
        // we need the "modelId" param to load the correct item.
        this.items = [{
            border: 0,
            autoScroll: true,
            items: [{
                xtype: 'probeform',
                recordId: this.record.get('id')
            }, {
                xtype: 'fset',
                name: 'orte',
                title: 'Ortsangaben',
                padding: '5, 5',
                margin: 5,
                items: [{
                    xtype: 'ortszuordnunggrid',
                    recordId: this.record.get('id')
                }]
             }, {
                xtype: 'fset',
                name: 'messungen',
                title: 'Messungen',
                padding: '5, 5',
                margin: 5,
                collapsible: false,
                collapsed: false,
                items: [{
                    xtype: 'messunggrid',
                    recordId: this.record.get('id')
                }]
            }, {
                xtype: 'fset',
                name: 'probenzusatzwerte',
                title: 'Zusatzwerte',
                padding: '5, 5',
                margin: 5,
                collapsible: true,
                collapsed: false,
                items: [{
                    xtype: 'probenzusatzwertgrid',
                    recordId: this.record.get('id')
                }]
            }, {
                xtype: 'fset',
                name: 'pkommentare',
                title: 'Kommentare',
                padding: '5, 5',
                margin: 5,
                collapsible: true,
                collapsed: false,
                items: [{
                    xtype: 'pkommentargrid',
                    recordId: this.record.get('id')
                }]
            }]
        }];
        this.callParent(arguments);
    },

     /**
      * Initialise the Data of this Window
      */
    initData: function() {
        this.setLoading(true);
        this.clearMessages();
        me = this;
        Ext.ClassManager.get('Lada.model.Probe').load(this.record.get('id'), {
            failure: function(record, action) {
                me.setLoading(false);
                // TODO
                console.log('An unhandled Failure occured. See following Response and Record');
                console.log(action);
                console.log(record);
             },
            success: function(record, response) {
                this.down('probeform').setRecord(record);
                this.record = record;
                owner = this.record.get('owner');

                if (owner) {
                    //Always allow to Add Messungen.
                    me.enableAddMessungen();
                }

                var json = Ext.decode(response.response.responseText);
                if (json) {
                    this.setMessages(json.errors, json.warnings);
                    if (!json.warnings.mediaDesk) {
                        this.down('probeform').setMediaDesk(record);
                    }
                }
                // If the Probe is ReadOnly, disable Inputfields and grids
                if (this.record.get('readonly') === true) {
                    this.down('probeform').setReadOnly(true);
                    this.disableChildren();
                }
                else {
                    this.down('probeform').setReadOnly(false);
                    this.enableChildren();
                }
                me.setLoading(false);
            },
            scope: this
        });
    },

    /**
     * Enable the Messungengrid
     */
    enableAddMessungen: function() {
        this.down('fset[name=messungen]').down('messunggrid').setReadOnly(false);
    },

    /**
     * Disable the Childelements of this window
     */
    disableChildren: function() {
        if (!this.record.get('owner')) {
            // Disable only when the User is not the owner of the Probe
            // Works in symbiosis with success callback some lines above.
            this.down('fset[name=messungen]').down('messunggrid').setReadOnly(true);
            this.down('fset[name=messungen]').down('messunggrid').readOnly = true;
        }
        this.down('fset[name=orte]').down('ortszuordnunggrid').setReadOnly(true);
        this.down('fset[name=orte]').down('ortszuordnunggrid').readOnly = true;
        this.down('fset[name=probenzusatzwerte]').down('probenzusatzwertgrid').setReadOnly(true);
        this.down('fset[name=probenzusatzwerte]').down('probenzusatzwertgrid').readOnly = true;
        this.down('fset[name=pkommentare]').down('pkommentargrid').setReadOnly(true);
        this.down('fset[name=pkommentare]').down('pkommentargrid').readOnly = true;
    },

    /**
     * Enable the Childelements of this window
     */
    enableChildren: function() {
        this.down('fset[name=messungen]').down('messunggrid').setReadOnly(false);
        this.down('fset[name=messungen]').down('messunggrid').readOnly = false;
        this.down('fset[name=orte]').down('ortszuordnunggrid').setReadOnly(false);
        this.down('fset[name=orte]').down('ortszuordnunggrid').readOnly = false;
        this.down('fset[name=probenzusatzwerte]').down('probenzusatzwertgrid').setReadOnly(false);
        this.down('fset[name=probenzusatzwerte]').down('probenzusatzwertgrid').readOnly = false;
        this.down('fset[name=pkommentare]').down('pkommentargrid').setReadOnly(false);
        this.down('fset[name=pkommentare]').down('pkommentargrid').readOnly = false;
    },

    /**
     * Instructs the fields / forms listed in this method to set a message.
     * @param errors These Errors shall be shown
     * @param warnings These Warning shall be shown
     */
    setMessages: function(errors, warnings) {
        this.down('probeform').setMessages(errors, warnings);
        var errorOrtText = '';
        var errorOrt = false;
        var warningOrtText = '';
        var warningOrt = false;
        var key;
        var content;
        var i;
        var keyText;
        var i18n = Lada.getApplication().bundle;
        for (key in errors) {
            if (key && key.indexOf('Ort') > -1) {
                errorOrt = true;
                content = errors[key];
                keyText = i18n.getMsg(key);
                for (i = 0; i < content.length; i++) {
                    errorOrtText += keyText + ': ' +
                        i18n.getMsg(content[i].toString()) + '\n';
                }
            }
        }
        for (key in warnings) {
            if (key && key.indexOf('Ort') > -1) {
                warningOrt = true;
                content = warnings[key];
                keyText = i18n.getMsg(key);
                for (i = 0; i < content.length; i++) {
                    warningOrtText += keyText + ': ' +
                        i18n.getMsg(content[i].toString()) + '\n';
                }
            }
        }
        this.down('fset[name=orte]').showWarningOrError(
            warningOrt,
            warningOrtText === '' ? null : warningOrtText,
            errorOrt,
            errorOrtText === '' ? null : errorOrtText);
    },

    /**
     * Instructs the fields / forms listed in this method to clear their messages.
     */
    clearMessages: function() {
        this.down('probeform').clearMessages();
        this.down('fset[name=orte]').clearMessages();
    }
});
