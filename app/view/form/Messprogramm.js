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
        'Lada.view.widget.ProbenintervallSlider',
        'Lada.view.widget.DayOfYear'
    ],

    model: 'Lada.model.Messprogramm',
    margin: 5,
    border: false,

    recordId: null,

    trackResetOnLoad: true,

    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            xtype: 'fieldset',
            title: i18n.getMsg('messprogramm.form.fieldset.title'),
            items: [{
                border: false,
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
                defaults: {
                    margin: '0, 10, 0, 0',
                    border: false
                },
                items: [{
                    border: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        border: false,
                        items: [{
                            xtype: 'displayfield',
                            name: 'id',
                            fieldLabel: i18n.getMsg('mprId'),
                            margin: '0, 5, 5, 5',
                            width: '80%',
                            labelWidth: 95,
                            maxLength: 20
                        }, {
                            xtype: 'chkbox',
                            name: 'test',
                            fieldLabel: i18n.getMsg('test'),
                            margin: '0, 5, 5, 5',
                            width: '20%',
                            labelWidth: 30,
                            allowBlank: false
                        }]
                    }, {
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        border: false,
                        items: [{
                            xtype: 'messstellelabor',
                            name: 'mstlabor',
                            fieldLabel: i18n.getMsg('labor_mst_id'),
                            margin: '0, 5, 5, 5',
                            width: '35%',
                            labelWidth: 100,
                            allowBlank: false,
                            editable: true,
                            listenersJson: {
                                select: {
                                    fn: function(combo, newValue) {
                                        var mst = newValue.get('messStelle');
                                        var labor = newValue.get('laborMst');
                                        combo.up('fieldset').down('messstelle[name=mstId]').setValue(mst);
                                        combo.up('fieldset').down('messstelle[name=laborMstId]').setValue(labor);
                                        combo.up('fieldset').down('messprogrammland[name=mplId]').setValue();
                                    }
                                }
                            }
                        }, {
                            xtype: 'messstelle',
                            name: 'mstId',
                            fieldLabel: i18n.getMsg('mst_id'),
                            allowBlank: false,
                            editable: true,
                            hidden: true,
                            width: '0%'
                        }, {
                            xtype: 'messstelle',
                            name: 'laborMstId',
                            fieldLabel: i18n.getMsg('labor_mst_id'),
                            labelWidth: 100,
                            allowBlank: false,
                            editable: true,
                            hidden: true,
                            width: '0%'
                        }, {
                            xtype: 'netzbetreiber',
                            name: 'netzbetreiber',
                            editable: false,
                            readOnly: true,
                            isFormField: false,
                            submitValue: false,
                            fieldLabel: i18n.getMsg('netzbetreiberId'),
                            margin: '0, 5, 5, 5',
                            width: '40%',
                            labelWidth: 80
                        }, {
                            xtype: 'datenbasis',
                            editable: false,
                            allowBlank: false,
                            name: 'datenbasisId',
                            fieldLabel: i18n.getMsg('datenbasisId'),
                            margin: '0, 5, 5, 5',
                            width: '25%',
                            labelWidth: 65
                        }]
                    }, {
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        border: false,
                        items: [{
                            xtype: 'probenart',
                            editable: false,
                            name: 'probenartId',
                            fieldLabel: i18n.getMsg('probenartId'),
                            margin: '0, 5, 5, 5',
                            width: '35%',
                            labelWidth: 100,
                            allowBlank: false
                        }, {
                            xtype: 'betriebsart',
                            name: 'baId',
                            margin: '0, 0, 5, 5',
                            fieldLabel: i18n.getMsg('baId'),
                            width: '65%',
                            labelWidth: 80
                        }]
                    }, {
                        xtype: 'tfield',
                        name: 'kommentar',
                        fieldLabel: i18n.getMsg('kommentar'),
                        width: '100%',
                        margin: '0, 0, 5, 5',
                        labelWidth: 95
                    }]
                }, {
                    xtype: 'probenehmer',
                    name: 'probeNehmerId',
                    fieldLabel: i18n.getMsg('probenehmerId'),
                    margin: '0, 10, 5, 5',
                    minValue: 0,
                    editable: true,
                    labelWidth: 95,
                    extraParams: function() {
                        this.down('combobox').on({ // this = widget
                            focus: function(combo) {
                                var store = Ext.StoreManager.get('probenehmer');
                                store.clearFilter();
                                var nId = combo.up('fieldset')
                                    .down('netzbetreiber[name=netzbetreiber]')
                                    .getValue();
                                if (!nId) {
                                    store.filterBy(function(record) {
                                        return Lada.netzbetreiber.indexOf(
                                            record.get('netzbetreiberId')) > -1;
                                    });
                                } else {
                                    store.filter({
                                        property: 'netzbetreiberId',
                                        value: nId,
                                        exactMatch: true});
                                }
                            }
                        });
                    }
                }, {
                    xtype: 'messprogrammland',
                    name: 'mplId',
                    fieldLabel: i18n.getMsg('mpl_id'),
                    margin: '0, 10, 5, 5',
                    labelWidth: 115,
                    editable: true,
                    extraParams: function() {
                        this.down('combobox').on({ // this = widget
                            focus: function(combo) {
                                var store = Ext.StoreManager.get('messprogrammkategorie');
                                store.clearFilter();
                                var nId = combo.up('fieldset')
                                    .down('netzbetreiber[name=netzbetreiber]')
                                    .getValue();
                                if (!nId) {
                                    store.filterBy(function(record) {
                                        return Lada.netzbetreiber.indexOf(
                                            record.get('netzbetreiberId')) > -1;
                                    });
                                } else {
                                    store.filter({
                                        property:'netzbetreiberId',
                                        value: nId,
                                        exactMatch: true
                                    });
                                }
                            }
                        });
                    }
                }, {
                    xtype: 'container',
                    name: 'reiComboContainer',
                    width: '100%',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'reiprogpunktgruppe',
                        name: 'reiProgpunktGrpId',
                        fieldLabel: i18n.getMsg('reiprogpunktgruppe'),
                        margin: '0 5 5 5',
                        allowBlank: true,
                        editable: true,
                        hidden: true
                    }, {
                        xtype: 'ktagruppe',
                        name: 'ktaGruppeId',
                        fieldLabel: i18n.getMsg('ktagruppe'),
                        margin: '0 5 5 5',
                        hidden: true,
                        editable: true,
                        allowBlank: true
                    }]
                }, {
                    // Medium
                    xtype: 'fieldset',
                    title: i18n.getMsg('medium'),
                    border: true,
                    margin: '10, 10, 5, 5',
                    items: [{
                        border: false,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        width: '100%',
                        items: [{
                            xtype: 'umwelt',
                            name: 'umwId',
                            fieldLabel: i18n.getMsg('umwId'),
                            labelWidth: 100,
                            editable: true,
                            listeners: {
                                dirtychange: {
                                    fn: this.updateOnChange,
                                    scope: me
                                }
                            }
                        }, {
                            border: false,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            width: '100%',
                            items: [{
                                xtype: 'tfield',
                                maxLength: 38,
                                enforceMaxLength: true,
                                name: 'mediaDesk',
                                width: '58%',
                                labelWidth: 100,
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
                                margin: '0, 0, 5, 10',
                                width: '42%',
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
                    layout: 'fit',
                    margin: '0, 10, 0, 5',
                    items: [{
                        xtype: 'textarea',
                        name: 'probeKommentar',
                        labelAlign: 'top',
                        fieldLabel: i18n.getMsg('probeKommentar'),
                        width: '100%',
                        labelwidth: 135
                    }]
                }, {
                    // Zeit
                    xtype: 'fieldset',
                    title: i18n.getMsg('probenintervallFieldset'),
                    margin: '10, 10, 5, 5',
                    border: true,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    defaults: {
                        margin: '5,5,5,5'
                    },
                    items: [{
                        xtype: 'fset',
                        name: 'probenIntervallFieldset',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        border: false,
                        margin: 0,
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
                            labelWidth: 100,
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
                        pack: 'center',
                        margin: '5, 40, 10, 40',
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
                        border: false,
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

        var svalUpper = null;
        var svalLower = null;
        var min = null;
        var max = null;

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
        if (intervall === 'J') {
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
        // created and the discard function is used, intrec will be null && edit is allowed
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


    setRecord: function(messRecord) {
        this.clearMessages();
        this.getForm().loadRecord(messRecord);
        if (!messRecord.data || messRecord.data.id == null) {
            return;
        }
        //Set the intervall numberfields and the slider.
        this.down('probenintervallslider').setValue([
            messRecord.get('teilintervallVon'),
            messRecord.get('teilintervallBis')
        ]);

        this.populateIntervall(messRecord);

        this.down('probenintervallslider').on(
            'change',
            Lada.app.getController('Lada.controller.form.Messprogramm')
                .synchronizeFields
        );
        var mstStore = Ext.data.StoreManager.get('messstellen');
        var mstId = mstStore.getById(messRecord.get('mstId'));
        if (!messRecord.get('owner')) {
            var laborMstId = mstStore.getById(messRecord.get('laborMstId'));
            if (laborMstId) {
                laborMstId = laborMstId.get('messStelle');
            } else {
                laborMstId = '';
            }
            var id = this.down('messstellelabor').store.count() + 1;
            if ( messRecord.get('mstId') === messRecord.get('laborMstId') ) {
                displayCombi = mstId.get('messStelle');
            } else {
                displayCombi = mstId.get('messStelle') + '/' + laborMstId;
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
            this.down('messstellelabor').setStore(newStore);
            this.down('messstellelabor').down('combobox').setValue(id);
        } else {
            var mstLaborStore = Ext.data.StoreManager.get('messstellelabor');
            var availableitems = mstLaborStore.queryBy(function(record) {
                if (record.get('messStelle') === messRecord.get('mstId') &&
                    record.get('laborMst') === messRecord.get('laborMstId')) {
                    return true;
                }
            });
            var newStore = Ext.create('Ext.data.Store', {
                model: 'Lada.model.MessstelleLabor',
                data: availableitems.items});
            this.down('messstellelabor').setStore(newStore);
            this.down('messstellelabor').setValue(messRecord.get('messstellelabor'));
        }
        this.down('netzbetreiber').setValue(mstId.get('netzbetreiberId'));
    },

    setMediaDesk: function(record) {
        var media = record.get('mediaDesk');
        if (media) {
            var mediaParts = media.split(' ');
            this.setMediaSN(0, mediaParts);
        } else {
            this.setMediaSN(0, '0');
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
        cbox.store.proxy.extraParams = {
            'layer': ndx
        };
        if (ndx >= 1) {
            var parents = current.getParents(cbox);
            if (parents.length === 0) {
                return;
            }
            cbox.store.proxy.extraParams.parents = parents;
        }
        cbox.store.load(function(records, op, success) {
            if (!success) {
                return;
            }
            cbox.select(cbox.store.findRecord('sn', parseInt(media[ndx + 1], 10)));
            var mediatext = cbox.store.findRecord('sn', parseInt(media[ndx + 1], 10));
            if (mediatext !== null) {
                if ( (ndx <= 3) && (media[1] === '01') && (mediatext.data.beschreibung !== 'leer') ) {
                    beschreibung = mediatext.data.beschreibung;
                } else if ( (media[1] !== '01') && (mediatext.data.beschreibung !== 'leer') && (ndx <= 1) ) {
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
    },

    setReadOnly: function(value) {
        this.down('cbox[name=mstlabor]').setReadOnly(value);
        this.down('cbox[name=datenbasisId]').setReadOnly(value);
        this.down('cbox[name=baId]').setReadOnly(value);
        this.down('chkbox[name=test]').setReadOnly(value);
        this.down('cbox[name=probenartId]').setReadOnly(value);
        //         this.down('netzbetreiber').setReadOnly(value);
        this.down('cbox[name=probenintervall]').setReadOnly(value);
        this.down('numfield[name=teilintervallVon]').setReadOnly(value);
        this.down('numfield[name=teilintervallBis]').setReadOnly(value);
        this.down('numfield[name=intervallOffset]').setReadOnly(value);
        this.down('dayofyear[name=gueltigVon]').setReadOnly(value);
        this.down('dayofyear[name=gueltigBis]').setReadOnly(value);
        this.down('cbox[name=umwId]').setReadOnly(value);
        this.down('cbox[name=probeNehmerId]').setReadOnly(value);
        this.down('messprogrammland[name=mplId]').setReadOnly(value);
        this.down('probenintervallslider').setReadOnly(value);
        for (var i = 0; i < 12; i++) {
            this.down('deskriptor[layer='+i+']').setReadOnly(value);
        }
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
