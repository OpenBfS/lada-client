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
    readOnly: true,
    editable: false,
    alias: 'widget.statuskombi',
    store: Ext.data.StoreManager.get('status'),
    trackResetOnLoad: true,
    buttonListener: null,
    currentValue: {
        statusStufe: null,
        statusWert: null
    },

    initComponent: function() {
        this.textFieldCls = 'status-empty';
        this.callParent(arguments);
    },

    changebutton: function() {
        var btn = Ext.create('Ext.Button', {
            margin: '0 5',
            text: 'Status ändern',
            tooltip: 'neuen Status vergeben',
            action: 'newstatus',
            disabled: true,
            listeners: this.buttonListener
        });
        return btn;
    },

    resetbutton: function() {
        var btn = Ext.create('Ext.Button', {
            margin: '0 5',
            text: 'Zurücksetzen',
            tooltip: 'letzte Statusänderung zurücknehmen',
            action: 'resetstatus',
            disabled: true,
            listeners: this.buttonListener
        });
        return btn;
    },

    setValue: function(value) {
        var me = this;
        Ext.ClassManager.get('Lada.model.Status').load(value, {
            success: function(record, response) {
                var statuskombistore = Ext.data.StoreManager.get('statuskombi');
                var kombi = statuskombistore.getById(record.data.statusKombi);
                var text = kombi.get('statusStufe').stufe + ' - ' +
                        kombi.get('statusWert').wert;
                //me.down('textfield').setValue(text);
                me.currentValue = {
                    statusStufe: kombi.get('statusStufe'),
                    statusWert: kombi.get('statusWert')
                };
                var textfield = me.down('textfield');
                if (textfield) {
                    textfield.setEmptyText(text);
                }
            }
        });
        // instead of overwriting/appending initComponent, add the button at loading of values
        var button = this.down('button[action=newstatus]');
        if (!button) {
            this.add(this.changebutton());
        }
        button = this.down('button[action=resetstatus]');
        if (!button) {
            this.add(this.resetbutton());
        }
    },


    setReadOnly: function(readonly) {
        var button = this.down('button[action=newstatus]');
        if (!readonly) {
            button.setDisabled(false);
        } else {
            button.setDisabled(true);
        }
    },

    setResetable: function(resetable) {
        var button = this.down('button[action=resetstatus]');
        if (resetable) {
            button.setDisabled(false);
        } else {
            button.setDisabled(true);
        }
    }

});
