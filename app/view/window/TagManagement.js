/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Window for creating and managing tags.
 */
Ext.define('Lada.view.window.TagManagement', {
    extend: 'Ext.window.Window',
    layout: 'vbox',
    recordId: null,
    record: null,
    alias: 'widget.tagmanagementwindow',
    collapsible: true,
    maximizable: true,

    /**
     * This function initialises the Window
     */
    initComponent: function() {
        var i18n = Lada.getApplication().bundle;
        var me = this;
        this.items = [
            {
                xtype: 'fieldset',
                layout: {
                    type: 'vbox'
                },
                items: [{
                    xtype: 'textfield',
                    name: 'tag',
                    fieldLabel: i18n.getMsg('name'),
                    msgTarget: 'under',
                    validator: function(val) {
                        if (val.trim().length === 0) {
                            return i18n.getMsg(
                                'tag.createwindow.err.invalidtagname');
                        }
                        if (val.length === 0) {
                            return i18n.getMsg(
                                'tag.createwindow.err.emptytagname');
                        }
                        if (me.tagWidget.tagExists(val)) {
                            // TODO don't check against itself
                            return i18n.getMsg(
                                'tag.createwindow.err.tagalreadyexists');
                        }
                        return true;
                    }
                }, {
                    name: 'mst',
                    xtype: 'messstelle',
                    fieldLabel: i18n.getMsg('mst_id'),
                    filteredStore: true
                }, {
                    name: 'netzbetreiber',
                    xtype: 'netzbetreiber',
                    fieldLabel: i18n.getMsg('netzbetreiberId'),
                    filteredStore: true
                }, {
                    name: 'typId',
                    readOnly: true,
                    fieldLabel: i18n.getMsg('tagtyp'),
                    xtype: 'tagtyp'
                    // TODO validate if typ: allowed.
                    // TODO on change: set me.setGueltigBis
                }, {
                    name: 'gueltigBis',
                    xtype: 'datefield',
                    fieldLabel: i18n.getMsg('tag.gueltigBis')
                }, {
                    // TODO "infinite" display for validity -1 tags
                    xtype: 'displayfield', // TODO: no label text field
                    hidden: true,
                    name: 'infinitegueltigBis',
                    value: i18n.getMsg('tag.gueltigBis.infinite')
                }]
            }, {
                xtype: 'container',
                layout: 'hbox',
                items: [{
                    xtype: 'button',
                    text: i18n.getMsg('save'),
                    action: 'save',
                    margin: '5 5 5 5'
                }, {
                    xtype: 'button',
                    action: 'delete',
                    text: i18n.getMsg('delete'),
                    margin: '5 5 5 5',
                    hidden: true
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
        this.callParent(arguments);
        this.initData();

    },
    initData: function() {
        var i18n = Lada.getApplication().bundle;
        if (!this.recordId) {
            this.title = i18n.getMsg('tag.createWindow.title');
            this.record = Ext.create('Lada.model.Tag', {
                mst: Lada.mst[0],
                netzbetreiber: Lada.netzbetreiber[0],
                readonly: false
            });
            this.down('messstelle').setValue(Lada.mst[0]);
            this.down('netzbetreiber').setValue(Lada.netzbetreiber[0]);
        } else {
            this.loadRecord(this.recordId); //TODO check if correctly used here
            this.title = i18n.getMsg(
                'tag.manageWindow.title', this.record.get('tag'));
        }
        var ro = this.record.get('readonly');
        this.down('textfield[name=tag]').setReadOnly(ro);
        this.down('messstelle').setReadOnly(ro);
        this.down('netzbetreiber').setReadOnly(ro);
        if (!ro && this.down('tagtyp').getStore().getCount() > 1){
            this.down('tagtyp').setReadOnly(false);
        } else {
            this.down('tagtyp').setReadOnly(true);
        }
        this.down('button[action=delete]').setDisabled(ro);
        // this.down('[name=infinitegueltigBis]').setHidden() for some tags
    },
    /**
     * (re)sets the default validity at change of tag type.
     * @param {*} tagtyp
     */
    setGueltigBis: function() {
        var validity = this.down('tagtyp').getStore().get('validity');
        if (validity === -1) {
            this.down('infinitegueltigBis').setHidden(false);
            this.down('gueltigBis').setDisabled(true);
            this.down('gueltigBis').clearValue();
            this.record.set('gueltigBis', -1); //TODO must not affect datefield
        } else {
            var until = new Date().valueOf() + ( 24 * 3600000 * validity );
            this.down('gueltigBis').setValue(new Date(until));
            this.down('gueltigBis').setDisabled(false);
            this.down('infinitegueltigBis').setHidden(true);
        }
    },

    saveCallBack: function() {
        //TODO
        //(re)load record; reload store
        //reset save button
    }, // TODO
    deleteCallBack: function() {
        // TODO announce success/failure
    },
    failureCallBack: function() {
        // TODO reload record, show errors
    }
    // TODO enable save if dirty
});
