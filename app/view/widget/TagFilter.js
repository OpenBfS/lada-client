/* Copyright (C) 2022 by Bundesamt fuer Strahlenschutz
 * Software engineering by Intevation GmbH
 *
 * This file is Free Software under the GNU GPL (v>=3)
 * and comes with ABSOLUTELY NO WARRANTY! Check out
 * the documentation coming with IMIS-Labordaten-Application for details.
 */

/**
 * Show tags the user cannot (un)assign in an extra readOnly-combobox
 * next to an editable combobox with assignable tags.
 */
Ext.define('Lada.view.widget.TagFilter', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.tagfilterwidget',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    defaults: {
        isFormField: false
    },

    initComponent: function() {
        this.items = [{
            xtype: 'tagwidget',
            name: 'readonly',
            hidden: true, // Show only in presence of un-assignable tags
            readOnly: true
        }, {
            xtype: 'tagwidget',
            name: this.name
        }];
        this.callParent(arguments);

        if (this.value) {
            var store = Ext.data.StoreManager.get('tags');
            if (!store) {
                store = Ext.create('Lada.store.Tag', {
                    storeId: 'tags'
                });
            }

            // Set initial values in tag widgets
            var ids = this.value.split(',');
            var me = this;
            store.load(function(recs, op, success) {
                if (!success) {
                    var i18n = Lada.getApplication().bundle;
                    Ext.Msg.alert(
                        i18n.getMsg('err.msg.generic.title'),
                        i18n.getMsg('err.msg.generic.body'));
                }

                var assignable = ids.filter(function(id) {
                    var tag = store.getById(id);
                    if (tag) {
                        return tag.isAssignable();
                    }
                    return false;
                });

                var tagWidget = me.down('tagwidget[name=' + me.name + ']');
                tagWidget.suspendEvent('change');
                tagWidget.setValue(assignable);
                tagWidget.resumeEvent('change');

                var unassignable = Ext.Array.difference(ids, assignable);
                if (unassignable.length) {
                    var readonlyWidget = me.down('tagwidget[name=readonly]');
                    readonlyWidget.suspendEvent('change');
                    readonlyWidget.setValue(unassignable);
                    readonlyWidget.resumeEvent('change');
                    readonlyWidget.setHidden(false);
                }
            });
        }
    }
});
