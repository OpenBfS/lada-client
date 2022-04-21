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

    model: 'Lada.model.Tag',

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
        var i18n = Lada.getApplication().bundle;
        this.items = [{
            xtype: 'fieldset',
            layout: {
                type: 'vbox'
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
                msgTarget: 'under'
            }, {
                name: 'mstId',
                xtype: 'messstelle',
                fieldLabel: i18n.getMsg('mst_id'),
                filteredStore: true
            }, {
                name: 'netzbetreiberId',
                xtype: 'netzbetreiber',
                fieldLabel: i18n.getMsg('netzbetreiberId'),
                filteredStore: true
            }, {
                name: 'typId',
                fieldLabel: i18n.getMsg('tagtyp'),
                xtype: 'tagtyp'
            }, {
                name: 'gueltigBis',
                xtype: 'datefield',
                fieldLabel: i18n.getMsg('tag.gueltigBis')
            }, {
                xtype: 'selectabledisplayfield',
                hidden: true,
                name: 'infinitegueltigBis',
                value: i18n.getMsg('tag.gueltigBis.infinite'),
                submitValue: false
            }]
        }];
        this.callParent(arguments);
    },

    setRecord: function(tagRecord) {
        this.getForm().loadRecord(tagRecord);
        this.down('messstelle').setValue(tagRecord.get('mstId'));
        this.down('tagtyp').setValue(tagRecord.get('typId'));
        this.down('netzbetreiber').setValue(tagRecord.get('netzbetreiberId'));
        this.setReadOnly();
    },

    setReadOnly: function() {
        var ro = this.getForm().getRecord().get('readonly');
        this.down('textfield[name=tag]').setReadOnly(ro);
        this.down('messstelle').setReadOnly(ro);
        this.down('netzbetreiber').setReadOnly(ro);
        this.down('tagtyp').setReadOnly(ro);
        this.down('datefield[name=gueltigBis]').setReadOnly(ro);
        this.up('window').down('button[action=delete]').setDisabled(ro);
        // note: See controller/form/Tag for save button enabling
    }
});
