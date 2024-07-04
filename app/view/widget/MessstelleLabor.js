/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Container for combobox for Messstelle/Labor, setting hidden form fields
 * and Netzbetreiber automatically.
 */
Ext.define('Lada.view.widget.MessstelleLabor', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.messstellelabor',
    requires: [
        'Lada.store.MessstellenKombi',
        'Lada.view.widget.base.ComboBox',
        'Lada.view.widget.base.SelectableDisplayField'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    defaults: {
        flex: 1,
        margin: '0, 5, 5, 5'
    },

    config: {
        /**
         * Filter combobox's MessstellenKombi store on focus to reduce entries
         * in select list.
         * Passed to Ext.data.Store.setFilters().
         */
        focusFilters: null
    },

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.items = [{
            // Combobox for selection of Messstelle/Labor combination
            xtype: 'cbox',
            name: this.name,
            store: Ext.create('Lada.store.MessstellenKombi', {
                // autoLoad in case no record is loaded into outer form
                autoLoad: true
            }),
            allowBlank: false,
            isFormField: false,
            fieldLabel: i18n.getMsg('appr_lab_id'),
            labelWidth: 100,

            // Enable filtering of combobox
            autoSelect: true,
            queryMode: 'local',
            triggerAction: 'all',
            typeAhead: false,
            minChars: 0,
            editable: true,
            forceSelection: true,
            valueField: 'id',
            displayField: 'displayCombi',
            emptyText: i18n.getMsg('emptytext.messstellelabor'),

            listenersJson: {
                focus: {
                    fn: function(combo) {
                        var store = combo.getStore();
                        store.setFilters(me.focusFilters);
                        // Do not show duplicate displayCombi values associated
                        // with different ldapGroups
                        store.filterBy(function(record) {
                            return store.findBy(function(rec, id) {
                                return record.get('displayCombi')
                                    === rec.get('displayCombi')
                                    && record.get('id') > id;
                            }) < 0;
                        });
                    }
                },
                // On selection, set other fields in container and assorted
                // other fields, if available in outer fieldset.
                select: {
                    fn: function(combo, newValue) {
                        var container = combo.up('fieldcontainer');

                        // Set hidden form fields
                        ['measFacilId', 'apprLabId'].forEach(function(id) {
                            var field = container.down(
                                'textfield[name=' + id + ']');
                            field.setValue(newValue.get(id));
                        });

                        // Set Netzbetreiber
                        me.setNetzbetreiber(newValue.get('measFacilId'));

                        // Set related fields, if existent
                        var fieldset = combo.up('fieldset');
                        if (fieldset) {
                            var mplId = fieldset.down(
                                'messprogrammland[name=stateMpgId]');
                            if (mplId) {
                                mplId.setValue();
                            }
                            var erzeugerId = fieldset.down(
                                'datensatzerzeuger[name=datasetCreatorId]');
                            if (erzeugerId) {
                                erzeugerId.setValue();
                            }
                        }
                    }
                }
            }
        }, {
            xtype: 'selectabledisplayfield',
            name: 'netzbetreiber',
            isFormField: false,
            fieldLabel: i18n.getMsg('networkId'),
            labelWidth: 80
        }, {
            xtype: 'form',
            hidden: true,
            items: [{
                // Hidden form field for Messstelle
                xtype: 'textfield',
                name: 'measFacilId',
                allowBlank: false
            }, {
                // Hidden form field for Labor
                xtype: 'textfield',
                name: 'apprLabId',
                allowBlank: false
            }],
            listeners: {
                // Intended to be called when a record is loaded into the form
                validitychange: {
                    fn: function(hiddenForm, isValid) {
                        if (isValid) {
                            var cboxStore = me.down('combobox').getStore();
                            if (cboxStore.isLoaded()) {
                                me.setMessstelleLabor();
                            } else {
                                cboxStore.load(function(records, op, success) {
                                    if (!success) {
                                        Ext.Msg.alert(
                                            i18n.getMsg(
                                                'err.msg.generic.title'),
                                            i18n.getMsg(
                                                'err.msg.generic.body'));
                                    }
                                    me.setMessstelleLabor();
                                });
                            }
                        }
                        me.down('combobox').validate();
                    }
                }
            }
        }];

        this.callParent(arguments);
    },

    getNetworkId: function() {
        var mstId = this.down('textfield[name=measFacilId]').getValue();
        var mst = Ext.data.StoreManager.get('messstellen').getById(mstId);
        return mst.get('networkId');
    },

    setNetzbetreiber: function(mstId) {
        var mst = Ext.data.StoreManager.get('messstellen').getById(mstId);
        var fieldValue = '';
        if (mst) {
            var nbId = mst.get('networkId');

            var nbStore = Ext.data.StoreManager.get('netzbetreiber');
            if (!nbStore) {
                nbStore = Ext.create('Lada.store.Netzbetreiber', {
                    storeId: 'netzbetreiber'
                });
            }
            var nb = nbStore.getById(nbId);
            if (nb) {
                fieldValue = nbId + ' - ' + nb.get('name');
            }
        }
        this.down('field[name=netzbetreiber]').setValue(fieldValue);
    },

    setMessstelleLabor: function() {
        var mstId = this.down('textfield[name=measFacilId]').getValue();
        var laborMstId = this.down('textfield[name=apprLabId]').getValue();

        this.setNetzbetreiber(mstId);

        var cbox = this.down('combobox[name=' + this.name + ']');
        var selection = cbox.getStore().queryBy(
            function(rec) {
                return rec.get('measFacilId') === mstId
                    && rec.get('apprLabId') === laborMstId;
            }).getAt(0);
        cbox.setValue(selection);
    }
});
