/* Copyright (C) 2019 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window to request changed coordinates from the server
 */
Ext.define('Lada.view.window.ChangeKDA', {
    extend: 'Ext.window.Window',
    alias: 'widget.changeKDA',
    requires: [
        'Lada.view.widget.KoordinatenArt'
    ],
    collapsible: false,
    maximizable: false,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    defaults: {
        labelWidth: 140,
        margin: '5,0,5,0'
    },
    autoShow: true,
    constrain: true,
    parentWindow: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.items = [{
            xtype: 'koordinatenart',
            fieldLabel: i18n.getMsg('changeKDA.originalKDA'),
            readOnly: true,
            name: 'originalKDA'
        }, {
            xtype: 'selectabledisplayfield',
            fieldLabel: i18n.getMsg('changeKDA.originalX'),
            name: 'originalX'
        }, {
            xtype: 'selectabledisplayfield',
            fieldLabel: i18n.getMsg('changeKDA.originalY'),
            name: 'originalY'
        }, {
            xtype: 'koordinatenart',
            fieldLabel: i18n.getMsg('changeKDA.newKDA'),
            name: 'newKDA'
        }, {
            xtype: 'selectabledisplayfield',
            fieldLabel: i18n.getMsg('changeKDA.newX'),
            name: 'newX'
        }, {
            xtype: 'selectabledisplayfield',
            fieldLabel: i18n.getMsg('changeKDA.newY'),
            name: 'newY'
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox'
            },
            width: '100%',
            name: 'messageContainer',
            hidden: true,
            items: [{
                xtype: 'image',
                src: 'resources/img/dialog-warning.png',
                width: 20,
                height: 20,
                margin: 5
            }, {
                xtype: 'textareafield',
                fieldLabel: '',
                name: 'message',
                width: '100%',
                editable: false,
                inputWrapCls: '',
                triggerWrapCls: '',
                fieldStyle: 'background:none',
                submitValue: false
            }]
        }, {
            xtype: 'container',
            layout: 'hbox',
            items: [{
                xtype: 'button',
                action: 'apply',
                text: i18n.getMsg('apply'),
                disabled: true,
                flex: 1
            }, {
                xtype: 'button',
                action: 'cancel',
                text: i18n.getMsg('cancel'),
                flex: 1,
                handler: function() {
                    me.close();
                }
            }]
        }];
        this.callParent(arguments);
    }
});

