/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * This is a controller for an Ortszuordnung Form
 */
Ext.define('Lada.controller.form.Ortszuordnung', {
    extend: 'Ext.app.Controller',

    /**
     * Initialize the Controller with 4 listeners
     */
    init: function() {
        this.control({
            'ortszuordnungform button[action=setOrt]': {
                toggle: this.chooseLocation
            },
            'ortszuordnungform button[action=save]': {
                click: this.save
            },
            'ortszuordnungform button[action=revert]': {
                click: this.revert
            },
            'ortszuordnungform': {
                validitychange: this.validityChange,
                dirtychange: this.validityChange
            }
        });
    },

     /**
      * The save function saves the content of the Ort form.
      * On success it will reload the Store,
      * on failure, it will display an Errormessage
      */
     save: function(button) {
        var formPanel = button.up('ortszuordnungform');

        //try to disable ortPickerButton:
        try {
           formPanel.down('button[action=setOrt]').toggle(false);
        }
        catch (e) {
        }
        var data = formPanel.getForm().getFieldValues(false);
        var record = formPanel.getForm().getRecord();
        var i18n = Lada.getApplication().bundle;
        record.set('ortId', data.ortId[0]);
        record.set('ortszuordnungTyp', data.ortszuordnungTyp);
        record.set('ortszusatztext', data.ortszusatztext);
        if (!record.get('letzteAenderung')) {
            record.set('letzteAenderung', Date());
        }
        if (record.phantom){
            record.set('id', null);
        }
        record.save({
            success: function(record, response) {
                var json = Ext.decode(response.getResponse().responseText);
                if (json) {
                    formPanel.clearMessages();
                    formPanel.setRecord(record);
                    formPanel.setMessages(json.errors, json.warnings);
                    formPanel.up('window').parentWindow.initData();
                    button.setDisabled(true);
                    button.up('toolbar').down(
                        'button[action=revert]').setDisabled(true);
                }
                //try to refresh the Grid of the Probe
                try { //TODO Migration
                    formPanel.up('window').parentWindow
                        .down('ortszuordnunggrid').store.reload();
                }
                catch (e) {

                }
            },
            failure: function(record, response) {
                var i18n = Lada.getApplication().bundle;
                //TODO: Migration Server responds with "200 success", but fails. So this is not triggered, and code above fails
                button.setDisabled(true);
                formPanel.getForm().loadRecord(formPanel.getForm().getRecord());
                if (response.error){
                    //TODO: check content of error.status (html error code)
                    Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                                  i18n.getMsg('err.msg.generic.body'));
                } else {
                    var json = Ext.decode(response.getResponse().responseText);
                    if (json) {
                        if(Object.keys(json.errors).length > 0 ||
                            Object.keys(json.warnings).length > 0) {
                            formPanel.setMessages(json.errors, json.warnings);
                        }
                        if(json.message){
                            Ext.Msg.alert(i18n.getMsg('err.msg.save.title')
                                +' #'+json.message,
                                i18n.getMsg(json.message));
                        } else {
                            Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                                i18n.getMsg('err.msg.generic.body'));
                        }
                    } else {
                        Ext.Msg.alert(i18n.getMsg('err.msg.save.title'),
                            i18n.getMsg('err.msg.response.body'));
                    }
                }
            }
        });
    },

    /**
     * reverts the form to the currently saved state
     */
    revert: function(button) {
        var form = button.up('form');
        var osg = button.up('window').down('ortstammdatengrid');
        var recordData = form.getForm().getRecord().data;
        var currentOrt = recordData.ortId;
        var selmod = osg.getView().getSelectionModel();
        form.getForm().reset();
        if (!currentOrt) {
            selmod.deselectAll();
        } else {
            var record = osg.store.getById(currentOrt);
            form.setOrt(null, record);
            selmod.select(record);
        }
        button.setDisabled(true);
        button.up('toolbar').down('button[action=save]').setDisabled(true);
    },

    /**
     * When the button is Active, a Record can be selected.
     * If the Record was selected from a grid this function
     * sets the ortzuordnung.
     */
    chooseLocation: function(button, pressed, opts) {
        var i18n = Lada.getApplication().bundle;
        var win = button.up('ortszuordnungwindow');
        win.down('tabpanel').setActiveTab(0);
        var osg = win.down('ortstammdatengrid');
        var oForm = win.down('ortszuordnungform');
        osg.addListener('select',oForm.setOrt, oForm);
        var map = win.down('map');
        if (pressed) {
            button.setText(i18n.getMsg('ortszuordnung.form.setOrt.pressed'));
            map.featureLayer.setVisibility(true);
            var mstId = oForm.up('window').probe ? oForm.up('window').probe.get('mstId') :
                oForm.up('window').messprogramm.get('mstId');
            var mst = Ext.data.StoreManager.get('messstellen');
            var ndx = mst.findExact('id', mstId);
            var nId = mst.getAt(ndx).get('netzbetreiberId');
            osg.addListener('select',oForm.setOrt, oForm);

        }
        else {
            map.featureLayer.setVisibility(false);
            button.setText(i18n.getMsg('ortszuordnung.form.setOrt'));
            osg.removeListener('select',oForm.setOrt, oForm);
        }
    },

    /**
     * The validitychange function enables or disables the save button which
     * is present in the toolbar of the form.
     */
    validityChange: function(form, valid) {
        // the simple form.isDirty() check seems to fail for a lot of cases
        var ortIdIsDirty = true;
        if (form.getRecord().data.ortId == form.findField('ortId').getValue()) {
            ortIdIsDirty = false;
        }
        if (form.findField('ortszusatztext').isDirty()
            || form.findField('ortszuordnungTyp').isDirty()
            || ortIdIsDirty) {
            form.owner.down('button[action=revert]').setDisabled(false);
            if (valid && form.getValues().ortId !== '') {
                form.owner.down('button[action=save]').setDisabled(false);
            } else {
                form.owner.down('button[action=save]').setDisabled(true);
            }
        } else {
            //not dirty
            form.owner.down('button[action=save]').setDisabled(true);
            form.owner.down('button[action=revert]').setDisabled(true);
        }
    }
});
