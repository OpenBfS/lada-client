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
                            xtype: 'messstellelaborkombi',
                            name: 'mstlabor',
                            fieldLabel: i18n.getMsg('labor_mst_id'),
                            margin: '0, 5, 5, 5',
                            width: '50%',
                            labelWidth: 100,
                            allowBlank: false,
                            editable: true,
                            listenersJson: {
                                select: {
                                    fn: function(combo, newValue) {
                                        var mst = newValue.get('messStelle');
                                        var labor = newValue.get('laborMst');
                                        combo.up('fieldset')
                                            .down('messstelle[name=mstId]')
                                            .setValue(mst);
                                        combo.up('fieldset')
                                            .down('messstelle[name=laborMstId]')
                                            .setValue(labor);
                                        combo.up('fieldset')
                                            .down(
                                                'messprogrammland[name=mplId]')
                                            .setValue();
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
                            width: '50%',
                            labelWidth: 80
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
                    title: i18n.getMsg('zusatzwertFieldset'),
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
                        labelTpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">{id} - {beschreibung}</tpl>')
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
        var me = this;
        var pzStore = me.down('tagfield[name=probenZusatzs]').store;
        //Filter ProbenZusatzs
        pzStore.load({
            params: {
                'umwId': umwId
            }
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
                return i.setMaxValue(max-1);
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
            'probenZusatzs', messRecord.probenZusatzs().getData().items);
        this.getForm().loadRecord(messRecord);
        if (!messRecord.data || messRecord.data.id === null) {
            return;
        }

        this.populateIntervall(messRecord);

        this.filterProbenZusatzs(messRecord.get('umwId'));

        var mstStore = Ext.data.StoreManager.get('messstellen');
        var mstId = mstStore.getById(messRecord.get('mstId'));
        var netzId = mstId.get('netzbetreiberId');
        var mstLaborKombiStore = Ext.data.StoreManager.get(
            'messstellelaborkombi');
        if (!messRecord.get('owner')) {
            var laborMstId = mstStore.getById(messRecord.get('laborMstId'));
            if (laborMstId) {
                laborMstId = laborMstId.get('messStelle');
            } else {
                laborMstId = '';
            }
            var displayCombi;
            if ( messRecord.get('mstId') === messRecord.get('laborMstId') ) {
                displayCombi = mstId.get('messStelle');
            } else {
                displayCombi = mstId.get('messStelle') + '/' + laborMstId;
            }

            mstLaborKombiStore.clearFilter(true);
            var recordIndex = mstLaborKombiStore.findExact(
                'displayCombi', displayCombi);

            mstLaborKombiStore.filter({
                property: 'netzbetreiberId',
                anyMatch: true,
                value: netzId,
                caseSensitive: false
            });
            if (recordIndex === -1) {
                var newStore = Ext.create('Ext.data.Store', {
                    model: 'Lada.model.MessstelleLabor',
                    data: [{
                        id: 1,
                        laborMst: messRecord.get('laborMstId'),
                        messStelle: messRecord.get('mstId'),
                        displayCombi: displayCombi
                    }]
                });
                this.down('messstellelaborkombi').setStore(newStore);
                this.down('messstellelaborkombi').down('combobox').setValue(1);
                this.down('messstellelaborkombi').down('combobox')
                    .resetOriginalValue();
            } else {
                this.down('messstellelaborkombi').setStore(mstLaborKombiStore);
                this.down('messstellelaborkombi').down('combobox')
                    .setValue(recordIndex);
                this.down('messstellelaborkombi').down('combobox')
                    .resetOriginalValue();
            }
        } else {
            var availableitems = mstLaborKombiStore.queryBy(function(record) {
                if (record.get('messStelle') === messRecord.get('mstId') &&
                    record.get('laborMst') === messRecord.get('laborMstId')) {
                    return true;
                }
            });
            var newStore2 = Ext.create('Ext.data.Store', {
                model: 'Lada.model.MessstelleLabor',
                data: availableitems.items});
            this.down('messstellelaborkombi').setStore(newStore2);
            this.down('messstellelaborkombi').setValue(
                messRecord.get('messstellelabor'));
            this.down('messstellelaborkombi').down('combobox')
                .resetOriginalValue();
        }
        this.down('netzbetreiber').setValue(mstId.get('netzbetreiberId'));
        this.down('netzbetreiber').down('combobox').resetOriginalValue();
    },

    setMediaDesk: function(record) {
        var media = record.get('mediaDesk');
        if (media) {
            var mediaParts = media.split(' ');
            Lada.view.form.Messprogramm.mediaSnScheduler.enqueue(
                this.setMediaSN, [0, mediaParts], this);
        } else {
            Lada.view.form.Messprogramm.mediaSnScheduler.enqueue(
                this.setMediaSN, [0, '0'], this);
        }
        Lada.view.form.Messprogramm.mediaSnScheduler.next();
    },

    setMediaSN: function(ndx, media, beschreibung) {
        var mediabeschreibung = this.getForm().findField('media');
        if (ndx >= 12) {
            Lada.view.form.Messprogramm.mediaSnScheduler.finished();
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
                Lada.view.form.Messprogramm.mediaSnScheduler.finished();
                return;
            }
            cbox.store.proxy.extraParams.parents = parents;
        }
        cbox.store.load(function(records, op, success) {
            if (!success) {
                Lada.view.form.Messprogramm.mediaSnScheduler.finished();
                return;
            }
            try {
                cbox.select(
                    cbox.store.findRecord('sn', parseInt(media[ndx + 1], 10), 0, false, false, true));
            } catch (e) {
                Ext.log({msg: 'Selecting media failed: ' + e, level: 'warn'});
                Lada.view.form.Messprogramm.mediaSnScheduler.finished();
                return;
            }
            var mediatext = cbox.store.findRecord(
                'sn', parseInt(media[ndx + 1], 10), 0, false, false, true);
            if (mediatext !== null) {
                if (
                    (ndx <= 3) &&
                    (media[1] === '01') &&
                    (mediatext.data.beschreibung !== 'leer')
                ) {
                    beschreibung = mediatext.data.beschreibung;
                } else if (
                    (media[1] !== '01') &&
                    (mediatext.data.beschreibung !== 'leer') &&
                    (ndx <= 1)
                ) {
                    beschreibung = mediatext.data.beschreibung;
                }
            }
            var nextNdx = ++ndx;
            Lada.view.form.Messprogramm.mediaSnScheduler.enqueue(
                me.setMediaSN, [nextNdx, media, beschreibung], me);
            Lada.view.form.Messprogramm.mediaSnScheduler.finished();
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
                for (var j = 0; j < content.length; j++) {
                    errorText += i18n.getMsg(content[j].toString()) + '\n';
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
