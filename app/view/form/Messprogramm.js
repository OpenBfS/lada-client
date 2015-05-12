/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to edit a Messprogramm
 */
Ext.define('Lada.view.form.Messprogramm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.messprogrammform',
    requires: [
        'Lada.view.widget.Datenbasis',
        'Lada.view.widget.Messstelle',
        'Lada.view.widget.Netzbetreiber',
        'Lada.view.widget.Betriebsart',
        'Lada.view.widget.Testdatensatz',
        'Lada.view.widget.Probenart',
        'Lada.view.widget.Umwelt',
        'Lada.view.widget.base.TextField',
        'Lada.view.widget.base.FieldSet',
        'Lada.model.Messprogramm',
        'Lada.model.MmtMessprogramm',
        'Lada.view.widget.Probenintervall',
        'Lada.view.widget.ProbenintervallSlider',
        'Lada.view.widget.base.Datetime',
        'Lada.view.widget.base.DateField'
    ],

    model: 'Lada.model.Messprogramm',
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
                    layout: 'hbox',
                    border: 0,
                    items: [{
                        border: 0,
                        width: '50%',
                        minWidth: 290,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        margin: '0, 10, 0, 0',
                        items: [{
                            xtype: 'messstelle',
                            name: 'mstId',
                            fieldLabel: i18n.getMsg('mstId'),
                            labelWidth: 135,
                            allowBlank: false,
                            editable: true
                        }, {
                            xtype: 'tfield',
                            name: 'name',
                            fieldLabel: i18n.getMsg('name'),
                            labelWidth: 135,
                            allowBlank: false,
                            editable: true
                        }, {
                             xtype: 'textarea', //todo: we need a widget which is capable of handling errormsg.
                            name: 'probeKommentar',
                            labelAlign: 'top',
                            fieldLabel: i18n.getMsg('probeKommentar'),
                            labelwidth: 135,
                            anchor: '100%'
                        }]
                    }, {
                        border: 0,
                        width: '50%',
                        minWidth: 300,
                        margin: '0, 1, 0, 0',
                        items: [{
                            xtype: 'fset',
                            title: i18n.getMsg('erwAngaben'),
                            name: 'erwAngaben',
                            collapsible: false,
                            collapsed: false,
                            items: [{
                                xtype: 'datenbasis',
                                editable: false,
                                name: 'datenbasisId',
                                fieldLabel: i18n.getMsg('datenbasisId'),
                                anchor: '100%',
                                labelWidth: 105
                            }, {
                                xtype: 'betriebsart',
                                name: 'baId',
                                fieldLabel: i18n.getMsg('baId'),
                                anchor: '100%',
                                labelWidth: 105
                            }, {
                                xtype: 'testdatensatz',
                                name: 'test',
                                fieldLabel: i18n.getMsg('test'),
                                anchor: '100%',
                                labelWidth: 105,
                                allowBlank: false
                            }, {
                                xtype: 'probenart',
                                editable: false,
                                name: 'probenartId',
                                fieldLabel: i18n.getMsg('probenartId'),
                                anchor: '100%',
                                labelWidth: 105,
                                allowBlank: false
                            }, {
                                xtype: 'numberfield',
                                allowDecimals: false,
                                name: 'probeNehmerId',
                                fieldLabel: i18n.getMsg('probeNehmerId'),
                                anchor: '100%',
                                labelWidth: 105
                            }, {
                                xtype: 'netzbetreiber',
                                name: 'netzbetreiberId',
                                editable: false,
                                fieldLabel: i18n.getMsg('netzbetreiberId'),
                                anchor: '100%',
                                labelWidth: 105,
                                allowBlank: false
                           }]
                        }]
                    }]
                }, {
                    // Medium
                    xtype: 'fieldset',
                    title: i18n.getMsg('medium'),
                    items: [{
                        border: 0,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        width: '100%',
                        items: [{
                           xtype: 'textfield',
                            maxLength: 38,
                            enforceMaxLength: true,
                            name: 'mediaDesk',
                            labelWidth: 125,
                            fieldLabel: i18n.getMsg('mediaDesk'),
                            regex: new RegExp('(?:D: ){1}(?:[0-9]{2} ){11}[0-9]{2}'),
                            regexText: i18n.getMsg('err.msg.deskriptorvalidation'),
                            listeners: {
                                dirtychange: {
                                    fn: this.updateOnChange,
                                    scope: me
                                }
                            }
                        }, {
                            xtype: 'umwelt',
                            name: 'umwId',
                            fieldLabel: i18n.getMsg('umwId'),
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
                            xtype: 'fieldset',
                            title: i18n.getMsg('deskDetails'),
                            collapsible: true,
                            collapsed: true,
                            defaultType: 'textfield',
                            layout: {
                                type: 'table',
                                columns: 3
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
                    // Zeit
                    xtype: 'fieldset',
                    title: i18n.getMsg('time'),
                    layout: {
                        type: 'hbox',
                        pack: 'center',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'fset',
                        title: i18n.getMsg('validity'),
                        name: 'gueltigPeriodFieldset',
                        anchor: '100%',
                        width: '50%',
                        margin: '0, 5, 5, 5',
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        items: [{
                            xtype: 'datetime',
                            fieldLabel: i18n.getMsg('gueltigVon'),
                            labelWidth: 90,
                            anchor: '100%',
                            name: 'gueltigVon',
                            format: 'd.m.Y H:i',
                            period: 'start'
                        }, {
                            xtype: 'datetime',
                            fieldLabel: i18n.getMsg('gueltigBis'),
                            labelWidth: 90,
                            anchor: '100%',
                            name: 'gueltigBis',
                            format: 'd.m.Y H:i',
                            period: 'end'
                        }, {
                            xtype: 'numberfield',
                            fieldLabel: i18n.getMsg('offset'),
                            labelWidth: 90,
                            anchor: '100%',
                            name: 'intervallOffset',
                        }]
                    }, {
                        xtype: 'fset',
                        title: i18n.getMsg('probenintervall'),
                        name: 'probenIntervallFieldset',
                        anchor: '100%',
                        width: '50%',
                        margin: '0, 5, 5, 5',
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        items: [{
                            xtype: 'probenintervall',
                            fieldLabel: i18n.getMsg('probenintervall'),
                            labelWidth: 90,
                            anchor: '100%',
                            name: 'probenintervall'
                        }, {
                            xtype: 'numberfield',
                            fieldLabel: i18n.getMsg('teilintervallVon'),
                            labelWidth: 90,
                            anchor: '100%',
                            name: 'teilintervallVon',
                            period: 'start'
                        }, {
                            xtype: 'numberfield',
                            fieldLabel: i18n.getMsg('teilintervallBis'),
                            labelWidth: 90,
                            anchor: '100%',
                            name: 'teilintervallBis',
                            period: 'end'
                        }, {
                            xtype: 'probenintervallslider',
                            fieldLabel: i18n.getMsg('intervall'),
                            labelWidth: 90,
                            anchor: '100%',
                            values: [0, 0],
                                //this will be overridden
                                // by setRecord
                        }]
                    }]
                }]
            }]
        }];
        this.callParent(arguments);
    },

    populateIntervall: function(record, intervall) {
        console.log('Populate Start');
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

        console.log('Populate End');
    },

    setRecord: function(record) {
        this.clearMessages();
        this.getForm().loadRecord(record);
        //Set the intervall numberfields and the slider.
        this.down('probenintervallslider').setValue([
            record.get('teilintervallVon'),
            record.get('teilintervallBis')
        ]);

        //TODO Set Sliders MinMaxValue

        this.down('probenintervallslider').on(
            'change',
            Lada.app.getController('Lada.controller.form.Messprogramm')
                .synchronizeFields
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
                for (var i = 0; i < content.length; i++) {
                    errorText += i18n.getMsg(content[i].toString()) + '\n';
                }
                element.showErrors(errorText);
            }
        }
    },

    clearMessages: function() {
        // TODO
        this.down('cbox[name=mstId]').clearWarningOrError();
        this.down('tfield[name=name]').clearWarningOrError();
        //no clearmsg for probeKommentar
        this.down('fset[name=erwAngaben]').clearMessages();
        this.down('cbox[name=datenbasisId]').clearWarningOrError();
        this.down('cbox[name=baId]').clearWarningOrError();
        this.down('cbox[name=test]').clearWarningOrError();
        this.down('cbox[name=probenartId]').clearWarningOrError();
        this.down('cbox[name=netzbetreiberId]').clearWarningOrError();
        //no clear for probeNehmerId
        // Deskriptoren are missing
        this.down('cbox[name=umwId]').clearWarningOrError();
        this.down('fset[name=gueltigPeriodFieldset]').clearMessages();
        this.down('fset[name=probenIntervallFieldset]').clearMessages();
    },

    setReadOnly: function(value) {
        // TODO
    },

    buildDescriptors: function() {
        var fields = [];
        for (var i = 0; i < 12; i++) {
            fields[i] = {
                fieldLabel: 'S' + i,
                name: 's' + i,
                labelWidth: 25,
                margin: '0, 10, 5, 0'
            };
        }
        return fields;
    }
});
