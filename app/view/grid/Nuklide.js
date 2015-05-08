/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/*
 * Grid to list Nuklide
 */
Ext.define('Lada.view.grid.Nuklide', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.nuklidegrid',

    selType: 'checkboxmodel',
    selModel: {
        checkOnly: false,
        injectCheckbox: 0
    },
    requires: [
        'Lada.view.widget.Messgroesse'
    ],

    maxHeight: 350,
    minHeight: 110,
    viewConfig: {
        deferEmptyText: false
    },
    margin: '0, 5, 5, 5',

    recordId: null,

    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        this.emptyText = i18n.getMsg('emptytext.nuklidgrid');

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
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
        }];
        this.columns = [{
            header: i18n.getMsg('nuklid'),
            dataIndex: 'id',
            flex: 1,
            renderer: function(value) {
                if (!value || value === '') {
                    return '';
                }
                var store = Ext.data.StoreManager.get('messgroessen');
                if (!store) {
                    store = Ext.create('Lada.store.Messgroessen');
                }
                return store.findRecord('id', value, 0, false, false, true).get('messgroesse');
            }
        }];
        this.initData();
        this.callParent(arguments);
    },
    initData: function() {
        if (this.store) {
            this.store.removeAll();
        }
    },
    setData: function(store) {
       this.setLoading(true);
       this.reconfigure(store);
       this.setLoading(false);
    },
    setReadOnly: function(b) {
        if (b == true){
            //Readonly
            if (this.getPlugin('rowedit')){
                this.getPlugin('rowedit').disable();
            }
            this.down('button[action=discard]').disable();
            this.down('button[action=save]').disable();
        }else{
            //Writable
            if (this.getPlugin('rowedit')){
                this.getPlugin('rowedit').enable();
            }
            this.down('button[action=discard]').enable();
            this.down('button[action=save]').enable();
         }
    }
});
