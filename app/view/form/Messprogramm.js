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
    extend: 'Lada.view.form.LadaForm',
    alias: 'widget.messprogrammform',
    requires: [
        'Lada.util.FunctionScheduler',
        'Lada.view.form.mixins.DeskriptorFieldset',
        'Lada.view.widget.Datenbasis',
        'Lada.view.widget.base.CheckBox',
        'Lada.view.widget.Betriebsart',
        'Lada.view.widget.Probenart',
        'Lada.view.widget.MessprogrammLand',
        'Lada.view.widget.MessstelleLabor',
        'Lada.view.widget.Umwelt',
        'Lada.view.widget.base.TextField',
        'Lada.view.widget.base.NumberField',
        'Lada.view.widget.base.FieldSet',
        'Lada.model.Mpg',
        'Lada.view.widget.Probenintervall',
        'Lada.view.widget.DayOfYear'
    ],

    model: 'Lada.model.Mpg',
    margin: 5,
    border: false,

    recordId: null,

    trackResetOnLoad: true,

    statics: {
        mediaSnScheduler: null
    },

    mixins: ['Lada.view.form.mixins.DeskriptorFieldset'],

    initComponent: function() {
        if (Lada.view.form.Messprogramm.mediaSnScheduler === null) {
            Lada.view.form.Messprogramm.mediaSnScheduler = Ext.create(
                'Lada.util.FunctionScheduler');
        }
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
                    items: [{
                        text: i18n.getMsg('copy'),
                        action: 'copy',
                        qtip: i18n.getMsg('copy.qtip',
                            i18n.getMsg('messprogramm')),
                        icon: 'resources/img/dialog-ok-apply.png',
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
                            width: '48%',
                            labelWidth: 95,
                            maxLength: 20
                        }, {
                            xtype: 'chkbox',
                            name: 'isActive',
                            fieldLabel: i18n.getMsg('messprogramm.aktiv'),
                            margin: '0, 5, 5, 5',
                            width: '10%',
                            labelWidth: 30,
                            allowBlank: false
                        }, {
                            xtype: 'chkbox',
                            name: 'isTest',
                            fieldLabel: i18n.getMsg('test'),
                            margin: '0, 5, 5, 5',
                            width: '10%',
                            labelWidth: 30,
                            allowBlank: false
                        }, {
                            xtype: 'datenbasis',
                            editable: false,
                            allowBlank: false,
                            name: 'regulationId',
                            fieldLabel: i18n.getMsg('datenbasisId'),
                            margin: '0, 5, 5, 5',
                            width: '32%',
                            labelWidth: 65
                        } ]
                    }, {
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        border: false,
                        items: [{
                            xtype: 'messstellelabor',
                            name: 'mstlabor',
                            width: '100%',
                            focusFilters: [
                                function(item) {
                                    var functions = Lada.netzbetreiberFunktionen[
                                        item.get('netzbetreiberId')];
                                    return functions
                                        && Ext.Array.contains(functions, 4);
                                }
                            ]
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
                            name: 'sampleMethId',
                            fieldLabel: i18n.getMsg('probenartId'),
                            margin: '0, 5, 5, 5',
                            width: '50%',
                            labelWidth: 100,
                            allowBlank: false
                        }, {
                            xtype: 'betriebsart',
                            name: 'oprModeId',
                            margin: '0, 0, 5, 5',
                            fieldLabel: i18n.getMsg('baId'),
                            width: '50%',
                            labelWidth: 80
                        }]
                    }, {
                        xtype: 'tfield',
                        name: 'commMpg',
                        fieldLabel: i18n.getMsg('kommentar'),
                        width: '100%',
                        margin: '0, 0, 5, 5',
                        labelWidth: 100
                    }]
                }, {
                    xtype: 'probenehmer',
                    name: 'samplerId',
                    fieldLabel: i18n.getMsg('probenehmer'),
                    margin: '0, 10, 5, 5',
                    minValue: 0,
                    editable: true,
                    labelWidth: 100,
                    extraParams: function() {
                        this.down('combobox').on({ // this = widget
                            focus: function(combo) {
                                var store = combo.getStore();
                                store.clearFilter();
                                var nId = combo.up('fieldset')
                                    .down('field[name=netzbetreiber]')
                                    .getValue();
                                if (!nId) {
                                    store.filterBy(function(record) {
                                        return Lada.netzbetreiber.indexOf(
                                            record.get('networkId')) > -1;
                                    });
                                } else {
                                    store.filter({
                                        property: 'networkId',
                                        value: nId,
                                        exactMatch: true});
                                }
                            }
                        });
                    }
                }, {
                    xtype: 'messprogrammland',
                    name: 'stateMpgId',
                    fieldLabel: i18n.getMsg('mpl_id'),
                    margin: '0, 10, 5, 5',
                    labelWidth: 140,
                    editable: true,
                    extraParams: function() {
                        this.down('combobox').on({ // this = widget
                            focus: function(combo) {
                                var store = combo.getStore();
                                store.clearFilter();
                                var nId = combo.up('fieldset')
                                    .down('field[name=netzbetreiber]')
                                    .getValue();
                                if (!nId) {
                                    store.filterBy(function(record) {
                                        return Lada.netzbetreiber.indexOf(
                                            record.get('networkId')) > -1;
                                    });
                                } else {
                                    store.filter({
                                        property: 'networkId',
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
                        name: 'reiAgGrId',
                        width: '50%',
                        labelWidth: 140,
                        fieldLabel: i18n.getMsg('reiProgpunktGrpId'),
                        margin: '0 5 5 5',
                        allowBlank: true,
                        editable: true,
                        hidden: true
                    }, {
                        xtype: 'ktagruppe',
                        name: 'nuclFacilGrId',
                        width: '50%',
                        labelWidth: 140,
                        fieldLabel: i18n.getMsg('ktaGruppeId'),
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
                            border: false,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [{
                                xtype: 'umwelt',
                                name: 'envMediumId',
                                fieldLabel: i18n.getMsg('umwId'),
                                labelWidth: 100,
                                width: '58%',
                                editable: true
                            }, {
                                xtype: 'messeinheit',
                                name: 'unitId',
                                fieldLabel: i18n.getMsg('mehId'),
                                labelWidth: 75,
                                width: '42%',
                                margin: '0, 0, 5, 5',
                                editable: true
                            }]
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
                                labelWidth: 100,
                                fieldLabel: i18n.getMsg('mediaDesk'),
                                editable: false
                            }, {
                                xtype: 'textfield',
                                name: 'envDescripName',
                                margin: '0, 0, 5, 10',
                                width: '42%',
                                enforceMaxLength: true,
                                editable: false,
                                isDirty: function() {
                                    return false;
                                }
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
                            items: this.buildDescriptors()
                        }]
                    }]
                }, {
                    layout: 'fit',
                    margin: '0, 10, 0, 5',
                    items: [{
                        xtype: 'textfield',
                        name: 'sampleQuant',
                        labelAlign: 'top',
                        fieldLabel: i18n.getMsg('probenahmeMenge'),
                        width: '100%',
                        labelwidth: 135
                    }]
                }, {
                    layout: 'fit',
                    margin: '0, 10, 0, 5',
                    items: [{
                        xtype: 'textarea',
                        name: 'commSample',
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
                            margin: '0 10 5 0',
                            labelWidth: 50,
                            width: '40%',
                            name: 'samplePd'
                        }, {
                            xtype: 'numfield',
                            allowDecimals: false,
                            allowBlank: false,
                            fieldLabel: i18n.getMsg('teilintervallVon'),
                            margin: '0 5 5 5',
                            labelWidth: 100,
                            minValue: 0,
                            width: '28%',
                            name: 'samplePdStartDate',
                            period: 'start'
                        }, {
                            xtype: 'numfield',
                            allowDecimals: false,
                            allowBlank: false,
                            fieldLabel: i18n.getMsg('teilintervallBis'),
                            margin: '0 15 5 5',
                            labelWidth: 18,
                            minValue: 0,
                            width: '14%',
                            name: 'samplePdEndDate',
                            period: 'end'
                        }, {
                            xtype: 'numfield',
                            allowDecimals: false,
                            margin: '0 5 5 5',
                            fieldLabel: i18n.getMsg('offset'),
                            labelWidth: 40,
                            minValue: 0,
                            width: '17%',
                            name: 'samplePdOffset'
                        }]
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
                            name: 'validStartDate',
                            border: false
                        }, {
                            xtype: 'dayofyear',
                            allowBlank: false,
                            fieldLabel: i18n.getMsg('gueltigBis'),
                            width: '50%',
                            labelWidth: 40,
                            name: 'validEndDate',
                            border: false
                        }]
                    }]
                //Zusatzwert-Fieldset
                }, {
                    xtype: 'fset',
                    name: 'zusatzwertFieldset',
                    title: i18n.getMsg('title.zusatzwerte'),
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    border: true,
                    margin: '10, 10, 5, 5',
                    defaults: {
                        margin: '5,5,5,5'
                    },
                    items: [{
                        xtype: 'tagfield',
                        autoSelect: false,
                        queryMode: 'local',
                        width: '100%',
                        name: 'sampleSpecifs',
                        emptyText: i18n.getMsg('emptytext.pzw.widget'),
                        store: Ext.create('Lada.store.Probenzusaetze'),
                        valueField: 'id',
                        tpl: Ext.create(
                            'Ext.XTemplate',
                            '<ul class="x-list-plain"><tpl for=".">',
                            '<li role="option" class="x-boundlist-item">',
                            '{id} - {name}',
                            '</li>',
                            '</tpl></ul>'
                        ),
                        labelTpl: Ext.create(
                            'Ext.XTemplate',
                            '<tpl for=".">{id} - {name}</tpl>'),
                        // See Lada.override.FilteredComboBox:
                        displayField: 'id',
                        searchValueField: 'name'
                    }]
                }]
            }]
        }];
        this.callParent(arguments);
    },

    /**
     * Filter ProbenZusatz tagfield by umwId
     *
     * @param {*} umwId UmwId for filtering
     */
    filterProbenZusatzs: function(umwId) {
        var params = {};
        if (umwId) {
            params['umwId'] = umwId;
        }
        this.down('tagfield[name=sampleSpecifs]').getStore().load({
            params: params
        });
    },

    populateIntervall: function(record, intervall) {
        //intervall is an identifier of a intervall
        // for instance H, M, J, ...
        var i = this.getForm().findField('samplePdOffset');
        var v = this.getForm().findField('samplePdStartDate');
        var b = this.getForm().findField('samplePdEndDate');
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
            intervall = record.get('samplePd',
                0, false, false, true);

            svalUpper = record.get('samplePdStartDate');
            svalLower = record.get('samplePdEndDate');
        }

        // subintervall is redundant to validity for yearly samples
        if (intervall === 'J') {
            svalUpper = record.get('samplePDStartDate');
            svalLower = record.get('samplePDEndDate');
            this.down('dayofyear[name=validStartDate]').setReadOnly(true);
            this.down('dayofyear[name=validEndDate]').setReadOnly(true);
        } else {
            b.setReadOnly(false);
            v.setReadOnly(false);
            this.down('dayofyear[name=validStartDate]').setReadOnly(false);
            this.down('dayofyear[name=validEndDate]').setReadOnly(false);
        }

        var intrec = intervallstore
            .findRecord('samplePd',
                intervall, 0, false, false, true);

        if (intrec) { // in cases when a new messprogramm is
        // created and the discard function is used, intrec will be null &&
        // edit is allowed consequently the assertion below will fail.
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

        v.setValue(svalLower);
        b.setValue(svalUpper);

        //Set IntervallOffset
        i.setMinValue(0);
        switch (intervall) {
            case 'H':
                i.setMaxValue(150);
                break;
            case 'Q':
                i.setMaxValue(88);
                break;
            case 'M':
                i.setMaxValue(27);
                break;
            default:
                return i.setMaxValue(max - 1);
        }
    },


    setRecord: function(messRecord) {
        this.clearMessages();

        this.getForm().loadRecord(messRecord);

        // Set associated data in tag field
        var pzwField = this.down('field[name=probenZusatzs]');
        pzwField.setValue(messRecord.probenZusatzs().getRange());
        pzwField.resetOriginalValue();

        this.populateIntervall(messRecord);

        this.filterProbenZusatzs(messRecord.get('envMediumId'));

        this.setMediaDesk(messRecord);
    },

    setMediaDesk: function(record) {
        this.setMediaDeskImpl(
            Lada.view.form.Messprogramm.mediaSnScheduler,
            record
        );
    }
});
