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
    extend: 'Ext.form.Panel',
    alias: 'widget.tagform',
    store: null,

    readOnly: false,
    trackResetOnLoad: true,

    initComponent: function() {
        var store = Ext.data.StoreManager.get('tags');
        if (!store) {
            Ext.create('Lada.store.Tag', {
                storeId: 'tags'
            });
        }
        this.store = Ext.data.StoreManager.get('tags');
        this.store.reload();

        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.items = [{
            xtype: 'fieldset',
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
                name: 'tag',
                xtype: 'tfield',
                fieldLabel: i18n.getMsg('name'),
                allowBlank: false,
                validator: function(val) {
                    var mstId = me.down('messstelle').getValue();
                    var foundIdx = me.store.findBy(function(obj) {
                        return val === obj.get('tag')
                            && mstId === obj.get('mstId')
                            && me.getRecord().get('id') !== obj.get('id');
                    });
                    if (foundIdx > -1) {
                        return i18n.getMsg(
                            'tag.createwindow.err.tagalreadyexists');
                    }
                    return true;
                }
            }, {
                name: 'mstId',
                xtype: 'messstelle',
                fieldLabel: i18n.getMsg('mst_id'),
                validator: function() {
                    var mstId = me.down('messstelle').getValue();
                    var tag = me.down('textfield[name=tag]').getValue();
                    var foundIdx = me.store.findBy(function(obj) {
                        return mstId === obj.get('mstId')
                            && tag === obj.get('tag')
                            && me.getRecord().get('id') !== obj.get('id');
                    });
                    if (foundIdx > -1) {
                        return i18n.getMsg(
                            'tag.createwindow.err.tagalreadyexists');
                    }
                    return true;
                },
                filteredStore: true
            }, {
                name: 'netzbetreiberId',
                xtype: 'netzbetreiber',
                fieldLabel: i18n.getMsg('netzbetreiberId'),
                filteredStore: true
            }, {
                name: 'typId',
                fieldLabel: i18n.getMsg('tagtyp'),
                allowBlank: false,
                xtype: 'tagtyp'
            }, {
                name: 'gueltigBis',
                xtype: 'datefield',
                fieldLabel: i18n.getMsg('tag.gueltigBis')
            }]
        }];
        this.callParent(arguments);
    },

    setRecord: function(tagRecord) {
        this.getForm().loadRecord(tagRecord);
        this.setReadOnly();
    },

    setReadOnly: function() {
        var ro = this.getForm().getRecord().get('readonly');
        this.down('textfield[name=tag]').setReadOnly(ro);
        this.down('messstelle').setReadOnly(ro);
        this.down('netzbetreiber').setReadOnly(ro);
        this.down('tagtyp').setReadOnly(ro);
        this.down('datefield[name=gueltigBis]').setReadOnly(ro);
    }
});
