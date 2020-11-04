/* Copyright (C) 2013 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Combobox for Deskriptor
 */
Ext.define('Lada.view.widget.Deskriptor', {
    extend: 'Lada.view.widget.base.ComboBox',
    alias: 'widget.deskriptor',
    displayField: 'beschreibung',
    valueField: 'id',
    searchValueField: 'sn',
    // Enable filtering of comboboxes
    triggerAction: 'all',
    typeAhead: false,
    layer: null,
    lastQuery: null,
    queryMode: 'local',
    allowBlank: true,
    remoteFilter: false,
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><div class="x-combo-list-item  x-boundlist-item" >' +
        '<tpl if="sn &gt; 9">{sn} - {beschreibung}</tpl>',
        '<tpl if="sn &lt; 10">0{sn} - {beschreibung}</tpl></div></tpl>'),
    displayTpl: Ext.create('Ext.XTemplate',
        '<tpl for="."><tpl if="sn &gt; 9">{sn} - {beschreibung}</tpl>',
        '<tpl if="sn &gt; 0 &amp;&amp;sn &lt; 10">0{sn} - {beschreibung}</tpl>',
        '</tpl>'),

    initComponent: function() {
        this.store = Ext.create('Lada.store.Deskriptoren');
        var me = this;
        this.store.on('load', function() {
            this.insert(0, {sn: 0, beschreibung: 'leer'});
            if (this.proxy.extraParams.layer > 0 &&
                !this.proxy.extraParams.parents) {
                this.removeAll();
            }
            try {
                me.down('combobox').setStore(this);
            } catch (e) {
                Ext.log({msg: 'Initializing deskriptor widget failed: ' + e, level: 'warn'});
            }
        }, this.store);

        this.callParent(arguments);
        var combobox = this.down('combobox');
        combobox.isFormField = false;
        combobox.on('focus', this.focusfn);
        // normal clear action does not trigger the descriptorselect handler
        // to delete child deskriptoren.
        combobox.triggers.clear.handler = function() {
            this.select('0');
            this.fireEvent('select', this, this.store.getAt(0));
        };
    },

    getParents: function(field) {
        var set = field.up('fieldset');
        var allS = set.items.items;
        var p = '';
        for (var i = 0; i < field.up('deskriptor').layer; i++) {
            if (allS[i].getValue() > 0) {
                p += allS[i].getValue();
                if (i < field.up('deskriptor').layer - 1) {
                    p += ', ';
                }
            }
        }
        return p;
    },

    focusfn: function(field) {
        var deskriptor = field.up('deskriptor');
        if (deskriptor.layer === 0) {
            deskriptor.store.proxy.extraParams = {'layer': deskriptor.layer};
        } else {
            var parents = deskriptor.getParents(field);
            if (parents !== '' || parents !== undefined) {
                deskriptor.store.proxy.extraParams = {
                    'layer': deskriptor.layer,
                    'parents': parents
                };
                deskriptor.store.load();
            } else {
                deskriptor.store.proxy.extraParams = {
                    'layer': deskriptor.layer
                };
                deskriptor.store.load();
            }
        }
    },

    setValue: function(value) {
        this.down('combobox').setValue(value);
    },

    setStore: function(store) {
        this.down('combobox').setStore(store);
    },

    showWarnings: function(warnings) {
        this.clearWarningOrError();
        var img = this.down('image[name=warnImg]');
        var tt = Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: warnings
        });
        this.warning = tt;
        var cb = this.down('combobox');
        if (cb.inputWrap && cb.inputEl) {
            cb.inputWrap.addCls('x-lada-warning-field');
            cb.inputEl.addCls('x-lada-warning-field');
        } else {
            cb.onAfter({
                render: {
                    fn: function(el) {
                        el.inputWrap.addCls('x-lada-warning-field');
                        el.inputEl.addCls('x-lada-warning-field');
                    },
                    single: true
                }
            });
        }
        img.show();
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            var warningText = this.name + ': ' + warnings;
            fieldset.showWarningOrError(true, warningText);
        }
    },

    showErrors: function(errors) {
        this.clearWarningOrError();
        var img = this.down('image[name=errorImg]');
        var warnImg = this.down('image[name=warnImg]');
        warnImg.hide();
        this.error = Ext.create('Ext.tip.ToolTip', {
            target: img.getEl(),
            html: errors
        });
        this.down('combobox').markInvalid('');
        img.show();
        var fieldset = this.up('fieldset[collapsible=true]');
        if (fieldset) {
            var i18n = Lada.getApplication().bundle;
            var errorText = i18n.getMsg(this.name) + ': ' + errors;
            fieldset.showWarningOrError(false, '', true, errorText);
        }
    },

    clearWarningOrError: function() {
        if (this.warning) {
            this.warning.destroy();
        }
        if (this.error) {
            this.error.destroy();
        }
        this.down('image[name=errorImg]').hide();
        this.down('image[name=warnImg]').hide();
        var cb = this.down('combobox');
        if (cb.inputWrap && cb.inputEl) {
            cb.inputWrap.removeCls('x-lada-warning-field');
            cb.inputWrap.removeCls('x-lada-error-field');
            cb.inputEl.removeCls('x-lada-warning-field');
            cb.inputEl.removeCls('x-lada-error-field');
        } else {
            cb.onAfter({
                render: {
                    fn: function(el) {
                        el.inputWrap.removeCls('x-lada-warning-field');
                        el.inputWrap.removeCls('x-lada-error-field');
                        el.inputEl.removeCls('x-lada-warning-field');
                        el.inputEl.removeCls('x-lada-error-field');
                    },
                    single: true
                }
            });
        }
        cb.clearInvalid();
    }
});
