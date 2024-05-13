/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Formular to edit a Tag
 */
Ext.define('Lada.view.form.Tag', {
    extend: 'Lada.view.form.LadaForm',
    alias: 'widget.tagform',
    requires: [
        'Lada.controller.form.Tag',
        'Lada.view.widget.base.DateTimeField'
    ],
    controller: 'tagform',

    trackResetOnLoad: true,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.items = [{
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    xtype: 'button',
                    text: i18n.getMsg('save'),
                    action: 'save',
                    margin: '5 5 5 5',
                    disabled: true
                }, {
                    xtype: 'button',
                    action: 'delete',
                    text: i18n.getMsg('delete'),
                    margin: '5 5 5 5',
                    disabled: true
                }, {
                    xtype: 'button',
                    text: i18n.getMsg('cancel'),
                    margin: '5 5 5 5',
                    handler: function() {
                        me.up('window').close();
                    }
                }]

            }],
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '5,5,5,5',
                labelWidth: 80,
                minWidth: 300
            },
            items: [{
                name: 'name',
                xtype: 'tfield',
                fieldLabel: i18n.getMsg('name'),
                allowBlank: false
            }, {
                name: 'measFacilId',
                xtype: 'messstelle',
                fieldLabel: i18n.getMsg('meas_facil_id'),
                filteredStore: true
            }, {
                name: 'networkId',
                xtype: 'netzbetreiber',
                fieldLabel: i18n.getMsg('netzbetreiberId'),
                filteredStore: true
            }, {
                name: 'tagType',
                xtype: 'tagtyp',
                fieldLabel: i18n.getMsg('tagtyp'),
                allowBlank: false,
                filteredStore: true,
                listenersJson: {
                    select: {
                        fn: function(combo, newValue) {
                            var tagtyp = newValue.get('value');
                            if (tagtyp === 'mst') {
                                if (combo.up('tagform').down('datefield[name=valUntil]').getValue() !== null) {
                                    var dateToday = moment(new Date(), 'DD-MM-YYYY');
                                    var dateFieldValue = moment(combo.up('tagform').down('datefield[name=valUntil]')
                                        .getValue(), 'DD-MM-YYYY');
                                    if (dateFieldValue.diff(dateToday, 'days') < i18n.getMsg('tag.defaultValue.gueltigBis')) {
                                        combo.up('tagform').down('datefield[name=valUntil]')
                                            .setValue(moment().add(i18n.getMsg('tag.defaultValue.gueltigBis'), 'days'));
                                    }
                                } else {
                                    combo.up('tagform').down(
                                    'datefield[name=valUntil]')
                                    .setValue(moment().add(i18n.getMsg('tag.defaultValue.gueltigBis'), 'days'));
                                }
                            }
                            if (tagtyp === 'netz' &&
                                combo.up('tagform').down('datefield[name=valUntil]').getValue() !== null) {
                                combo.up('tagform').down('datefield[name=valUntil]').setValue();
                            }
                        }
                    }
                }
            }, {
                name: 'valUntil',
                xtype: 'datetimefield',
                fieldLabel: i18n.getMsg('tag.gueltigBis')
            }]
        }];
        this.callParent(arguments);
    },

    setRecord: function(tagRecord) {
        this.getForm().loadRecord(tagRecord);
        this.setReadOnly(this.getRecord().get('readonly'));
    }
});
