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
        'Lada.view.widget.Netzbetreiber',
        'Lada.view.widget.base.ComboBox'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    defaults: {
        flex: 1,
        margin: '0, 5, 5, 5'
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
            fieldLabel: i18n.getMsg('labor_mst_id'),
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

            // On selection, set other fields in container and assorted
            // other fields, if available in outer fieldset.
            listenersJson: {
                select: {
                    fn: function(combo, newValue) {
                        var container = combo.up('fieldcontainer');

                        // Set hidden form fields
                        ['mstId', 'laborMstId'].forEach(function(id) {
                            var field = container.down(
                                'textfield[name=' + id + ']');
                            field.setValue(newValue.get(id));
                        });

                        // Set Netzbetreiber
                        me.setNetzbetreiber(newValue.get('mstId'));

                        // Set related fields, if existent
                        var fieldset = combo.up('fieldset');
                        if (fieldset) {
                            var mplId = fieldset.down(
                                'messprogrammland[name=mplId]');
                            if (mplId) {
                                mplId.setValue();
                            }
                            var erzeugerId = fieldset.down(
                                'datensatzerzeuger[name=erzeugerId]');
                            if (erzeugerId) {
                                erzeugerId.setValue();
                            }
                        }
                    }
                }
            }
        }, {
            xtype: 'netzbetreiber',
            name: 'netzbetreiber',
            readOnly: true,
            isFormField: false,
            fieldLabel: i18n.getMsg('netzbetreiberId'),
            labelWidth: 80
        }, {
            xtype: 'form',
            hidden: true,
            items: [{
                // Hidden form field for Messstelle
                xtype: 'textfield',
                name: 'mstId',
                allowBlank: false
            }, {
                // Hidden form field for Labor
                xtype: 'textfield',
                name: 'laborMstId',
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
                    }
                }
            }
        }];

        this.callParent(arguments);
    },

    setNetzbetreiber: function(mstId) {
        var mst = Ext.data.StoreManager.get('messstellen').getById(mstId);
        var nb = mst ? mst.get('netzbetreiberId') : '';
        this.down('netzbetreiber').setValue(nb);
    },

    setMessstelleLabor: function() {
        var mstId = this.down('textfield[name=mstId]').getValue();
        var laborMstId = this.down('textfield[name=laborMstId]').getValue();

        this.setNetzbetreiber(mstId);

        var cbox = this.down('combobox[name=' + this.name + ']');
        var selection = cbox.getStore().queryBy(
            function(rec) {
                return rec.get('mstId') === mstId
                    && rec.get('laborMstId') === laborMstId;
            }).getAt(0);
        cbox.setValue(selection);
    }
});
