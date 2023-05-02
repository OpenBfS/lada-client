/* Copyright (C) 2023 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */
Ext.define('Lada.view.panel.SiteImages', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.siteimages',
    name: 'siteimages',
    layout: 'vbox',
    baseUrl: 'lada-server/rest/site/',
    imgPath: '/img',
    mapPath: '/map',
    site: null,
    width: '100%',
    height: 600,

    initComponent: function() {
        this.initUI();
        this.callParent(arguments);
        var siteId = this.site.get('id');
        var dc = '?dc=' + Date.now();
        this.down('image[name=imageImg]')
            .setSrc(this.baseUrl + siteId + this.imgPath + dc);
        this.down('image[name=mapImg]')
            .setSrc(this.baseUrl + siteId + this.mapPath + dc);
        //Set readonly if site is readonly or phantom
        this.setReadonly(this.site.get('readonly') || this.site.phantom);
    },

    initUI: function() {
        var i18n = Lada.getApplication().bundle;
        this.items =
            [{
                layout: 'vbox',
                align: 'fill',
                items: [{
                    xtype: 'panel',
                    margin: 5,
                    width: 550,
                    height: 300,
                    tbar: [{
                        xtype: 'label',
                        text: i18n.getMsg('form.site.label.photo')
                    }, {
                        xtype: 'filefield',
                        buttonText: i18n.getMsg('search'),
                        name: 'photofile',
                        grow: true,
                        growMin: 200,
                        listeners: {
                            change: function(field, value) {
                                var newValue = value.replace(
                                    /C:\\fakepath\\/g, '');
                                field.setRawValue(newValue);
                                this.up('panel')
                                    .down('button[name=uploadPhoto]')
                                    .setDisabled(false);
                            }
                        }

                    }, {
                        xtype: 'tbfill'
                    }, {
                        xtype: 'button',
                        name: 'uploadPhoto',
                        disabled: true,
                        text: i18n.getMsg('form.site.button.upload'),
                        handler: function(button) {
                            var widget = button.up('siteimages');
                            var fileField = widget
                                .down('filefield[name=photofile]');
                            var imgCmp = widget.down('image[name=imageImg]');
                            widget.uploadFile(
                                fileField, widget.imgPath, imgCmp);
                        }
                    }, {
                        xtype: 'button',
                        name: 'clearPhoto',
                        text: i18n.getMsg('form.site.button.clear'),
                        handler: function(button) {
                            var widget = button.up('siteimages');
                            var imgCmp = widget.down('image[name=imageImg]');
                            widget.deleteImage(widget.imgPath, imgCmp);
                        }
                    }],
                    items: [{
                        xtype: 'image',
                        name: 'imageImg'
                    }]
                }, {
                    xtype: 'panel',
                    margin: 5,
                    width: 550,
                    height: 300,
                    tbar: [{
                        xtype: 'label',
                        text: i18n.getMsg('form.site.label.map')
                    }, {
                        xtype: 'filefield',
                        buttonText: i18n.getMsg('search'),
                        name: 'mapfile',
                        grow: true,
                        growMin: 200,
                        listeners: {
                            change: function(field, value) {
                                var newValue = value.replace(
                                    /C:\\fakepath\\/g, '');
                                field.setRawValue(newValue);
                                this.up('panel').down('button[name=uploadMap]')
                                    .setDisabled(false);
                            }
                        }
                    }, {
                        xtype: 'tbfill'
                    }, {
                        xtype: 'button',
                        name: 'uploadMap',
                        disabled: true,
                        text: i18n.getMsg('form.site.button.upload'),
                        handler: function(button) {
                            var widget = button.up('siteimages');
                            var fileField = widget
                                .down('filefield[name=mapfile]');
                            var imgCmp = widget
                                .down('image[name=mapImg]');
                            widget.uploadFile(
                                fileField, widget.mapPath, imgCmp);
                        }
                    }, {
                        xtype: 'button',
                        name: 'clearMap',
                        text: i18n.getMsg('form.site.button.clear'),
                        handler: function(button) {
                            var widget = button.up('siteimages');
                            var imgCmp = widget.down('image[name=mapImg]');
                            widget.deleteImage(widget.mapPath, imgCmp);
                        }
                    }],
                    items: [{
                        xtype: 'image',
                        name: 'mapImg'
                    }]
                }]
            }];
    },

    uploadFile: function(fileInput, path, component) {
        var me = this;
        var reader = new FileReader();
        var file = fileInput.fileInputEl.dom.files[0];
        if (!file) {
            return;
        }
        me.setLoading(true);
        reader.onload = function(evt) {
            if (evt.target.readyState === FileReader.DONE) {
                const dataUrl = evt.target.result;
                Ext.Ajax.request({
                    url: me.baseUrl + me.site.get('id') + path,
                    method: 'POST',
                    scope: me,
                    jsonData: {file: dataUrl},
                    success: function() {
                        me.setLoading(false);
                        var time = Date.now();
                        var url = this.baseUrl + this.site.get('id') + path;
                        url += '?dc=' + time;
                        component.setSrc(null);
                        component.setSrc(url);
                    },
                    failure: function(response) {
                        me.setLoading(false);
                        var i18n = Lada.getApplication().bundle;
                        var msg = 'err.msg.generic.body';
                        if (response.status === 502
                                || response.status === 413) {
                            msg = 'form.site.error.uploadsize';
                        }
                        if (response.status === 401) {
                            msg = 'http-401';
                        }
                        Ext.Msg.alert(
                            i18n.getMsg('form.site.error.uploadtitle'),
                            i18n.getMsg(msg), Ext.emptyFn);
                    }
                });
            }
        };
        reader.readAsDataURL(file);
    },

    deleteImage: function(path, component) {
        Ext.Ajax.request({
            url: this.baseUrl + this.site.get('id') + path,
            method: 'DELETE',
            success: function() {
                component.setSrc(null);
            },
            failure: function(response) {
                var i18n = Lada.getApplication().bundle;
                var msg = 'err.msg.generic.body';
                if (response.status === 401) {
                    msg = 'http-401';
                }
                Ext.Msg.alert(i18n.getMsg('form.site.error.deletetitle'),
                    i18n.getMsg(msg), Ext.emptyFn);
            }
        });
    },

    setReadonly: function(readonly) {
        this.down('filefield[name=photofile]').setVisible(!readonly);
        this.down('button[name=uploadPhoto]').setVisible(!readonly);
        this.down('button[name=clearPhoto]').setVisible(!readonly);
        this.down('filefield[name=mapfile]').setVisible(!readonly);
        this.down('button[name=uploadMap]').setVisible(!readonly);
        this.down('button[name=clearMap]').setVisible(!readonly);
    }
});
