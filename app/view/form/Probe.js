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
        'Lada.view.widget.ReiProgpunktGruppe',
        'Lada.view.widget.KtaGruppe',
        'Lada.view.widget.Umwelt',
        'Lada.view.widget.Deskriptor',
        'Lada.view.widget.Tag',
        'Lada.view.widget.base.TextField',
        'Lada.view.widget.base.Datetime',
        'Lada.view.widget.base.FieldSet',
        'Lada.view.widget.base.DateField',
        'Lada.view.window.MessungCreate',
        'Lada.view.window.TagCreate',
        'Lada.model.Probe',
        'Lada.model.MessstelleLabor'
    ],

    model: 'Lada.model.Probe',
    minWidth: 650,
    margin: 5,
    border: false,

    readOnly: false,

    recordId: null,

    trackResetOnLoad: true,

    statics: {
        mediaSnScheduler: null
    },

    initComponent: function() {
        if (Lada.view.form.Probe.mediaSnScheduler === null) {
            Lada.view.form.Probe.mediaSnScheduler = Ext.create('Lada.util.FunctionScheduler');
        }
        var me = this;
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
                    },'->', {
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
                            name: 'externeProbeId',
                            fieldLabel: i18n.getMsg('extProbeId'),
                            margin: '0, 5, 5, 5',
                            labelWidth: 45,
                            maxLength: 16,
                            width: '32%'
                        }, {
                            xtype: 'selectabledisplayfield',
                            name: 'mprId',
                            fieldLabel: i18n.getMsg('mprId'),
                            margin: '0, 5, 5, 5',
                            labelWidth: 55,
                            maxLength: 20,
                            width: '22%'
                        }, {
                            xtype: 'chkbox',
                            name: 'test',
                            fieldLabel: 'Test',
                            margin: '0, 5, 5, 5',
                            width: '16%',
                            labelWidth: 30
                        }, {
                            xtype: 'datenbasis',
                            editable: false,
                            allowBlank: false,
                            name: 'datenbasisId',
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
                                        combo.up('fieldset').down('messstelle[name=mstId]').setValue(mst);
                                        combo.up('fieldset').down('messstelle[name=laborMstId]').setValue(labor);
                                        combo.up('fieldset').down('messprogrammland[name=mplId]').setValue();
                                    }
                                }
                            }
                        }, {
                            xtype: 'messstelle',
                            name: 'mstId',
                            fieldLabel: i18n.getMsg('labor_mst_id'),
                            margin: '0, 5, 5, 5',
                            width: '35%',
                            labelWidth: 95,
                            allowBlank: false,
                            editable: true,
                            hidden: true
                        }, {
                            xtype: 'messstelle',
                            name: 'laborMstId',
                            fieldLabel: i18n.getMsg('labor_mst_id'),
                            margin: '0, 5, 5, 5',
                            width: '35%',
                            labelWidth: 95,
                            allowBlank: false,
                            editable: true,
                            hidden: true
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
                            allowBlank: false,
                            labelWidth: 80
                        }, {
                            xtype: 'probenart',
                            //editable: true,
                            name: 'probenartId',
                            fieldLabel: 'Probenart',
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
                            name: 'probeNehmerId',
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
                                            var nId = combo.up('fieldset')
                                                .down('netzbetreiber[name=netzbetreiber]')
                                                .getValue();
                                            if (!nId || nId.length === 0) {
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
                                    }
                                });
                            }
                        }, {
                            xtype: 'datensatzerzeuger',
                            name: 'erzeugerId',
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
                                            var nId = combo.up('fieldset')
                                                .down('netzbetreiber[name=netzbetreiber]')
                                                .getValue();
                                            if (!nId || nId.length === 0) {
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
                                    }
                                });
                            }
                        }]
                    },{
                        xtype: 'messprogrammland',
                        name: 'mplId',
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
                                        var nId = combo.up('fieldset')
                                            .down('netzbetreiber[name=netzbetreiber]')
                                            .getValue();
                                        if (!nId || nId.length === 0) {
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
                            name: 'reiProgpunktGrpId',
                            fieldLabel: i18n.getMsg('reiProgpunktGrpId'),
                            margin: '0 5 5 5',
                            allowBlank: true,
                            editable: true,
                            hidden: true
                        }, {
                            xtype: 'ktagruppe',
                            width: '50%',
                            labelWidth: 140,
                            name: 'ktaGruppeId',
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
                            xtype: 'datefield',
                            emptyText: ' ',
                            fieldLabel: i18n.getMsg('sollVon'),
                            labelWidth: 130,
                            margin: '0, 5, 5, 5',
                            name: 'solldatumBeginn',
                            format: 'd.m.Y',
                            formatText: '',
                            width: '50%',
                            period: 'start',
                            readOnly: true
                        }, {
                            xtype: 'datefield',
                            emptyText: ' ',
                            fieldLabel: i18n.getMsg('sollBis'),
                            labelWidth: 17,
                            margin: '0, 5, 5, 5',
                            name: 'solldatumEnde',
                            format: 'd.m.Y',
                            formatText: '',
                            width: '50%',
                            period: 'end',
                            readOnly: true
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
                            name: 'probeentnahmeBeginn',
                            format: 'd.m.Y H:i',
                            width: '50%',
                            period: 'start'
                        }, {
                            xtype: 'datetime',
                            fieldLabel: i18n.getMsg('probenentnahmeBis'),
                            labelWidth: 17,
                            margin: '0, 5, 5, 5',
                            name: 'probeentnahmeEnde',
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
                            name: 'ursprungszeit',
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
                            name: 'umwId',
                            fieldLabel: 'Umweltbereich',
                            labelWidth: 100,
                            allowBlank: true,
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
                                margin: '0 5 0 0',
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
                                margin: '0 0 0 5',
                                name: 'media',
                                width: '42%',
                                enforceMaxLength: true,
                                editable: false,
                                readOnly: true
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
                }, {
                    //Tag widget
                    xtype: 'fieldset',
                    title: i18n.getMsg('title.tagfieldset'),
                    name: 'tagfieldset',
                    layout: {
                        type: 'hbox',
                        align: 'stretchmax'
                    },
                    items: [{
                        flex: 1,
                        xtype: 'tagwidget',
                        emptyText: i18n.getMsg('emptytext.tag'),
                        parentWindow: this,
                        maskTargetComponentType: 'fieldset',
                        maskTargetComponentName: 'tagfieldset',
                        margin: '5 5 5 5'
                    }, {
                        width: 25,
                        height: 25,
                        xtype: 'button',
                        margin: '5 5 5 0',
                        action: 'createtag',
                        icon: 'resources/img/list-add.png',
                        tooltip: i18n.getMsg('button.createtag.tooltip'),
                        handler: function(button) {
                            var win = Ext.create('Lada.view.window.TagCreate', {
                                tagWidget: me.down('tagwidget'),
                                probe: button.up('probeform').getForm().getRecord().get('hauptprobenNr'),
                                recordType: 'probe'
                            });
                            //Close window if parent window is closed
                            var parentWindow = button.up('probenedit')? button.up('probenedit'): button.up('probecreate');
                            parentWindow.on('close', function() {
                                win.close();
                            });
                            win.show();
                        }
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
        var mstStore = Ext.data.StoreManager.get('messstellen');
        var mstId = mstStore.getById(probeRecord.get('mstId'));
        if (!probeRecord.get('owner')) {
            var laborMstId = mstStore.getById(probeRecord.get('laborMstId'));
            if (laborMstId) {
                laborMstId = laborMstId.get('messStelle');
            } else {
                laborMstId = '';
            }
            var id = this.down('messstellelabor').store.count() + 1;
            var displayCombi;
            if ( mstId.get('messStelle') === laborMstId ) {
                displayCombi = mstId.get('messStelle');
            } else {
                displayCombi = mstId.get('messStelle') + '/' + laborMstId;
            }

            var rec = Ext.create('Lada.model.MessstelleLabor', {
                id: id,
                laborMst: probeRecord.get('laborMstId'),
                messStelle: probeRecord.get('mstId'),
                displayCombi: displayCombi
            });
            var newStore = Ext.create('Ext.data.Store', {
                model: 'Lada.model.MessstelleLabor',
                data: rec
            });
            this.down('messstellelabor').down('combobox').store = newStore;
            this.down('messstellelabor').setValue(rec);
        } else {
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
        //Do not set tagwidget probe id if record is not saved
        if (probeRecord.phantom === false) {
            this.down('tagwidget').setProbe(probeRecord.data.id);
        }
    },

    setMediaDesk: function(record) {
        var media = record.get('mediaDesk');
        if (media) {
            var mediaParts = media.split(' ');
            Lada.view.form.Probe.mediaSnScheduler.enqueue(
                this.setMediaSN, [0, mediaParts], this);
        } else {
            Lada.view.form.Probe.mediaSnScheduler.enqueue(
                this.setMediaSN, [0, '0'], this);
        }
        Lada.view.form.Probe.mediaSnScheduler.next();
    },

    setMediaSN: function(ndx, media, beschreibung) {
        var mediabeschreibung = this.getForm().findField('media');
        if (ndx >= 12) {
            Lada.view.form.Probe.mediaSnScheduler.finished();
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
                Lada.view.form.Probe.mediaSnScheduler.finished();
                return;
            }
            cbox.store.proxy.extraParams.parents = parents;
        }
        cbox.store.load(function(records, op, success) {
            if (!success) {
                Lada.view.form.Probe.mediaSnScheduler.finished();
                return;
            }
            try {
                cbox.select(cbox.store.findRecord('sn', parseInt(media[ndx + 1], 10)));
            } catch (e) {
                Ext.log({msg: 'Selecting media failed: ' + e, level: 'warn'});
                return;
            }
            var mediatext = cbox.store.findRecord('sn', parseInt(media[ndx + 1], 10));
            if (mediatext !== null) {
                if ( (ndx <= 3) && (media[1] === '01') && (mediatext.data.beschreibung !== 'leer') ) {
                    beschreibung = mediatext.data.beschreibung;
                } else if ( (media[1] !== '01') && (mediatext.data.beschreibung !== 'leer') && (ndx <= 1) ) {
                    beschreibung = mediatext.data.beschreibung;
                }
            }
            var nextNdx = ++ndx;
            Lada.view.form.Probe.mediaSnScheduler.enqueue(me.setMediaSN, [nextNdx, media, beschreibung], me);
            Lada.view.form.Probe.mediaSnScheduler.finished();
        });
    },

    setMessages: function(errors, warnings, notifications) {
        var key;
        var element;
        var content;
        var tmp;
        var i18n = Lada.getApplication().bundle;
        if (warnings) {
            for (key in warnings) {
                tmp = key;
                if (tmp.indexOf('#') > 0) {
                    tmp = tmp.split('#')[0];
                }
                element = this.down('component[name=' + tmp + ']');
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
        if (notifications) {
            for (key in notifications) {
                tmp = key;
                if (tmp.indexOf('#') > 0) {
                    tmp = tmp.split('#')[0];
                }
                element = this.down('component[name=' + tmp + ']');
                if (!element) {
                    continue;
                }
                content = notifications[key];
                var notificationsText = '';
                for (var j = 0; j < content.length; j++) {
                    notificationsText += i18n.getMsg(content[j].toString()) + '\n';
                }
                element.showNotifications(notificationsText);
            }
        }
        if (errors) {
            for (key in errors) {
                tmp = key;
                if (tmp.indexOf('#') > 0) {
                    tmp = tmp.split('#')[0];
                }
                element = this.down('component[name=' + tmp + ']');
                if (!element) {
                    continue;
                }
                content = errors[key];
                var errorText = '';
                for (var k = 0; k < content.length; k++) {
                    errorText += i18n.getMsg(content[k].toString()) + '\n';
                }
                element.showErrors(errorText);
            }
        }
    },

    clearMessages: function() {
        this.down('cbox[name=mstlabor]').clearWarningOrError();
        this.down('tfield[name=hauptprobenNr]').clearWarningOrError();
        this.down('cbox[name=reiProgpunktGrpId]').clearWarningOrError();
        this.down('cbox[name=ktaGruppeId]').clearWarningOrError();
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
        this.down('tfield[name=mediaDesk]').clearWarningOrError();
        this.down('fset[name=deskriptordetails]').clearMessages();
        this.down('fset[name=ursprung]').clearMessages();
        //Deskriptoren
        for (var i = 0; i < 12; i++) {
            this.down('deskriptor[layer='+i+']').clearWarningOrError();
        }
    },

    setReadOnly: function(value) {
        this.readOnly = value;
        this.down('cbox[name=mstlabor]').setReadOnly(value);
        this.down('tfield[name=hauptprobenNr]').setReadOnly(value);
        this.down('cbox[name=reiProgpunktGrpId]').setReadOnly(value);
        this.down('cbox[name=ktaGruppeId]').setReadOnly(value);
        this.down('cbox[name=datenbasisId]').setReadOnly(value);
        this.down('cbox[name=baId]').setReadOnly(value);
        this.down('chkbox[name=test]').setReadOnly(value);
        this.down('cbox[name=probenartId]').setReadOnly(value);
        this.down('cbox[name=erzeugerId]').setReadOnly(value);
        this.down('cbox[name=umwId]').setReadOnly(value);
        this.down('datetime[name=probeentnahmeBeginn]').setReadOnly(value);
        this.down('datetime[name=probeentnahmeEnde]').setReadOnly(value);
        this.down('datetime[name=ursprungszeit]').setReadOnly(value);
        this.down('cbox[name=probeNehmerId]').setReadOnly(value);
        this.down('cbox[name=mplId]').setReadOnly(value);
        this.readOnly = value;

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
                name: 's' + i,
                labelWidth: 25,
                width: 190,
                layer: i,
                margin: '0, 10, 5, 0'
            };
        }
        return fields;
    }
});
