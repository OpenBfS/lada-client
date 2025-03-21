/* Copyright (C) 2017 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Widget for Status/Stufe display and setting
 */
Ext.define('Lada.view.widget.Statuskombi', {
    extend: 'Lada.view.widget.base.TextField',
    editable: false,
    alias: 'widget.statuskombi',
    layout: 'hbox',
    store: Ext.data.StoreManager.get('status'),
    trackResetOnLoad: true,
    buttonListener: null,
    currentValue: {
        statusStufe: null,
        statusWert: null
    },
    /** True if widget has just been reset */
    reset: false,
    /** True if status editing is allowed */
    statusEdit: false,
    /**An array of statusKombi states for which the reset button is disabled */
    unresetableStates: [{
        statusWert: 0,
        statusStufe: 1
    }],

    initComponent: function() {
        this.textFieldCls = 'status-empty';
        this.callParent(arguments);

        var i18n = Lada.getApplication().bundle;
        this.add({
            xtype: 'button',
            text: i18n.getMsg('button.changestatus'),
            tooltip: i18n.getMsg('button.changestatus.qtip'),
            action: 'newstatus',
            margin: '0 5 0 5',
            disabled: true,
            listeners: this.buttonListener
        });
    },


    /**
     * Sets the widget value, adds buttons if needed and checks if reset button
     * is activated
     * @param kombi A Kombi-Object
     * @param reset True if widget was reset, defaults to false
     * @param statusEdit True if it is allowed to set the status,
     * defaults to false
     */
    setValue: function(kombi, reset, statusEdit) {
        this.reset = reset !== undefined ? reset : false;
        this.statusEdit = statusEdit !== undefined ? statusEdit : false;
        var text = kombi.get('statusLev').lev + ' - ' +
                kombi.get('statusVal').val;

        this.currentValue = {
            statusStufe: kombi.get('statusLev'),
            statusWert: kombi.get('statusVal')
        };
        //Try updating the view
        try {
            var textfield = this.down('textfield');
            if (textfield) {
                textfield.setEmptyText(text);
            }
        } catch (e) {
            Ext.log({
                msg: 'Updating status kombi field failed: ' + e,
                level: 'warn'});
        }

    },


    /**
     * Checks if the current value is unresetable
     * @return True if state is resetable, else false
     */
    checkResetableState: function() {
        for (var i = 0; i < this.unresetableStates.length; i++) {
            var state = this.unresetableStates[i];
            if (
                this.currentValue.statusStufe.id === state.statusStufe &&
                this.currentValue.statusWert.id === state.statusWert
            ) {
                return false;
            }
        }
        return true;
    },

    setReadOnly: function(readonly) {
        this.down('button[action=newstatus]').setDisabled(readonly);
    },

    setResetable: function(resetable) {
        this.down('button[action=resetstatus]').setDisabled(!resetable);
    }

});
