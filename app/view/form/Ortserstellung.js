/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Form to create a new Messpunkt
 */
Ext.define('Lada.view.form.Ortserstellung', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ortserstellungsform',
    requires: [
        'Lada.view.widget.Verwaltungseinheit',
        'Lada.view.widget.Staat'
    ],
    model: null,

    margin: 5,

    border: 0,

    record: null,

    trackResetOnLoad: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.items = [{
            xtype: 'netzbetreiber',
            editable: false,
            readOnly: true,
            submitValue: true,
            border: 0,
            fieldLabel: i18n.getMsg('netzbetreiberId'),
            labelWidth: 125,
            value: Lada.netzbetreiber[0]
        }, {
            xtype: 'textfield',
            name: 'ortId',
            maxLength: 10,
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.ortId')
        }, {
            xtype: 'checkbox',
            labelWidth: 125,
            name: 'aktiv',
            fieldLabel: 'aktiv:'
        },{
            xtype: 'staat',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('staat'),
            name: 'staatId',
            forceSelection: true,
            listeners: {
                change: {
                    fn: function() { me.checkCommitEnabled() }
                }
            }
        }, {
            xtype: 'verwaltungseinheit',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.verwaltungseinheit'),
            forceSelection: true,
            name: 'gemId',
            listeners: {
                change: {
                    fn: function() { me.checkCommitEnabled() }
                }
            }
        }, {
            xtype: 'numfield',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.kda'),
            allowDecimals: false,
            maxLength: 1,
            name: 'kdaId',
            listeners: {
                change: {
                    fn: function() { me.checkCommitEnabled() }
                }
            }
        }, {
            xtype: 'numfield',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.koordx'),
            name: 'koordXExtern',
            allowDecimals: true,
            decimalPrecision: 5,
            maxLength: 22,
            listeners: {
                change: {
                    fn: function() { me.checkCommitEnabled() }
                }
            }
        }, {
            xtype: 'numfield',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.koordy'),
            name: 'koordYExtern',
            allowDecimals: true,
            decimalPrecision: 5,
            maxLength: 22,
            listeners: {
                change: {
                    fn: function() { me.checkCommitEnabled() }
                }
            }
        }, {
            xtype: 'numfield',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.hoeheLand'),
            name: 'hoeheLand',
            maxLength: 10,
            allowDecimals: true
        }, {
            xtype: 'tfield',
            labelWidth: 125,
            maxLength: 15,
            name: 'kurztext',
            fieldLabel: i18n.getMsg('orte.kurztext')
        },{
            xtype: 'tfield',
            labelWidth: 125,
            maxLength: 100,
            fieldLabel: i18n.getMsg('orte.langtext'),
            name: 'langtext'
        },{
            xtype: 'tfield',
            labelWidth: 125,
            maxLength: 70,
            fieldLabel: i18n.getMsg('orte.berichtstext'),
            name: 'berichtstext'
        }, {
            xtype: 'kta',
            labelWidth: 125,
            maxLength: 100,
            name: 'anlageId',
            fieldLabel: i18n.getMsg('orte.anlageId')
        }, {
            xtype: 'tfield',
            labelWidth: 125,
            maxLength: 1,
            name: 'zone',
            fieldLabel: i18n.getMsg('orte.zone')
        },{
            xtype: 'tfield',
            labelWidth: 125,
            maxLength: 2,
            name: 'sektor',
            fieldLabel: i18n.getMsg('orte.sektor')
        },{
            xtype: 'orttyp',
            labelWidth: 125,
            maxLength: 100,
            name: 'ortTyp',
            fieldLabel: i18n.getMsg('orte.ortTyp')
        },{
            xtype: 'tfield',
            labelWidth: 125,
            maxLength: 10,
            name: 'zustaendigkeit',
            fieldLabel: i18n.getMsg('orte.zustaendigkeit')
        },{
            xtype: 'tfield',
            labelWidth: 125,
            maxLength: 10,
            name: 'mpArt',
            fieldLabel: i18n.getMsg('orte.mpArt')
        },{
            xtype: 'tfield',
            labelWidth: 125,
            maxLength: 10,
            name: 'nutsCode',
            fieldLabel: i18n.getMsg('orte.nutsCode')
        },{
            xtype: 'ortszusatz',
            labelWidth: 125,
            maxLength: 7,
            name: 'ozId',
            fieldLabel: i18n.getMsg('orte.ozId')
        }];

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            border: '0, 1, 1, 1',
            style: {
                borderBottom: '1px solid #b5b8c8 !important',
                borderLeft: '1px solid #b5b8c8 !important',
                borderRight: '1px solid #b5b8c8 !important'
            },
            items: ['->', {
                text: i18n.getMsg('save'),
                action: 'save',
                qtip: 'Daten speichern',
                icon: 'resources/img/dialog-ok-apply.png',
                disabled: true
            }, {
                text: i18n.getMsg('discard'),
                qtip: 'Änderungen verwerfen',
                icon: 'resources/img/dialog-cancel.png',
                action: 'revert',
            }]
        }];

        this.callParent(arguments);
        this.getForm().loadRecord(this.record);
    },

    /**
     * checks if the Messpunkt can be committed.
     * Disables the save button if false
     */
    checkCommitEnabled: function() {
        var savebutton =  this.down('toolbar').down('button[action=save]');
        var form = this.getForm();
        if (form.isDirty()) {
            if (form.findField('kdaId').getValue() ||
                form.findField('koordYExtern').getValue() ||
                form.findField('koordXExtern').getValue()) {
                if (this.checkCoordinates()) {
                    savebutton.setDisabled(false);
                } else {
                    savebutton.setDisabled(true);
                }
            } else if (form.findField('gemId').getValue() ||
                form.findField('staatId').getValue() >= 0 ) {
                savebutton.setDisabled(false);
            } else {
                savebutton.setDisabled(true);
            }
        } else {
            savebutton.setDisabled(true);
        }
    },

    /**
     * Validates the coordinate fields kdaId, koordXExtern, koordYExtern
     */
    checkCoordinates: function() {
        var x = this.getForm().findField('koordXExtern').getValue();
        var y = this.getForm().findField('koordYExtern').getValue();
        var kda = this.getForm().findField('kdaId').getValue();
        if (x && y && kda) {
            if (kda === 4){
                if (x > -180 && x < 180
                    && y > -90 && y < 90) {
                    return true;
                } else {
                    // TODO: WGS84 (degrees- decimal), coordinates invalid
                    return false;
                }
            } else if (kda === 5){
                if (x >= 1000000 && x < 61000000 &&
                    y > -10000000 && y < 10000000) {
                    return true;
                } else {
                    // TODO: UTM, coordinates invalid
                    return false;
                }
            } else {
                // TODO KDA not supported
                return false;
            }
        } else {
            // TODO: not all fields filled in
            return false;
        }
    },

    saveOrt: function() {
        var this_panel = this.up('panel');
        var me = this;
        var form = this_panel.getForm();
        var record = form.getRecord();
        var data = form.getFieldValues(true);
        for (var key in data) {
            record.set(key, data[key]);
        }
        record.set('id', null);
        record.set('netzbetreiberId', Lada.netzbetreiber[0]);
        record.save({
            success: function(newrecord, response) {
                form.loadRecord(newrecord);
                this_panel.down('verwaltungseinheit').store.load(
                        { id:newrecord.get('gemId') });
                console.log(this_panel.down('verwaltungseinheit'));
                this_panel.down('staat').store.load(
                        { id : newrecord.get('staat') });
                me.setDisabled(true);
                me.hide();
                var ozw = this_panel.up().parentWindow;
                var json = Ext.decode(response.response.responseText);
                if (json) {
                    this_panel.clearMessages();
                    this_panel.setMessages(json.errors, json.warnings);
                }
                ozw.ortstore.load({
                    callback: function(records, operation, success) {
                        ozw.down('map').addLocations(ozw.ortstore);
                        var osg = ozw.down('ortstammdatengrid');
                        osg.setStore(ozw.ortstore);
                        var id = Ext.decode(response.response.responseText).data.id;
                        var record = osg.store.getById(id);
                        var selmod = osg.getView().getSelectionModel();
                        selmod.select(record);
                        var resulttext;
                        if (json) {
                            if (json.message == '201') {
                                resulttext = 'Dieser Ort existiert bereits!';
                            }
                            if (json.message == '200') {
                                resulttext = 'Ort erfolgreich angelegt!';
                            }
                        }
                        Ext.Msg.show({
                            title: Lada.getApplication().bundle.getMsg('success'),
                            autoScroll: true,
                            msg: resulttext,
                            buttons: Ext.Msg.OK
                        });
                    },
                    scope: this
                });

            },
            failure: function(record, response) {
                var json = Ext.decode(response.response.responseText);
                if (json) {
                    if(json.errors.totalCount > 0 || json.warnings.totalCount > 0){
                        formPanel.setMessages(json.errors, json.warnings);
                    }
                    if(json.message){
                        Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title')
                            +' #'+json.message,
                             Lada.getApplication().bundle.getMsg(json.message));
                    } else {
                         Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
                             Lada.getApplication().bundle.getMsg('err.msg.generic.body'));
                    }
                } else {
                    Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
                        Lada.getApplication().bundle.getMsg('err.msg.response.body'));
                }
                me.setDisabled(true);
            }
        });
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
        // TODO: this is a stub
     }

});
