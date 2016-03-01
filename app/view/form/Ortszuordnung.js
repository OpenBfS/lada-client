/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Form to edit the Ortszuordnung of a Probe
 */
Ext.define('Lada.view.form.Ortszuordnung', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ortszuordnungform',

    model: 'Lada.model.Ortszuordnung',

    requires: [
        'Lada.view.widget.Verwaltungseinheit',
        'Lada.view.widget.Staat'
    ],

    layout: 'fit',
    margin: 5,
    border: 0,

    record: null,

    trackResetOnLoad: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            xtype: 'fieldset',
            title: i18n.getMsg('ortszuordnung.form.fset.title'),
            layout: 'fit',
            items: [{
                layout: 'hbox',
                border: 0,
                margin: '0, 0, 10, 0',
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    border: '0, 1, 1, 1',
                    style: {
                        borderBottom: '1px solid #b5b8c8 !important',
                        borderLeft: '1px solid #b5b8c8 !important',
                        borderRight: '1px solid #b5b8c8 !important'
                    },
                    items: [{
                        text: i18n.getMsg('ortszuordnung.form.setOrt'),
                        qtip: i18n.getMsg('ortszuordnung.form.setOrt.qtip'),
                        icon: 'resources/img/dialog-ok-apply.png',
                        action: 'setOrt',
                        enableToggle: true,
                        disabled: true
                    }, '->', {
                        text: i18n.getMsg('save'),
                        qtip: i18n.getMsg('save.qtip'),
                        icon: 'resources/img/dialog-ok-apply.png',
                        action: 'save',
                        disabled: true
                    }, {
                        text: i18n.getMsg('discard'),
                        qtip: i18n.getMsg('discard.qtip'),
                        icon: 'resources/img/dialog-cancel.png',
                        action: 'discard',
                        disabled: true
                    }]
                }],
                items: [{
                    layout: 'vbox',
                    border: 0,
                    margin: '0, 10, 0, 0',
                    items: [{
                        xtype: 'tfield',
                        labelWidth: 125,
                        maxLength: 100,
                        name: 'ortszusatztext',
                        fieldLabel: i18n.getMsg('ortszuordnung.form.field.ortszusatztext')
                    }, {
                        xtype: 'tfield',
                        labelWidth: 125,
                        maxLength: 100,
                        name: 'ortszuordnungTyp',
                        fieldLabel: i18n.getMsg('ortszuordnung.form.field.ortszuordnungtyp')
                    }, {
                        xtype: 'textfield',
                        submitValue: true,
                        readOnly: true,
                        hidden: true,
                        name: 'ortId'
                    }]
                }, {
                    layout: 'vbox',
                    flex: 1,
                    margin: '0, 10, 0, 0',
                    border: 0,
                    items: [{
                        xtype: 'displayfield',
                        labelWidth: 125,
                        fieldLabel: i18n.getMsg('orte.gemeinde'),
                        name: 'gemeinde'
                    }, {
                        xtype: 'displayfield',
                        labelWidth: 125,
                        fieldLabel: i18n.getMsg('staat'),
                        name: 'staat'
                    }]
                }, {
                    layout: 'vbox',
                    flex: 1,
                    margin: '0, 10, 0, 0',
                    border: 0,
                    items: [{
                        xtype: 'displayfield',
                        labelWidth: 125,
                        fieldLabel: i18n.getMsg('orte.lon'),
                        name: 'lon'
                    }, {
                        xtype: 'displayfield',
                        labelWidth: 125,
                        fieldLabel: i18n.getMsg('orte.lat'),
                        name: 'lat'
                    }]
                }]
            }]
        }];
        this.callParent(arguments);
    },

    setRecord: function(record) {
        this.getForm().loadRecord(record);

        if (! record.get('readonly')) {
            this.down('[action=setOrt]').enable();
            this.setReadOnly(false);
        }
        else {
            this.setReadOnly(true);
        }
        var ortId = this.getRecord().get('ortId');
        this.refreshOrt(ortId);
    },

    refreshOrt: function(ortId) {
        var orteStore = Ext.StoreManager.get('orte');
        var ort = orteStore.getById(ortId);
        var verwStore = Ext.StoreManager.get('verwaltungseinheiten');
        var verw = verwStore.getById(ort.get('gemId'));
        var staatStore = Ext.StoreManager.get('staaten');
        var staat = staatStore.getById(ort.get('staatId'));

        this.getForm().setValues({
            gemeinde: verw.get('bezeichnung'),
            staat: staat.get('staatIso'),
            lon: ort.get('longitude'),
            lat: ort.get('latitude')
        });
    },

    /**
     * setOrt can be called from a CallbackFunction, ie select from a grid.
     *  it will set the ortId of this record
     */
    setOrt: function(row, selRecord, index, opts) {
        var newOrtId = selRecord.get('id');
        var r = this.getRecord();
        if (newOrtId) {
            if (newOrtId != r.get('ortId')) {
                r.set('ortId', newOrtId);
                this.getForm().setValues({ortId: newOrtId});
                this.refreshOrt(newOrtId);
                //set dirty...
                this.fireEvent('dirtychange', this.getForm(), true);
            }
        }
    },

    setMessages: function(errors, warnings) {
        var key;
        var element;
        var content;
        var i18n = Lada.getApplication().bundle;
        if (warnings) {
            for (key in warnings) {
                element = this.down('component[name=' + key + ']');
                if (!element) {
                    continue;
                }
                content = warnings[key];
                var warnText = '';
                for (var i = 0; i < content.length; i++) {
                    warnText += i18n.getMsg(content[i].toString()) + '\n';
                }
                element.showWarnings(warnText);
            }
        }
        if (errors) {
            for (key in errors) {
                element = this.down('component[name=' + key + ']');
                if (!element) {
                    continue;
                }
                content = errors[key];
                var errorText = '';
                for (var i = 0; i < content.length; i++) {
                    errorText += i18n.getMsg(content[i].toString()) + '\n';
                }
                element.showErrors(errorText);
            }
        }
     },

    clearMessages: function() {
        this.down('tfield[name=ortszusatztext]').clearWarningOrError();
        this.down('tfield[name=ortszuordnungTyp]').clearWarningOrError();
     },

    setReadOnly: function(value) {
        this.down('tfield[name=ortszusatztext]').setReadOnly(value);
        this.down('tfield[name=ortszuordnungTyp]').setReadOnly(value);
    }
});

