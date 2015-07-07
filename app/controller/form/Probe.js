/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * A Controller for a Probe form
 */
Ext.define('Lada.controller.form.Probe', {
    extend: 'Ext.app.Controller',

    /**
     * Initialize the Controller
     * It has 4 listeners
     */
    init: function() {
        this.control({
            'probeform button[action=save]': {
                click: this.save
            },
            'probeform button[action=discard]': {
                click: this.discard
            },
            'probeform': {
                dirtychange: this.dirtyForm
            },
            'probeform messstelle combobox':{
                expand: this.filter,
                keydown: this.filter,
                select: this.setNetzbetreiber
            },
            'probeform [xtype="datetime"] field': {
                blur: this.checkDate
            },
            'probeform panel[xtype="deskriptor] combobox': {
                select: this.deskriptorSelect
            }
        });
    },

    /**
     * The Messtellen Store contains ALL Messtellen.
     * Filter the store in this combobox to reduce the choices
     * to the subset which the user is allowed to use.
     */
    filter: function(field) {
        var fil =  Ext.create('Ext.util.Filter', {
            filterFn: function(item) {
                if (Ext.Array.contains(Lada.mst, item.get('id'))) {
                    return true;
                }
                return false;
            }
        });
        field.getStore().filter(fil);
    },

    /**
     * When a Messtelle is selected, modify the Netzbetreiber
     * according to the Messstelle
     * TODO: The conditions when to apply this automatism are still
     *   unclear. Right now it is only applied when the NB is not set.
     */
    setNetzbetreiber: function(combo, records){
        var netzbetreiber = combo.up().up('form')
                .down('netzbetreiber').down('combobox');
        var nbId = records[0].get('netzbetreiberId');

        debugger;
        if (nbId != null &&
               (netzbetreiber.value === '' || netzbetreiber.value === null)) {
            //select the NB in the NB-Combobox
            netzbetreiber.select(nbId);
        }
    },

    /**
     * The save function saves the content of the Location form.
     * On success it will reload the Store,
     * on failure, it will display an Errormessage
     */
    save: function(button) {
        var formPanel = button.up('form');
        var data = formPanel.getForm().getFieldValues(true);
        for (var key in data) {
            formPanel.getForm().getRecord().set(key, data[key]);
        }
        formPanel.getForm().getRecord().save({
            success: function(record, response) {
                var json = Ext.decode(response.response.responseText);
                if (json) {
                    button.setDisabled(true);
                    button.up('toolbar').down('button[action=discard]')
                        .setDisabled(true);
                    formPanel.clearMessages();
                    formPanel.setRecord(record);
                    formPanel.setMessages(json.errors, json.warnings);
                    if (response.action === 'create' && json.success) {
                        button.up('window').close();
                        var win = Ext.create('Lada.view.window.ProbeEdit', {
                            record: record
                        });
                        win.show();
                        win.initData();
                    }
                }
            },
            failure: function(record, response) {
                button.setDisabled(true);
                button.up('toolbar').down('button[action=discard]')
                    .setDisabled(true);
                var rec = formPanel.getForm().getRecord();
                rec.dirty = false;
                formPanel.getForm().loadRecord(record);
                var json = response.request.scope.reader.jsonData;
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
                    formPanel.clearMessages();
                    //formPanel.setRecord(record);
                    formPanel.setMessages(json.errors, json.warnings);
                } else {
                    Ext.Msg.alert(Lada.getApplication().bundle.getMsg('err.msg.save.title'),
                        Lada.getApplication().bundle.getMsg('err.msg.response.body'));
                }

            }
        });
    },

     /**
      * The discard function resets the Probe form
      * to its original state.
      */
    discard: function(button) {
        var formPanel = button.up('form');

        formPanel.down('fset[name=entnahmePeriod]').clearMessages();
        formPanel.down('fset[name=sollzeitPeriod]').clearMessages();
        formPanel.down('datetime[name=probeentnahmeBeginn]').clearWarningOrError();
        formPanel.down('datetime[name=probeentnahmeEnde]').clearWarningOrError();
        formPanel.down('datetime[name=solldatumBeginn]').clearWarningOrError();
        formPanel.down('datetime[name=solldatumEnde]').clearWarningOrError();

        formPanel.down('umwelt').store.clearFilter();
        formPanel.getForm().loadRecord(formPanel.getForm().getRecord());
    },

     /**
      * The dirtyForm function enables or disables the save and discard
      * button which are present in the toolbar of the form.
      * The Buttons are only active if the content of the form was altered
      * (the form is dirty).
      * In Additon it calls the disableChildren() function of the window
      * embedding the form. Likewise it calls the embedding windows
      * enableChilren() function
      */
    dirtyForm: function(form, dirty) {
        if (dirty) {
            form.owner.down('button[action=save]').setDisabled(false);
            form.owner.down('button[action=discard]').setDisabled(false);
            form.owner.up('window').disableChildren();
        }
        else {
            form.owner.down('button[action=save]').setDisabled(true);
            form.owner.down('button[action=discard]').setDisabled(true);
            form.owner.up('window').enableChildren(); // todo this might not be true in all cases
        }
    },

    /**
     * checkDate() is called when a xtype=datetime field was modified
     * It checks for two things:
     *  - Is the date in the future
     *  - Does the date belong to a time period and the end is before start
     * In both cases it adds a warning to the field which was checked.
     */
    checkDate: function(field) {
        var now = Date.now();
        var w = 0 //amount of warnings
        var e = 0 //errors
        var emsg = '';
        var wmsg = '';

        if (field.getValue() > now){
            wmsg += Lada.getApplication().bundle.getMsg('661');
            w++;
        }
        // This field might be a field within a DateTime-Period.
        // Search for Partner field (period: end/start) and validate
        // End Before Start validation
        if (field.period) {
            var partners = new Array();
                partners[0] = field.up('fieldset').down('datetime[period=start]').down().getValue()
                partners[1] = field.up('fieldset').down('datetime[period=end]').down().getValue()
            if (partners[0] && partners[1] && partners[0] > partners [1]) {
                var msg = Lada.getApplication().bundle.getMsg('662');
                field.up('fieldset').showWarningOrError(true, msg, false, '');
            } else {
                field.up('fieldset').clearMessages();
            }
        }

        if (w) {
            field.up().showWarnings(wmsg);
        }
        if (e) {
            field.up().showErrors(emsg);
        }

        // Clear Warnings or Errors if none Are Present
        if (w == 0 && e == 0) {
            field.up().clearWarningOrError();
        }
    },

    deskriptorSelect: function(field, records) {
        var desk = field.up('deskriptor');
        var media = field.up('probeform').down('textfield[name="mediaDesk"]');
        var current = media.getValue().split(' ');

        if (current.length < 13) {
            for (var i = 0; i <= 12; i++) {
                if (i === 0) {
                    current.push('D:');
                }
                else if (i === desk.layer + 1) {
                    var value;
                    if (records[0].get('sn') < 10) {
                        value = '0' + records[0].get('sn');
                    }
                    else {
                        value = records[0].get('sn');
                    }
                    current.push(value);
                }
                else {
                    current.push('00');
                }
            }
        }
        else {
            var value;
            if (records[0].get('sn') < 10) {
                value = '0' + records[0].get('sn');
            }
            else {
                value = records[0].get('sn');
            }
            current[desk.layer + 1] = value;
        }
        media.setValue(current.join(' ').trim());
    },

    clearChildDesk: function(field, media) {
        var allS = field.up('fieldset').items.items;
        for (var i = field.layer + 1; i < 12; i++) {
            allS[i].clearValue();
            media[i + 1] = '00';
        }
    }

});
