/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Form to create a new Messpunkt
 * TODO: layout
 */
Ext.define('Lada.view.form.Ortserstellung', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ortserstellungsform',
    requires: [
        'Lada.view.widget.Verwaltungseinheit',
        'Lada.view.widget.Staat'
    ],
    model: null,

    record: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.items = [{
            xtype: 'netzbetreiber',
            editable: false,
            readOnly: true,
            submitValue: true,
            fieldLabel: i18n.getMsg('netzbetreiberId'),
            margin : '0, 5, 5, 5',
            labelWidth: 80,
            width: 150,
            value: Lada.netzbetreiber
            }, {
            xtype: 'checkbox',
            name: 'aktiv',
            fieldLabel: 'aktiv:'
        }, {
            xtype: 'displayfield',
            align: 'right',
            value: 'D',
            labelWidth: 125,
            maxLength: 1,
            name: 'messpunktart',
            fieldLabel: 'Art des Messpunktes:'
        },{
            xtype: 'staat',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('staat'),
            name: 'staatId',
            listeners: {
                change: {
                    fn: function() { me.checkCommitEnabled() }
                }
            }
        }, {
            xtype: 'verwaltungseinheit',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.gemeinde'),
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
            maxLength: 10,
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
            maxLength: 10,
            listeners: {
                change: {
                    fn: function() { me.checkCommitEnabled() }
                }
            }
        }, {
            xtype: 'numfield',
            labelWidth: 125,
            fieldLabel: 'Höhe:',
            name: 'hoeheLand',
            maxLength: 10,
            allowDecimals: true
        }, {
            xtype: 'tfield',
            labelWidth: 125,
            maxLength: 100,
            name: 'kurztext',
            fieldLabel: i18n.getMsg('orte.kurztext'),
        },{
            xtype: 'tfield',
            labelWidth: 125,
            fieldLabel: i18n.getMsg('orte.langtext'),
            name: 'langtext'
        },{
            xtype: 'tfield',
            labelWidth: 125,
            fieldLabel: 'Berichtstext:',
            name: 'berichtstext'
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
                handler: me.saveOrt,
                disabled: true
            }, {
                text: i18n.getMsg('close'),
                action: 'close',
                handler: function() {
                    me.close();
                }
            }]
        }];

//TODO:
//               'Anlage:'?
//               zone
//               sektor
//               zustaendigkeit
//               Messregime (mpArt)
//               'Prog.-Punkt:', ?
//               nutsCode
//               Ortszusatz-ID (ozId)
        this.callParent(arguments);
        this.getForm().loadRecord(this.record);
    },

    /**
     * checks Messpunktart and if the Messpunkt can be committed.
     * Disables the save button if false
     */
     // TODO messpunktart is not yet finally defined
    checkCommitEnabled: function() {
        var savebutton =  this.down('toolbar').down('button[action=save]');
        var form = this.getForm();
        if (this.getForm().findField('kdaId').getValue() ||
            this.getForm().findField('koordYExtern').getValue() ||
            this.getForm().findField('koordXExtern').getValue()) {
            if (this.checkCoordinates()) {
                form.findField('messpunktart').setValue('D');
                savebutton.setDisabled(false);
            } else {
                savebutton.setDisabled(true);
            }
        } else if (form.findField('gemId').getValue()) {
            form.findField('messpunktart').setValue('V');
            savebutton.setDisabled(false);
        } else if (form.findField('staatId').getValue()) {
            form.findField('messpunktart').setValue('S');
            savebutton.setDisabled(false);
        } else {
            form.findField('messpunktart').setValue('D');
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
        var form = this_panel.getForm();
        var data = form.getFieldValues(true);
        for (var key in data) {
            form.getRecord().set(key, data[key]);
        }
        this_panel.record.set('letzteAenderung', 0);
        this_panel.record.set('id', null);
        this_panel.record.set('ortId', null);
        this_panel.record.set('netzbetreiberId', Lada.netzbetreiber[0]);
        console.log(this_panel.record);
        this_panel.record.save({
            success: function(record, response) {
                console.log(response);
                var newOrtId;
                Ext.Msg.show({
                    title: Lada.getApplication().bundle.getMsg('success'),
                    autoScroll: true,
                    msg: 'Ort erfolgreich angelegt!',
                    buttons: Ext.Msg.OK
                });
                var ozw = this_panel.up().parentWindow;
                ozw.ortstore.load({
                    callback: function(records, operation, success) {
                        ozw.down('map').addLocations(ozw.ortstore);
                        ozw.down('ortstammdatengrid').setStore(ozw.ortstore);
                        var id = Ext.decode(response.response.responseText).data.id;
                        var record = ozw.down('ortstammdatengrid').store.getById(id);
                        var selectionmodel = ozw.down('ortstammdatengrid').getSelectionModel();
                        console.log(record);
                        selectionmodel.select(record);
                        this_panel.close();
                    },
                    scope: this
                });
            },
            failure: function(record, response) {
                console.log(response);
                // TODO
//                 response.error.status
//                 response.error.statusText
//                 var json = Ext.decode(response.response.responseText);
//                 if (json) {
//                     if(json.errors.totalCount > 0 || json.warnings.totalCount > 0){
//                         console.log(json.errors);
//                         console.log(json.warnings);
//                         formPanel.setMessages(json.errors, json.warnings);
//                     }
//                     if(json.message){
//                         Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title')
//                             +' #'+json.message,
//                             Lada.getApplication().bundle.getMsg(json.message));
//                     } else {
//                          Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
//                             Lada.getApplication().bundle.getMsg('err.msg.generic.body'));
//                     }
//                 } else {
//                     Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
//                         Lada.getApplication().bundle.getMsg('err.msg.response.body'));
            }
        });
    }
});
