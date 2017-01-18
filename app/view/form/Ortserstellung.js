/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Form to create a new Messpunkt
 * TODO: layout, saving, model
 */
Ext.define('Lada.view.form.Ortserstellung', {
    extend: 'Ext.form.Panel',
    alias: 'widget.ortserstellungsform',

    model: 'Lada.model.Ortszuordnung',//TODO correct model needed
    requires: [
        'Lada.view.widget.Verwaltungseinheit',
        'Lada.view.widget.Staat'
    ],

    width: 900,
    height: 700,
    bodyStyle: {background: '#fff'},
    layout: 'vbox',
    scrollable: true,
    margin: '5, 5, 0, 5',
    border: 0,
    floating: true,
    closable: true,

    /**
     * Preset values
     */
    presets: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.items = [{ //TODO: layout and input types
            title: 'Neuen Messpunkt anlegen',
            dockedItems : [{
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
                    disabled: true,
                    action: 'save',
                    handler: me.saveOrt
                }, {
                    text: i18n.getMsg('close'),
                    action: 'close',
                    handler: function() {
                    me.close();
                    }
                }]
            }],
            items : [{
                xtype: 'netzbetreiber',
                editable: false,
                readOnly: true,
                submitValue: true,
                fieldLabel: i18n.getMsg('netzbetreiberId'),
                margin : '0, 5, 5, 5',
                labelWidth: 80,
                // value: XXX
                // TODO: get netzbetreiber of current user
            }, {
                xtype: 'checkbox',
                name: 'aktiv',
                fieldLabel: 'aktiv:',
                value: me.presets.aktiv? me.presets.aktiv:null
            }, {
                xtype: 'displayfield',
                value: 'D',
                labelWidth: 125,
                maxLength: 1,
                name: 'messpunktart',
                fieldLabel: 'Art des Messpunktes:'
            },{
                xtype: 'displayfield',
                labelWidth: 125,
                maxLength: 100,
                name: 'OrtID',
                fieldLabel: 'Ort/Messpunkt-ID:',
                // TODO: needed? We can't set it, and it is not yet given
                // for a new messpunkt
                editable: false
            }, {
                xtype: 'staat',
                labelWidth: 100,
                fieldLabel: i18n.getMsg('staat'),
                name: 'staatId',
                width: 160,
                listeners: {
                    change: {
                        fn: function() { me.checkCommitEnabled() }
                    }
                }
            }, {
                xtype: 'verwaltungseinheit',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.gemeinde'),
                name: 'gemeinde',
                listeners: {
                    change: {
                        fn: function() { me.checkCommitEnabled() }
                    }
                }
            }, {
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.kda'),
                name: 'kdaId',
                listeners: {
                    change: {
                        fn: function() { me.checkCommitEnabled() }
                    }
                }
            }, {
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.koordx'),
                name: 'koordXExtern',
                listeners: {
                    change: {
                        fn: function() { me.checkCommitEnabled() }
                    }
                }
            }, {
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.koordy'),
                name: 'koordYExtern',
                listeners: {
                    change: {
                        fn: function() { me.checkCommitEnabled() }
                    }
                }
            }, {
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: 'Höhe:',
                name: 'hoehe', //TODO: hohe_ueber_NN?
            }, {
                xtype: 'displayfield',
                labelWidth: 125,
                maxLength: 100,
                name: 'kurztext',
                fieldLabel: 'Kurztext:'
            },{
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: i18n.getMsg('orte.langtext'),
                name: 'langtext'
            },{
                xtype: 'displayfield',
                labelWidth: 125,
                fieldLabel: 'Berichtstext:',
                name: 'berichtstext'
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
        me.callParent(arguments);
        this.prefillForm();
    },

    /**
     * checks Messpunktart and if the Messpunkt can be committed.
     * Disables the save button if false
     */
     // TODO messpunktart is not yet finally defined
    checkCommitEnabled: function() {
        var savebutton = this.down('toolbar').down('button[action=save]');
        var form = this.getForm();
        if (this.checkCoordinates()) {
            form.findField('messpunktart').setValue('D');
            savebutton.setDisabled(false);
        } else if (form.findField('gemeinde').getValue()) {
            form.findField('messpunktart').setValue('V');
            savebutton.setDisabled(false);
        } else if (form.findField('staatId')) {
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

    saveOrt: function(){
        // TODO not yet implemented
        alert("save!");
    },

    /**
     * Fill the form with values passed by presets.
     // TODO Find a shorter way of setting all these
     */
    prefillForm: function() {
        var form = this.getForm();
        if (this.presets.aktiv) {
            form.findField('aktiv').setValue(this.presets.aktiv);
        }
        if (this.presets.staatId) {
            // TODO: staatID != staatISO
            form.findField('staatId').setValue(me.presets.staatId);
        }
        if (this.presets.gemeinde) {
            // TODO: ortId != gemeinde
            form.findField('gemeinde').setValue(this.presets.gemeinde);
        }
        if (this.presets.kdaId) {
            form.findField('kdaId').setValue(this.presets.kdaId);
        }
        if (this.presets.koordXExtern) {
            form.findField('koordXExtern').setValue(this.presets.koordXExtern);
        }
        if (this.presets.koordYExtern) {
            form.findField('koordYExtern').setValue(this.presets.koordYExtern);
        }
        if (this.presets.hoehe) {
            // TODO hohe_ueber_NN?
            form.findField('hoehe').setValue(me.presets.hoehe);
        }
        if (this.presets.kurztext) {
            form.findField('kurztext').setValue(this.presets.kurztext);
        }
        if (this.presets.langtext) {
            form.findField('langtext').setValue(this.presets.langtext);
        }
        if (this.presets.berichtstext) {
            form.findField('berichtstext').setValue(this.presets.berichtstext);
        }
    }
});

