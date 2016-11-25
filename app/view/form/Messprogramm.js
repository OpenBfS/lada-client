/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Form to edit a Messprogramm
 */
Ext.define('Lada.view.form.Messprogramm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.messprogrammform',
    requires: [
        'Lada.view.widget.Datenbasis',
        'Lada.view.widget.base.CheckBox',
        'Lada.view.widget.Messstelle',
        'Lada.view.widget.Netzbetreiber',
        'Lada.view.widget.Betriebsart',
        'Lada.view.widget.Probenart',
        'Lada.view.widget.MessprogrammLand',
        'Lada.view.widget.Umwelt',
        'Lada.view.widget.base.TextField',
        'Lada.view.widget.base.NumberField',
        'Lada.view.widget.base.FieldSet',
        'Lada.model.Messprogramm',
        'Lada.model.MmtMessprogramm',
        'Lada.view.widget.Probenintervall',
        'Lada.view.widget.Location',
        'Lada.view.widget.ProbenintervallSlider',
        'Lada.view.widget.DayOfYear'
    ],

    model: 'Lada.model.Messprogramm',
    minWidth: 650,
    margin: 5,
    border: 0,

    recordId: null,
    ortWindow: null,

    trackResetOnLoad: true,

    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            xtype: 'fieldset',
            title: i18n.getMsg('messprogramm.form.fieldset.title'),
            items: [{
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
                    items: ['->', {
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
                        border: 0,
                        minWidth: 290,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        margin: '0, 10, 0, 0',
                        items: [{
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            border: 0,
                            items: [{
                                xtype: 'messstellelabor',
                                name: 'mstlabor',
                                fieldLabel: 'Messstelle/Labor',
                                margin: '0, 5, 5, 5',
                                width: '35%',
                                labelWidth: 95,
                                allowBlank: false,
                                editable: true,
                                listeners: {
                                    select: {
                                        fn: function(combo, newValue) {
                                            var mst = newValue[0].get('messStelle');
                                            var labor = newValue[0].get('laborMst');
                                            combo.up('fieldset').down('messstelle[name=mstId]').setValue(mst);
                                            combo.up('fieldset').down('messstelle[name=laborMstId]').setValue(labor);
                                        }
                                    }
                                }
                            }, {
                                xtype: 'messstelle',
                                name: 'mstId',
                                fieldLabel: 'Messstelle/Labor',
                                margin: '0, 5, 5, 5',
                                width: '35%',
                                labelWidth: 95,
                                allowBlank: false,
                                editable: true,
                                hidden: true,
                                listeners: {
                                    validitychange: me.mstLaborValidity
                                }
                            }, {
                                xtype: 'messstelle',
                                name: 'laborMstId',
                                fieldLabel: 'Messstelle/Labor',
                                margin: '0, 5, 5, 5',
                                width: '35%',
                                labelWidth: 95,
                                allowBlank: false,
                                editable: true,
                                hidden: true,
                                listeners: {
                                    validitychange: me.mstLaborValidity
                                }
                            }, {
                                xtype: 'netzbetreiber',
                                editable: false,
                                readOnly: true,
                                isFormField: false,
                                submitValue: false,
                                fieldLabel: i18n.getMsg('netzbetreiberId'),
                                margin : '0, 5, 5, 5',
                                width : '45%',
                                labelWidth: 80
                            }, {
                                xtype: 'datenbasis',
                                editable: false,
                                allowBlank: false,
                                name: 'datenbasisId',
                                fieldLabel: i18n.getMsg('datenbasisId'),
                                margin : '0, 5, 5, 5',
                                width : '20%',
                                labelWidth: 65
                            }]
                        }, {
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            border: 0,
                            items: [{
                                xtype: 'probenart',
                                editable: false,
                                name: 'probenartId',
                                fieldLabel: i18n.getMsg('probenartId'),
                                margin: '0, 5, 5, 5',
                                width: '35%',
                                labelWidth: 95,
                                allowBlank: false
                            }, {
                                xtype: 'betriebsart',
                                name: 'baId',
                                margin: '0, 5, 5, 5',
                                fieldLabel: i18n.getMsg('baId'),
                                //anchor: '100%',
                                width: '45%',
                                labelWidth: 80
                            }, {
                                xtype: 'chkbox',
                                name: 'test',
                                fieldLabel: i18n.getMsg('test'),
                                anchor: '100%',
                                margin : '0, 5, 5, 5',
                                width : '20%',
                                labelWidth: 30,
                                allowBlank: false
                            }]
                        }, {
                            xtype: 'tfield',
                            name: 'kommentar',
                            fieldLabel: i18n.getMsg('kommentar'),
                            width: '100%',
                            margin: '0, 5, 5, 5',
                            labelWidth: 95
                        }]
                }, {
                    // Zeit
                    xtype: 'fieldset',
                    title: i18n.getMsg('probenintervall'),
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'fset',
                        name: 'probenIntervallFieldset',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        border: 0,
                        margin: '0, 0, 0, 0',
                        items: [{
                            xtype: 'probenintervall',
                            allowBlank: false,
                            fieldLabel: i18n.getMsg('probenintervall'),
                            margin: '0, 10, 5, 5',
                            labelWidth: 50,
                            width: '40%',
                            name: 'probenintervall'
                        }, {
                            xtype: 'numfield',
                            allowDecimals: false,
                            allowBlank: false,
                            fieldLabel: i18n.getMsg('teilintervallVon'),
                            margin: '0, 10, 5, 10',
                            labelWidth: 90,
                            width: '28%',
                            name: 'teilintervallVon',
                            period: 'start'
                        }, {
                            xtype: 'numfield',
                            allowDecimals: false,
                            allowBlank: false,
                            fieldLabel: i18n.getMsg('teilintervallBis'),
                            margin: '0, 15, 5, 5',
                            labelWidth: 18,
                            width: '15%',
                            name: 'teilintervallBis',
                            period: 'end'
                        }, {
                            xtype: 'numfield',
                            allowDecimals: false,
                            margin: '0, 10, 5, 5',
                            fieldLabel: i18n.getMsg('offset'),
                            labelWidth: 45,
                            width: '17%',
                            name: 'intervallOffset'
                        }]
                    }, {
                        xtype: 'probenintervallslider',
//                        fieldLabel: i18n.getMsg('intervall'),
//                        labelWidth: 70,
                        pack: 'center',
                        width: '70%',
                        margin: '0, 40, 10, 40',
                        values: [0, 0]
                        //this will be overridden
                        // by setRecord
                    }, {
                        xtype: 'fset',
                        name: 'gueltigPeriodFieldset',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        border: 0,
                        items: [{
                            xtype: 'dayofyear',
                            allowBlank: false,
                            fieldLabel: i18n.getMsg('gueltigVon'),
                            width: '50%',
                            labelWidth: 90,
                            name: 'gueltigVon',
                            border: false
                        }, {
                            xtype: 'dayofyear',
                            allowBlank: false,
                            fieldLabel: i18n.getMsg('gueltigBis'),
                            width: '50%',
                            labelWidth: 40,
                            name: 'gueltigBis',
                            border: false
                        }]
                    }]
                }, {
                    // Medium
                    xtype: 'fieldset',
                    title: i18n.getMsg('medium'),
                    width: '100%',
                    items: [{
                        border: 0,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        width: '100%',
                        items: [{
                            xtype: 'umwelt',
                            name: 'umwId',
                            fieldLabel: i18n.getMsg('umwId'),
                            labelWidth: 125,
                            editable: true,
                            listeners: {
                                dirtychange: {
                                    fn: this.updateOnChange,
                                    scope: me
                                }
                            }
                        }, {
                            border: 0,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            width: '100%',
                            items: [{
                                xtype: 'textfield',
                                maxLength: 38,
                                enforceMaxLength: true,
                                name: 'mediaDesk',
                                width: '60%',
                                labelWidth: 125,
                                fieldLabel: i18n.getMsg('mediaDesk'),
                                editable: false,
                                readOnly: true,
                                listeners: {
                                    dirtychange: {
                                        fn: this.updateOnChange,
                                        scope: me
                                    }
                                }
                            }, {
                                xtype: 'textfield',
                                name: 'media',
                                margin: '0, 10, 5, 10',
                                width: '40%',
                                enforceMaxLength: true,
                                editable: false,
                                readOnly: true
                            }]
                        }, {
                            xtype: 'fieldset',
                            title: i18n.getMsg('deskDetails'),
                            collapsible: true,
                            collapsed: true,
                            defaultType: 'textfield',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: this.buildDescriptors(),
                            listeners: {
                                dirtychange: {
                                    fn: this.updateOnChange,
                                    scope: me
                                }
                            }
                        }]
                    }]
                }, {
                    // Ort
                    xtype: 'fieldset',
                    title: 'Ort',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    width: '100%',
                    items: [{
                        xtype: 'location',
                        name: 'ortId',
                        fieldLabel: i18n.getMsg('ortId'),
                        labelWidth: 80,
                        allowBlank: false,
                        forceSelection: true,
                        editable: false,
                        columnWidth: '0.75'
                    }, {
                        xtype: 'button',
                        name: 'ortIdButton',
                        margin: '0 0 0 5',
                        text: i18n.getMsg('messprogrammort.button.title'),
                        action: 'ort',
                        columnWidth: '0.25'
                    }]
                }, {
                    xtype: 'probenehmer',
                    name: 'probeNehmerId',
                    fieldLabel: i18n.getMsg('probeNehmerId'),
                    margin: '0, 5, 5, 5',
                    //width: '100%',
                    minValue: 0,
                    anchor: '100%',
                    labelWidth: 95
                }, {
                    xtype: 'messprogrammland',
                    name: 'mplId',
                    fieldLabel: 'Messprogramm-Land',
                    margin: '0, 5, 5, 5',
                    //width: '100%',
                    anchor: '100%',
                    labelWidth: 115
                }, {
                    xtype: 'textarea',
                    name: 'probeKommentar',
                    labelAlign: 'top',
                    fieldLabel: i18n.getMsg('probeKommentar'),
                    width: '100%',
                    labelwidth: 135,
                    anchor: '100%'
                }]
            }]
        }];
        this.callParent(arguments);
    },

    populateIntervall: function(record, intervall) {
        //intervall is an identifier of a intervall
        // for instance H, M, J, ...
        // Initialize the probenintervallslider
        var s = this.down('probenintervallslider');
        var i = this.getForm().findField('intervallOffset');
        var v = this.getForm().findField('teilintervallVon');
        var b = this.getForm().findField('teilintervallBis');
        var intervallstore = Ext.data.StoreManager.get('Probenintervall');

        var svalUpper = null
        var svalLower = null
        var min = null
        var max = null

        if (!intervallstore) {
            intervallstore = Ext.create('Lada.store.Probenintervall');
        }

        //It is likely that this method was not
        // called from the controller,
        //and the probenintervall was not changed.
        // Load the records in this case
        if (!intervall && record) {
            intervall = record.get('probenintervall',
                    0, false, false, true);

            svalUpper = record.get('teilintervallBis');
            svalLower = record.get('teilintervallVon');
        }

        // subintervall is redundant to validity for yearly samples
        if (intervall == 'J') {
            svalUpper = this.getForm().findField('gueltigBis').getValue();
            svalLower = this.getForm().findField('gueltigVon').getValue();
            b.setReadOnly(true);
            v.setReadOnly(true);
            s.setDisabled(true);
        } else {
            b.setReadOnly(false);
            v.setReadOnly(false);
            s.setDisabled(false);
        }

        var intrec = intervallstore
            .findRecord('probenintervall',
                intervall, 0, false, false, true);

        if (intrec) { // in cases when a new messprogramm is
        // created and the discard function is used, intrec will be null
        // consequently the assertion below will fail.
            min = intrec.get('periodstart');
            max = intrec.get('periodend');
        }

        if (!svalUpper) {
            svalUpper = max;
        }
        if (!svalLower) {
            svalLower = min;
        }

        //Set Teilintervalle
        v.setMinValue(min);
        v.setMaxValue(max);
        b.setMinValue(min);
        b.setMaxValue(max);

        //Set Slider
        s.setMinValue(min);
        s.setMaxValue(max);

        v.setValue(svalLower);
        b.setValue(svalUpper);

        //Set IntervallOffset
        i.setMinValue(0);
        i.setMaxValue(max-1);
    },

    /*
     * Set validity of messstellelabor field (not part of the form) based
     * on validitychange event of hidden mstId and laborMstId
     */
    mstLaborValidity: function(field, isValid) {
        if (!isValid) {
            field.up('fieldset').down('messstellelabor')
                .down('combobox').markInvalid('');
        }
    },

    setRecord: function(messRecord) {
        this.clearMessages();
        this.getForm().loadRecord(messRecord);
        //Set the intervall numberfields and the slider.
        this.down('probenintervallslider').setValue([
            messRecord.get('teilintervallVon'),
            messRecord.get('teilintervallBis')
        ]);

        //TODO Set Sliders MinMaxValue
        this.populateIntervall(messRecord);

        this.down('probenintervallslider').on(
            'change',
            Lada.app.getController('Lada.controller.form.Messprogramm')
                .synchronizeFields
        );
        var mstStore = Ext.data.StoreManager.get('messstellen');
        var mstId = mstStore.getById(messRecord.get('mstId'));
        if (!messRecord.get('owner')) {
            if (!mstId) {
                return;
            }
            var laborMstId = mstStore.getById(messRecord.get('laborMstId'));
            if (laborMstId) {
                laborMstId = laborMstId.get('messStelle');
            }
            else {
                laborMstId = '';
            }
            var id = this.down('messstellelabor').store.count() + 1;
			if ( messRecord.get('mstId') === messRecord.get('laborMstId') ) {
				displayCombi = mstId.get('messStelle');
			} else {
				displayCombi = mstId.get('messStelle') + '/' + laborMstId
			}
			var newStore = Ext.create('Ext.data.Store', {
				model: 'Lada.model.MessstelleLabor',
				data: [{
					id: id,
					laborMst: messRecord.get('laborMstId'),
					messStelle: messRecord.get('mstId'),
					displayCombi: displayCombi
				}]
			});
            this.down('messstellelabor').down('combobox').store = newStore;
            this.down('messstellelabor').setValue(id);
        }
        else {
            var mstLaborStore = Ext.data.StoreManager.get('messstellelabor');
            var items = mstLaborStore.queryBy(function(record) {
                if (record.get('messStelle') === messRecord.get('mstId') &&
                    record.get('laborMst') === messRecord.get('laborMstId')) {
                    return true;
                }
            });
            this.down('messstellelabor').setValue(items.getAt(0));
        }
        this.down('netzbetreiber').setValue(mstId.get('netzbetreiberId'));
    },

    setMediaDesk: function(record) {
        var media = record.get('mediaDesk');
        if (media) {
            var mediaParts = media.split(' ');
            this.setMediaSN(0, mediaParts);
        }
    },

    setMediaSN: function(ndx, media, beschreibung) {
        var mediabeschreibung = this.getForm().findField('media');
		
        if (ndx >= 12) {
			mediabeschreibung.setValue(beschreibung);
            return;
        }
        var me = this;
        var current = this.down('deskriptor[layer=' + ndx + ']');
        var cbox = current.down('combobox');
        if (ndx === 0) {
            cbox.store.proxy.extraParams = {
                'layer': ndx
            };
        }
        else {
            var parents = current.getParents(current.down('combobox'));
            if (parents.length === 0) {
                return;
            }
            cbox.store.proxy.extraParams = {
                'layer': ndx,
                'parents': parents
            };
        }
        cbox.store.load(function(records, op, success) {
            if (!success) {
                return;
            }
            cbox.select(cbox.store.findRecord('sn', parseInt(media[ndx + 1], 10)));
			var mediatext = cbox.store.findRecord('sn', parseInt(media[ndx + 1], 10));
			if (mediatext !== null) {
				if ( (ndx <= 3) && (media[1] === '01') && (mediatext.data.beschreibung !== "leer") ) {
					beschreibung = mediatext.data.beschreibung;
				} else if ( (media[1] !== '01') && (mediatext.data.beschreibung !== "leer") && (ndx <= 1) ) {
					beschreibung = mediatext.data.beschreibung;
				}
			}
            me.setMediaSN(++ndx, media, beschreibung);
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
        // TODO
        this.down('cbox[name=mstlabor]').clearWarningOrError();
        //no clearmsg for probeKommentar
        this.down('cbox[name=datenbasisId]').clearWarningOrError();
        this.down('cbox[name=baId]').clearWarningOrError();
        this.down('chkbox[name=test]').clearWarningOrError();
        this.down('cbox[name=probenartId]').clearWarningOrError();
        this.down('netzbetreiber').clearWarningOrError();
        // clear messages in intervall definition
        this.down('fset[name=probenIntervallFieldset]').clearMessages();
        this.down('cbox[name=probenintervall]').clearWarningOrError();
        this.down('numfield[name=teilintervallVon]').clearWarningOrError();
        this.down('numfield[name=teilintervallBis]').clearWarningOrError();
        this.down('dayofyear[name=gueltigVon]').clearWarningOrError();
        this.down('dayofyear[name=gueltigBis]').clearWarningOrError();
        //no clear for probeNehmerId
        // Deskriptoren are missing
        this.down('cbox[name=umwId]').clearWarningOrError();
        this.down('cbox[name=ortId]').clearWarningOrError();
    },

    setReadOnly: function(value) {
        // TODO
    },

    buildDescriptors: function() {
        var fields = [];
        for (var i = 0; i < 12; i++) {
            fields[i] = {
                xtype: 'deskriptor',
                fieldLabel: 'S' + i,
                labelWidth: 25,
                width: 190,
                layer: i,
                margin: '0, 10, 5, 0'
            };
        }
        return fields;
    }
});
