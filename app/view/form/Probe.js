/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to edit a Probe
 */
Ext.define('Lada.view.form.Probe', {
    extend: 'Ext.form.Panel',
    alias: 'widget.probeform',
    requires: [
        'Lada.view.widget.Datenbasis',
        'Lada.view.widget.DatensatzErzeuger',
        'Lada.view.widget.Probenehmer',
        'Lada.view.widget.MessprogrammLand',
        'Lada.view.widget.base.CheckBox',
        'Lada.view.widget.MessstelleLabor',
        'Lada.view.widget.Netzbetreiber',
        'Lada.view.widget.Betriebsart',
        'Lada.view.widget.Probenart',
        'Lada.view.widget.Umwelt',
        'Lada.view.widget.Deskriptor',
        'Lada.view.widget.base.TextField',
        'Lada.view.widget.base.Datetime',
        'Lada.view.widget.base.FieldSet',
        'Lada.view.widget.base.DateField',
        'Lada.view.window.MessungCreate',
        'Lada.model.Probe'
    ],

    model: 'Lada.model.Probe',
    minWidth: 650,
    margin: 5,
    border: 0,

    recordId: null,

    trackResetOnLoad: true,

    initComponent: function() {
        var me = this;
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            xtype: 'fieldset',
            title: 'Allgemein',
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
                        text: 'Speichern',
                        qtip: 'Daten speichern',
                        icon: 'resources/img/dialog-ok-apply.png',
                        action: 'save',
                        disabled: true
                    }, {
                        text: 'Verwerfen',
                        qtip: 'Änderungen verwerfen',
                        icon: 'resources/img/dialog-cancel.png',
                        action: 'discard',
                        disabled: true
                    }]
                }],
                items: [{
                    layout: 'vbox',
                    border: 0,
                        items: [{
                             xtype: 'displayfield',
                             name: 'idAlt',
                             fieldLabel: i18n.getMsg('probeId'),
                             margin: '0, 5, 5, 5',
                             labelWidth: 95,
                             maxLength: 20
                        },{
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            border: 0,
                            width: '100%',
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
                                hidden: true
                            }, {
                                xtype: 'messstelle',
                                name: 'laborMstId',
                                fieldLabel: 'Messstelle/Labor',
                                margin: '0, 5, 5, 5',
                                width: '35%',
                                labelWidth: 95,
                                allowBlank: false,
                                editable: true,
                                hidden: true
                            }, {
                                xtype: 'netzbetreiber',
                                editable: false,
                                readOnly: true,
                                isFormField: false,
                                submitValue: false,
                                fieldLabel: i18n.getMsg('netzbetreiberId'),
                                margin: '0, 5, 5, 5',
                                width: '35%',
                                labelWidth: 80
                            }, {
                                xtype: 'datenbasis',
                                editable: false,
                                name: 'datenbasisId',
                                fieldLabel: 'Datenbasis',
                                margin: '0, 5, 5, 5',
                                width: '20%',
                                labelWidth: 65
                            }, {
                                xtype: 'chkbox',
                                name: 'test',
                                fieldLabel: 'Test',
                                margin: '0, 5, 5, 5',
                                width: '10%',
                                anchor: '100%',
                                labelWidth: 30
                            }]
                        }, {
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            border: 0,
                            width: '100%',
                            items: [{
                                xtype: 'tfield',
                                name: 'hauptprobenNr',
                                fieldLabel: i18n.getMsg('hauptprobenNr'),
                                margin: '0, 5, 5, 5',
                                width: '35%',
                                labelWidth: 95,
                                maxLength: 20,
                                allowBlank: true
                            }, {
                                xtype: 'betriebsart',
                                name: 'baId',
                                fieldLabel: 'Messregime',
                                margin: '0, 5, 5, 5',
                                width: '35%',
                                labelWidth: 80
                            }, {
                                xtype: 'probenart',
                                editable: false,
                                name: 'probenartId',
                                fieldLabel: 'Probenart',
                                margin: '0, 15, 5, 5',
                                width: '20%',
                                labelWidth: 65,
                                allowBlank: false
                            }]
                        }, {
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            border: 0,
                            width: '100%',
                            items: [{
                                xtype: 'probenehmer',
                                name: 'probeNehmerId',
                                fieldLabel: 'Probennehmer',
                                margin: '0, 5, 5, 5',
                                width: '50%',
                                minValue: 0,
                                anchor: '100%',
                                labelWidth: 95
                            }, {
                                xtype: 'datensatzerzeuger',
                                name: 'erzeugerId',
                                fieldLabel: 'Datensatzerzeuger',
                                margin: '0, 5, 5, 5',
                                width: '50%',
                                anchor: '100%',
                                labelWidth: 110
                            }]
                        },{
                            xtype: 'messprogrammland',
                            name: 'mplId',
                            fieldLabel: 'Messprogramm-Land',
                            margin: '0, 5, 5, 5',
                            width: '100%',
                            anchor: '100%',
                            labelWidth: 110
                        }]
                }, {
                    // Zeit
                    xtype: 'fieldset',
                    title: 'Zeit',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'fset',
                        name: 'sollzeitPeriod',
                        width: '100%',
                        border: 0,
                        margin: 0,
                        layout: {
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'datefield',
                            emptyText: ' ',
                            fieldLabel: 'Sollzeitraum von',
                            labelWidth: 130,
                            margin: '0, 5, 5, 5',
                            name: 'solldatumBeginn',
                            format: 'd.m.Y',
                            period: 'start',
                            readOnly: true
                        }, {
                            xtype: 'datefield',
                            emptyText: ' ',
                            fieldLabel: 'bis',
                            labelWidth: 17,
                            margin: '0, 5, 5, 5',
                            name: 'solldatumEnde',
                            format: 'd.m.Y',
                            period: 'end',
                            readOnly: true
                        }]
                    }, {
                        xtype: 'fset',
                        name: 'entnahmePeriod',
                        width: '100%',
                        border: 0,
                        margin: 0,
                        layout: {
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'datetime',
                            fieldLabel: 'Probenentnahme von',
                            labelWidth: 130,
                            margin: '0, 5, 5, 5',
                            name: 'probeentnahmeBeginn',
                            format: 'd.m.Y H:i',
                            period: 'start'
                        }, {
                            xtype: 'datetime',
                            fieldLabel: 'bis',
                            labelWidth: 17,
                            margin: '0, 5, 5, 5',
                            name: 'probeentnahmeEnde',
                            format: 'd.m.Y H:i',
                            period: 'end'
                        }]
                    }]
                }, {
                    // Medium
                    xtype: 'fieldset',
                    title: 'Medium',
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
                            fieldLabel: 'Umweltbereich',
                            labelWidth: 125,
                            allowBlank: false,
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
                                    xtype: 'tfield',
                                    maxLength: 38,
                                    enforceMaxLength: true,
                                    name: 'mediaDesk',
                                    width: '60%',
                                    minWidth: 290,
                                    labelWidth: 125,
                                    fieldLabel: 'Deskriptoren',
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
                            title: 'Details Deskriptoren',
                            collapsible: true,
                            collapsed: true,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: this.buildDescriptors()
                        }]
                    }]
                }]
            }]
        }];
        this.callParent(arguments);
        this.clearMessages();
    },

    setRecord: function(probeRecord) {
        this.clearMessages();
        this.getForm().loadRecord(probeRecord);
        if (!probeRecord.raw) {
            return;
        }
        var mstStore = Ext.data.StoreManager.get('messstellen');
        var mstId = mstStore.getById(probeRecord.get('mstId'));
        if (!probeRecord.get('owner')) {
            var laborMstId = mstStore.getById(probeRecord.get('laborMstId'));
            if (laborMstId) {
                laborMstId = laborMstId.get('messStelle');
            }
            else {
                laborMstId = '';
            }
            var id = this.down('messstellelabor').store.count() + 1;
            var newStore = Ext.create('Ext.data.Store', {
                model: 'Lada.model.MessstelleLabor',
                data: [{
                    id: id,
                    laborMst: probeRecord.get('laborMstId'),
                    messStelle: probeRecord.get('mstId'),
                    displayCombi: mstId.get('messStelle') +
                        '/' + laborMstId
                }]
            });
            this.down('messstellelabor').down('combobox').store = newStore;
            this.down('messstellelabor').setValue(id);
        }
        else {
            var mstLaborStore = Ext.data.StoreManager.get('messstellelabor');
            var items = mstLaborStore.queryBy(function(record) {
                if (record.get('messStelle') === probeRecord.get('mstId') &&
                    record.get('laborMst') === probeRecord.get('laborMstId')) {
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
        this.down('cbox[name=mstlabor]').clearWarningOrError();
        this.down('tfield[name=hauptprobenNr]').clearWarningOrError();
        this.down('cbox[name=datenbasisId]').clearWarningOrError();
        this.down('cbox[name=baId]').clearWarningOrError();
        this.down('chkbox[name=test]').clearWarningOrError();
        this.down('cbox[name=probenartId]').clearWarningOrError();
        this.down('netzbetreiber').clearWarningOrError();
        this.down('cbox[name=erzeugerId]').clearWarningOrError();
        this.down('cbox[name=umwId]').clearWarningOrError();
        this.down('datetime[name=probeentnahmeBeginn]').clearWarningOrError();
        this.down('datetime[name=probeentnahmeEnde]').clearWarningOrError();
        this.down('fset[name=entnahmePeriod]').clearMessages();
        this.down('fset[name=sollzeitPeriod]').clearMessages();
    },

    setReadOnly: function(value) {
        this.down('cbox[name=mstlabor]').setReadOnly(value);
        this.down('tfield[name=hauptprobenNr]').setReadOnly(value);
        this.down('cbox[name=datenbasisId]').setReadOnly(value);
        this.down('cbox[name=baId]').setReadOnly(value);
        this.down('chkbox[name=test]').setReadOnly(value);
        this.down('cbox[name=probenartId]').setReadOnly(value);
        this.down('cbox[name=erzeugerId]').setReadOnly(value);
        this.down('cbox[name=umwId]').setReadOnly(value);
        this.down('datetime[name=probeentnahmeBeginn]').setReadOnly(value);
        this.down('datetime[name=probeentnahmeEnde]').setReadOnly(value);
        this.down('cbox[name=probeNehmerId]').setReadOnly(value);
        this.down('cbox[name=mplId]').setReadOnly(value);

        //Deskriptoren
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
                //name: 's' + i,
                labelWidth: 25,
                width: 190,
                layer: i,
                margin: '0, 10, 5, 0'
            };
        }
        return fields;
    }
});
