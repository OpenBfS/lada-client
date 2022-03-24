/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window for creating new tags.
 */
Ext.define('Lada.view.window.TagCreate', {
    extend: 'Ext.window.Window',
    alias: 'widget.tagcreatewindow',

    layout: 'vbox',
    width: 300,
    record: null,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.title = i18n.getMsg('tag.createWindow.title');
        this.items = [
            {
                xtype: 'fieldset',
                layout: {
                    type: 'vbox'
                },
                items: [{
                    xtype: 'textfield',
                    width: '100%',
                    name: 'tag',
                    margin: '5 5 5 5',
                    msgTarget: 'under',
                    //validate that text is not empty and name does not already exists
                    validator: function(val) {
                        if (val.trim().length === 0) {
                            return i18n.getMsg('tag.createwindow.err.invalidtagname');
                        }
                        if (val.length === 0) {
                            return i18n.getMsg('tag.createwindow.err.emptytagname');
                        }
                        if (me.tagWidget.tagExists(val)) {
                            return i18n.getMsg('tag.createwindow.err.tagalreadyexists');
                        }
                        return true;
                    }
                },{

                    name: 'mst',
                    xtype: 'messstelle',
                    readOnly: true
                    //TODO check/filter list of Lada.mst []
                }, {
                    name: 'netzbetreiber',
                    xtype: 'netzbetreiber',
                    readOnly: true
                    //TODO check/filter list of Lada.netzbetreiber []
                }, {
                    name: 'typ',
                    readOnly: true
                    // TODO validate if type: allowed.
                    // TODO xtype tagTyp
                }, {
                    name: 'gueltigBis',
                    xtype: 'datefield',
                    readOnly: true
                    // TODO optional, should be "infinite" for global tags
                }]
            } , {
                xtype: 'container',
                layout: 'hbox',
                items: [{
                    xtype: 'button',
                    text: i18n.getMsg('save'),
                    action: 'save',
                    margin: '5 5 5 5'
                }, {
                    xtype: 'button',
                    text: i18n.getMsg('cancel'),
                    margin: '5 5 5 5',
                    handler: function() {
                        me.close();
                    }
                }]
            }
        ];
        this.initData();
        this.callParent(arguments);

    },
    initData: function() {
        this.record = Ext.create('Lada.model.Tag');
    }
});
