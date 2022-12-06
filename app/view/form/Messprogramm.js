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
        'Lada.model.Messprogramm',
        'Lada.view.widget.Probenintervall',
        'Lada.view.widget.DayOfYear'
    ],

    model: 'Lada.model.Messprogramm',
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
                            name: 'aktiv',
                            fieldLabel: i18n.getMsg('messprogramm.aktiv'),
                            margin: '0, 5, 5, 5',
                            width: '10%',
                            labelWidth: 30,
                            allowBlank: false
                        }, {
                            xtype: 'chkbox',
                            name: 'test',
                            fieldLabel: i18n.getMsg('test'),
                            margin: '0, 5, 5, 5',
                            width: '10%',
                            labelWidth: 30,
                            allowBlank: false
                        }, {
                            xtype: 'datenbasis',
                            editable: false,
                            allowBlank: false,
                            name: 'datenbasisId',
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
                            name: 'probenartId',
                            fieldLabel: i18n.getMsg('probenartId'),
                            margin: '0, 5, 5, 5',
                            width: '50%',
                            labelWidth: 100,
                            allowBlank: false
                        }, {
                            xtype: 'betriebsart',
                            name: 'baId',
                            margin: '0, 0, 5, 5',
                            fieldLabel: i18n.getMsg('baId'),
                            width: '50%',
                            labelWidth: 80
                        }]
                    }, {
                        xtype: 'tfield',
                        name: 'kommentar',
                        fieldLabel: i18n.getMsg('kommentar'),
                        width: '100%',
                        margin: '0, 0, 5, 5',
                        labelWidth: 100
                    }]
                }, {
                    xtype: 'probenehmer',
                    name: 'probeNehmerId',
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
                    labelWidth: 140,
                    editable: true,
                    extraParams: function() {
                        this.down('combobox').on({ // this = widget
                            focus: function(combo) {
                                var store = combo.getStore();
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
                        width: '50%',
                        labelWidth: 140,
                        fieldLabel: i18n.getMsg('reiProgpunktGrpId'),
                        margin: '0 5 5 5',
                        allowBlank: true,
                        editable: true,
                        hidden: true
                    }, {
                        xtype: 'ktagruppe',
                        name: 'ktaGruppeId',
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
                                name: 'umwId',
                                fieldLabel: i18n.getMsg('umwId'),
                                labelWidth: 100,
                                width: '58%',
                                editable: true
                            }, {
                                xtype: 'messeinheit',
                                name: 'mehId',
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
                                name: 'mediaDesk',
                                width: '58%',
                                labelWidth: 100,
                                fieldLabel: i18n.getMsg('mediaDesk'),
                                editable: false,
                                readOnly: true
                            }, {
                                xtype: 'textfield',
                                name: 'media',
                                margin: '0, 0, 5, 10',
                                width: '42%',
                                enforceMaxLength: true,
                                editable: false,
                                readOnly: true,
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
                        name: 'probenahmeMenge',
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
                            margin: '0 10 5 0',
                            labelWidth: 50,
                            width: '40%',
                            name: 'probenintervall'
                        }, {
                            xtype: 'numfield',
                            allowDecimals: false,
                            allowBlank: false,
                            fieldLabel: i18n.getMsg('teilintervallVon'),
                            margin: '0 5 5 5',
                            labelWidth: 100,
                            minValue: 0,
                            width: '28%',
                            name: 'teilintervallVon',
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
                            name: 'teilintervallBis',
                            period: 'end'
                        }, {
                            xtype: 'numfield',
                            allowDecimals: false,
                            margin: '0 5 5 5',
                            fieldLabel: i18n.getMsg('offset'),
                            labelWidth: 40,
                            minValue: 0,
                            width: '17%',
                            name: 'intervallOffset'
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
                        name: 'probenZusatzs',
                        emptyText: i18n.getMsg('emptytext.pzw.widget'),
                        store: Ext.create('Lada.store.Probenzusaetze'),
                        valueField: 'id',
                        tpl: Ext.create(
                            'Ext.XTemplate',
                            '<ul class="x-list-plain"><tpl for=".">',
                            '<li role="option" class="x-boundlist-item">',
                            '{id} - {beschreibung}',
                            '</li>',
                            '</tpl></ul>'
                        ),
                        labelTpl: Ext.create(
                            'Ext.XTemplate',
                            '<tpl for=".">{id} - {beschreibung}</tpl>'),
                        // See Lada.override.FilteredComboBox:
                        displayField: 'id',
                        searchValueField: 'beschreibung'
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
        this.down('tagfield[name=probenZusatzs]').getStore().load({
            params: params
        });
    },

    populateIntervall: function(record, intervall) {
        //intervall is an identifier of a intervall
        // for instance H, M, J, ...
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
            svalUpper = record.get('teilintervallBis');
            svalLower = record.get('teilintervallVon');
            this.down('dayofyear[name=gueltigBis]').setReadOnly(true);
            this.down('dayofyear[name=gueltigVon]').setReadOnly(true);
        } else {
            b.setReadOnly(false);
            v.setReadOnly(false);
            this.down('dayofyear[name=gueltigBis]').setReadOnly(false);
            this.down('dayofyear[name=gueltigVon]').setReadOnly(false);
        }

        var intrec = intervallstore
            .findRecord('probenintervall',
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
        this.down('button[action=copy]').setDisabled(
            messRecord.get('readonly'));
        this.clearMessages();

        // Add probenZusatzs as an array of model instances to the record.
        // This is necessary, because loadRecord() calls setValue() on
        // matching fields internally and that won't work for the matching
        // tagfield if probenZusatzs is just an array of ordinary objects
        // (such as returned by `messRecord.getData(true)') or just
        // internally available as associated data.
        // Note that setting the value directly at the tagfield, e.g. using
        // setValue(), is not an option because that prevents any
        // dirtychange events from occurring once any value has been chosen
        // in the tagfield.
        messRecord.set(
            'probenZusatzs', messRecord.probenZusatzs().getRange());
        this.getForm().loadRecord(messRecord);

        this.populateIntervall(messRecord);

        this.filterProbenZusatzs(messRecord.get('umwId'));
    },

    setMediaDesk: function(record) {
        this.setMediaDeskImpl(
            Lada.view.form.Messprogramm.mediaSnScheduler,
            record
        );
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
                for (var j = 0; j < content.length; j++) {
                    errorText += i18n.getMsg(content[j].toString()) + '\n';
                }
                element.showErrors(errorText);
            }
        }
    },

    clearMessages: function() {
        this.down('cbox[name=mstlabor]').clearWarningOrError();
        //no clearmsg for probeKommentar
        this.down('cbox[name=datenbasisId]').clearWarningOrError();
        this.down('cbox[name=reiProgpunktGrpId]').clearWarningOrError();
        this.down('cbox[name=ktaGruppeId]').clearWarningOrError();
        this.down('cbox[name=baId]').clearWarningOrError();
        this.down('chkbox[name=test]').clearWarningOrError();
        this.down('chkbox[name=aktiv]').clearWarningOrError();
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
        this.down('cbox[name=mehId]').clearWarningOrError();
    },

    setReadOnly: function(value) {
        this.down('cbox[name=mstlabor]').setReadOnly(value);
        this.down('cbox[name=datenbasisId]').setReadOnly(value);
        this.down('cbox[name=reiProgpunktGrpId]').setReadOnly(value);
        this.down('cbox[name=ktaGruppeId]').setReadOnly(value);
        this.down('cbox[name=baId]').setReadOnly(value);
        this.down('chkbox[name=test]').setReadOnly(value);
        this.down('chkbox[name=aktiv]').setReadOnly(value);
        this.down('cbox[name=probenartId]').setReadOnly(value);
        //         this.down('netzbetreiber').setReadOnly(value);
        this.down('cbox[name=probenintervall]').setReadOnly(value);
        this.down('numfield[name=teilintervallVon]').setReadOnly(value);
        this.down('numfield[name=teilintervallBis]').setReadOnly(value);
        this.down('numfield[name=intervallOffset]').setReadOnly(value);
        this.down('dayofyear[name=gueltigVon]').setReadOnly(value);
        this.down('dayofyear[name=gueltigBis]').setReadOnly(value);
        this.down('cbox[name=umwId]').setReadOnly(value);
        this.down('cbox[name=mehId]').setReadOnly(value);
        this.down('cbox[name=probeNehmerId]').setReadOnly(value);
        this.down('messprogrammland[name=mplId]').setReadOnly(value);
        this.down('tagfield[name=probenZusatzs]').setReadOnly(value);
        for (var i = 0; i < 12; i++) {
            this.down('deskriptor[layer=' + i + ']').setReadOnly(value);
        }
    }
});
