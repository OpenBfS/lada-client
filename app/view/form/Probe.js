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
    extend: 'Lada.view.form.LadaForm',
    alias: 'widget.probeform',
    requires: [
        'Lada.util.FunctionScheduler',
        'Lada.view.form.mixins.DeskriptorFieldset',
        'Lada.view.widget.Datenbasis',
        'Lada.view.widget.DatensatzErzeuger',
        'Lada.view.widget.Probenehmer',
        'Lada.view.widget.MessprogrammLand',
        'Lada.view.widget.base.CheckBox',
        'Lada.view.widget.MessstelleLabor',
        'Lada.view.widget.Betriebsart',
        'Lada.view.widget.Probenart',
        'Lada.view.widget.ReiProgpunktGruppe',
        'Lada.view.widget.KtaGruppe',
        'Lada.view.widget.Umwelt',
        'Lada.view.widget.Deskriptor',
        'Lada.view.widget.base.TextField',
        'Lada.view.widget.base.Datetime',
        'Lada.view.widget.base.FieldSet',
        'Lada.view.widget.base.DateField',
        'Lada.view.widget.base.SelectableDisplayField',
        'Lada.view.window.MessungCreate',
        'Lada.model.Sample'
    ],

    model: 'Lada.model.Sample',
    minWidth: 650,
    margin: 5,
    border: false,

    recordId: null,

    trackResetOnLoad: true,

    statics: {
        mediaSnScheduler: null
    },

    mixins: ['Lada.view.form.mixins.DeskriptorFieldset'],

    initComponent: function() {
        if (Lada.view.form.Probe.mediaSnScheduler === null) {
            Lada.view.form.Probe.mediaSnScheduler = Ext.create(
                'Lada.util.FunctionScheduler');
        }
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            xtype: 'fieldset',
            title: i18n.getMsg('title.general'),
            items: [{
                border: false,
                margin: '0, 0, 10, 0',
                dockedItems: [{
                    xtype: 'toolbar',
                    name: 'generaltoolbar',
                    dock: 'bottom',
                    border: '0, 1, 1, 1',
                    style: {
                        borderBottom: '1px solid #b5b8c8 !important',
                        borderLeft: '1px solid #b5b8c8 !important',
                        borderRight: '1px solid #b5b8c8 !important'
                    },
                    items: [{
                        text: i18n.getMsg('copy'),
                        action: 'copy',
                        qtip: i18n.getMsg('copy.qtip', i18n.getMsg('probe')),
                        icon: 'resources/img/dialog-ok-apply.png',
                        disabled: true
                    }, '->', {
                        text: i18n.getMsg('audittrail'),
                        qtip: i18n.getMsg('qtip.audit'),
                        icon: 'resources/img/distribute-vertical-center.png',
                        action: 'audit',
                        disabled: this.recordId === null
                    }, {
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
                    border: false,
                    items: [{
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        border: false,
                        width: '100%',
                        items: [{
                            xtype: 'selectabledisplayfield',
                            name: 'extId',
                            fieldLabel: i18n.getMsg('extProbeId'),
                            margin: '0, 5, 5, 5',
                            labelWidth: 45,
                            maxLength: 16,
                            width: '32%'
                        }, {
                            xtype: 'selectabledisplayfield',
                            name: 'mpgId',
                            fieldLabel: i18n.getMsg('mprId'),
                            margin: '0, 5, 5, 5',
                            labelWidth: 55,
                            maxLength: 20,
                            width: '22%'
                        }, {
                            xtype: 'chkbox',
                            name: 'isTest',
                            fieldLabel: 'Test',
                            margin: '0, 5, 5, 5',
                            width: '16%',
                            labelWidth: 30
                        }, {
                            xtype: 'datenbasis',
                            editable: false,
                            allowBlank: false,
                            name: 'regulationId',
                            fieldLabel: 'Datenbasis',
                            margin: '0, 5, 5, 5',
                            width: '30%',
                            labelWidth: 65
                        }]
                    }, {
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        border: false,
                        width: '100%',
                        items: [{
                            xtype: 'messstellelabor',
                            name: 'mstlabor',
                            width: '100%',
                            focusFilters: [
                                function(item) {
                                    return Ext.Array.contains(
                                        Lada.userroles, item.get('ldapGroup'));
                                }
                            ]
                        }]
                    }, {
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        border: false,
                        width: '100%',
                        items: [{
                            xtype: 'tfield',
                            name: 'mainSampleId',
                            fieldLabel: i18n.getMsg('hauptprobenNr'),
                            margin: '0, 5, 5, 5',
                            width: '35%',
                            labelWidth: 95,
                            maxLength: 20
                        }, {
                            xtype: 'betriebsart',
                            name: 'oprModeId',
                            fieldLabel: i18n.getMsg('baId'),
                            margin: '0, 5, 5, 5',
                            width: '35%',
                            allowBlank: false,
                            labelWidth: 80
                        }, {
                            xtype: 'probenart',
                            //editable: true,
                            name: 'sampleMethId',
                            fieldLabel: i18n.getMsg('probenartId'),
                            margin: '0, 5, 5, 5',
                            width: '30%',
                            allowBlank: false,
                            labelWidth: 65
                        }]
                    }, {
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        border: false,
                        width: '100%',
                        items: [{
                            xtype: 'probenehmer',
                            name: 'samplerId',
                            fieldLabel: i18n.getMsg('probenehmer'),
                            margin: '0, 5, 5, 5',
                            width: '50%',
                            minValue: 0,
                            anchor: '100%',
                            labelWidth: 95,
                            editable: true,
                            extraParams: function() {
                                this.down('combobox').on({
                                    focus: {
                                        fn: function(combo) {
                                            var store = combo.getStore();
                                            store.clearFilter();
                                            /*eslint-disable max-len*/
                                            var nId = combo.up('fieldset')
                                                .down('messstellelabor')
                                                .getNetworkId();
                                            if (!nId || nId.length === 0) {
                                                store.filterBy(
                                                    function(record) {
                                                        return Lada.netzbetreiber
                                                            .indexOf(
                                                                record.get('networkId'))
                                                            > -1;
                                                    });
                                                /*eslint-enable max-len*/
                                            } else {
                                                store.filter({
                                                    property: 'networkId',
                                                    value: nId,
                                                    exactMatch: true
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        }, {
                            xtype: 'datensatzerzeuger',
                            name: 'datasetCreatorId',
                            fieldLabel: 'Datensatzerzeuger',
                            margin: '0, 5, 5, 5',
                            width: '50%',
                            anchor: '100%',
                            editable: true,
                            labelWidth: 110,
                            extraParams: function() {
                                this.down('combobox').on({
                                    focus: {
                                        fn: function(combo) {
                                            var store = combo.getStore();
                                            store.clearFilter();
                                            /*eslint-disable max-len*/
                                            var nId = combo.up('fieldset')
                                                .down('messstellelabor')
                                                .getNetworkId();
                                            var dId = combo.up('fieldset')
                                                .down('textfield[name=measFacilId]')
                                                .getValue();
                                            if (!nId || nId.length === 0) {
                                                store.filterBy(function(record) {
                                                    return Lada.netzbetreiber.indexOf(
                                                        record.get('networkId'))
                                                        > -1;
                                                });
                                            /*eslint-enable max-len*/
                                            } else {
                                                store.filter([
                                                    {
                                                        property: 'networkId',
                                                        value: nId,
                                                        exactMatch: true
                                                    }, {
                                                        property: 'measFacilId',
                                                        value: dId,
                                                        exactMatch: true
                                                    }
                                                ]);
                                            }
                                        }
                                    }
                                });
                            }
                        }]
                    }, {
                        xtype: 'messprogrammland',
                        name: 'stateMpgId',
                        fieldLabel: i18n.getMsg('mpl_id'),
                        margin: '0, 5, 5, 5',
                        width: '100%',
                        anchor: '100%',
                        labelWidth: 140,
                        editable: true,
                        extraParams: function() {
                            this.down('combobox').on({
                                focus: {
                                    fn: function(combo) {
                                        var store = combo.getStore();
                                        store.clearFilter();
                                        /*eslint-disable max-len*/
                                        var nId = combo.up('fieldset')
                                            .down('messstellelabor')
                                            .getNetworkId();
                                        if (!nId || nId.length === 0) {
                                            store.filterBy(function(record) {
                                                return Lada.netzbetreiber.indexOf(
                                                    record.get('networkId')) > -1;
                                            });
                                        /*eslint-enable max-len*/
                                        } else {
                                            store.filter({
                                                property: 'networkId',
                                                value: nId,
                                                exactMatch: true
                                            });
                                        }
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
                            width: '50%',
                            labelWidth: 140,
                            name: 'reiAgGrId',
                            fieldLabel: i18n.getMsg('reiProgpunktGrpId'),
                            margin: '0 5 5 5',
                            allowBlank: true,
                            editable: true,
                            hidden: true
                        }, {
                            xtype: 'ktagruppe',
                            width: '50%',
                            labelWidth: 140,
                            name: 'nuclFacilGrId',
                            fieldLabel: i18n.getMsg('ktaGruppeId'),
                            margin: '0 5 5 5',
                            hidden: true,
                            editable: true,
                            allowBlank: true
                        }]
                    }]
                }, {
                    // Zeit
                    xtype: 'fset',
                    name: 'zeit',
                    title: i18n.getMsg('title.time'),
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'fset',
                        name: 'sollzeitPeriod',
                        width: '100%',
                        border: false,
                        margin: 0,
                        layout: {
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'selectabledisplayfield',
                            fieldLabel: i18n.getMsg('sollVon'),
                            labelWidth: 130,
                            margin: '0, 5, 5, 5',
                            name: 'schedStartDate',
                            width: '50%',
                            renderer: function(v) {
                                return Lada.util.Date.formatTimestamp(
                                    v, 'd.m.Y', true);
                            }
                        }, {
                            xtype: 'selectabledisplayfield',
                            fieldLabel: i18n.getMsg('sollBis'),
                            labelWidth: 25,
                            margin: '0, 5, 5, 5',
                            name: 'schedEndDate',
                            width: '50%',
                            renderer: function(v) {
                                return Lada.util.Date.formatTimestamp(
                                    v, 'd.m.Y', true);
                            }
                        }]
                    }, {
                        xtype: 'fset',
                        name: 'entnahmePeriod',
                        plainTitle: ' ',
                        width: '100%',
                        border: false,
                        margin: 0,
                        layout: {
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'datetime',
                            fieldLabel: i18n.getMsg('probenentnahmeVon'),
                            labelWidth: 130,
                            margin: '0, 5, 5, 5',
                            name: 'sampleStartDate',
                            format: 'd.m.Y H:i',
                            width: '50%',
                            period: 'start'
                        }, {
                            xtype: 'datetime',
                            fieldLabel: i18n.getMsg('probenentnahmeBis'),
                            labelWidth: 17,
                            margin: '0, 5, 5, 5',
                            name: 'sampleEndDate',
                            format: 'd.m.Y H:i',
                            width: '50%',
                            period: 'end'
                        }]
                    }, {
                        xtype: 'fset',
                        name: 'ursprung',
                        plainTitle: ' ',
                        width: '100%',
                        border: false,
                        margin: 0,
                        layout: {
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'datetime',
                            fieldLabel: i18n.getMsg('ursprungszeit'),
                            labelWidth: 130,
                            margin: '0, 5, 5, 5',
                            name: 'origDate',
                            format: 'd.m.Y H:i',
                            width: '50%'
                        }]
                    }]
                }, {
                    // Medium
                    xtype: 'fieldset',
                    title: i18n.getMsg('title.media'),
                    width: '100%',
                    items: [{
                        border: false,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        width: '100%',
                        items: [{
                            xtype: 'umwelt',
                            name: 'envMediumId',
                            fieldLabel: 'Umweltbereich',
                            labelWidth: 100,
                            allowBlank: true,
                            editable: true
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
                                name: 'envDescripDisplay',
                                width: '58%',
                                margin: '0 5 0 0',
                                labelWidth: 100,
                                fieldLabel: i18n.getMsg('mediaDesk'),
                                editable: false
                            }, {
                                xtype: 'textfield',
                                margin: '0 0 0 5',
                                name: 'envDescripName',
                                width: '42%',
                                enforceMaxLength: true,
                                editable: false
                            }]
                        }, {
                            xtype: 'fset',
                            title: i18n.getMsg('title.deskriptordetails'),
                            name: 'deskriptordetails',
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
        if (!probeRecord.data || probeRecord.data.id === null) {
            return;
        }
        if (probeRecord.get('owner') && !probeRecord.phantom) {
            this.down('button[action=copy]').setDisabled(false);
        }

        this.setMediaDesk(probeRecord);
    },

    setMediaDesk: function(record) {
        this.setMediaDeskImpl(
            Lada.view.form.Probe.mediaSnScheduler,
            record
        );
    }
});
