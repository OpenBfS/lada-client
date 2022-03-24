/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window for managing a tag, it's organisation level and expiration date
 */
// TODO

Ext.define('Lada.view.window.TagManagement', {
    extend: 'Ext.window.Window',
    alias: 'tagmanagementwindow',

    layout: 'vbox',
    width: 300,
    store: null,
    record: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.title = i18n.getMsg(
            'title.manageTag' + this.record.get('tag'));
        this.items = [{
            xtype: 'textfield',
            width: '100%',
            name: 'tag',
            margin: '5 5 5 5',
            msgTarget: 'under'
        }, {
            // editing name possible ? validate for uniqueness
            // xtype: 'tagTyp'
            //name: 'typ'
        }, {
            // editable ?
            // expiration gueltig_bis
            // show/editing gueltigbis -> if -1 "unendlich", if < today "disabled"
        },
        // TODO:
        // check if editable
        // enable save if edited
        // check if deletable
        // upgrading a tag
        {
            xtype: 'container',
            layout: 'hbox',
            items: [{
                xtype: 'button',
                action: 'save',
                text: i18n.getMsg('save'),
                margin: '5 5 5 5'
            }, {
                xtype: 'button',
                action: 'delete',
                text: i18n.getMsg('delete'),
                margin: '5 5 5 5'
            },
            {
                xtype: 'button',
                text: i18n.getMsg('cancel'),
                margin: '5 5 5 5',
                handler: function() {
                    me.close();
                }
            }]
        }];
        this.callParent(arguments);
    }

// TODO link tagcreatewindow
// TODO check loadRecord;
// TODO check initData

});
